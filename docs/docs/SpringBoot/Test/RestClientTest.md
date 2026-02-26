# 외부 API 테스트 

### MockMvc
> Servlet Container 생성하지 않음, 서버 입장

### MockRestServiceServer 
> Servlet Container 생성, 클라이언트 입장..
```java
@RestClientTest(value={UserService.class})
class UserServiceTest {
    @Autowired
    private final UserService userService;
    @Autowired
    private RestTemplate restTemplate;
    private MockRestServiceServer mockServer;
    
    @Before
    public void setUp() {
        mockServer = MockRestServiceServer.createServer(restTemplate);
    }
    
    @Test
    public void testAuth() {
        mockServer.expect(ExpectedCount.once(),
                requestTo(new URI("http://localhost/user/auth/100"))
                        .andExpect(method(HttpMethod.GET))
                        .andRespond(withStatus(HttpStatus.OK)
                            .body("{\"result\":true}"))
        );
        // when
        UserAuth userAuth = userService.getAuth(100);
        // then
        mockServer.verify();
        Assert.assertEquals(true, userAuth.getAuth());
        
    }
}
```

### MockWebServer
```java
class UserServiceTest {
    @Autowired
    private final UserService userService;
    private MockWebServer mockWebServer;
    
    @Before
    public void setUp() {
        mockWebServer = new MockWebServer();
        mockWebServer.start();
    }
    @After
    public void tearDown() {
        mockWebServer.shutdown();
    }
    
    @Test 
    public void testAuth() {
        mockWebServer.enqueue(new MockResponse()
                .setBody("{\"result\": true}")
                .addHeader("Content-Type", "application/json"));  
        
        // when
        Mono<UserAuth> userAuth = userService.getAuth(100);
        // then
        StepVerifier.create(userAuth)
                .expectNextmatches(user -> user.getAuth()
                        .equals(true))
                .verifyComplete();
    }
    
    @Test
    public void testDirect() {
        Mono<String> client = WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector())
                .baseUrl(mockWebServer.url("/").toString())
                .build();
        
        mockWebServer.enqueue(new MockResponse()
                .setBody("{\"result\": true}")
                .addHeader("Content-Type", "application/json"));

        // when
        Mono<String> responseBody = client.get().uri(GET_URL)
                .header("Authorization", "mytoken")
                .retrieve()
                .bodyToMono(String.class);
        // then
        StepVerifier.create(responseBody)
                .consumeNextWith(body -> assertThat(body).isEqualTo("{\"result\": true}"))
                .expectNextCount(0)
                .expectComplete()
                .verify();
    }
}
```

### WireMock
```java
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AuthConfigureWireMock(port = 0)
class UserServiceTest {
    @Autowired
    private UserService userService;
    
    @Before
    public void setUp() {
        this.userService.setBase("http://localhost:" +
                this.environmeng.getProperty("wiremock.server.port"));
    }
    
    @Test
    public void testAuth() {
        StubMapping accept = stubFor(
                get(urlEqualTo("/user/auth/100"))
                        .willReturn(aResponse()
                                .withStatus(HttpStatus.OK)
                                .withBody("{\"result\":true}")
                        )
        );
        
        // when
        UserAuth userAuth = userService.getAuth(100);
        // then
        Assert.assertEquals(true, userAuth.getAuth());
    }
}
```
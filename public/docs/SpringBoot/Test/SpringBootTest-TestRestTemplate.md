# Spring Boot Test - @SpringBootTest & TestRestTemplate

@SpringBootTest로 내장 톰캣을 이용해 랜덤포트로 웹서버를 띄울때 사용

### TestRestTemplate
* 열려있는 포트로 자동 동작
```java
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class TestControllerTest {
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    public void test() {
        String response = restTemplate.getForObject("/test", String.class);
        System.out.println(response);
    }
}
```
### WebTestClient
Spring5에서 새로 추가된 WebClient 의 WebTestClient

```java
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class TestControllerTest {
    @Autowired
    private WebTestClient webTestClient;

    @Test
    public void test() {
        String response = webTestClient.get().uri("/test").exchange()
                .accept(MediaType.APPLICATION_JSON)
                .expectStatus().isOk()
                .expectBody(String.class).isEqualTo("test");
    }
}
```
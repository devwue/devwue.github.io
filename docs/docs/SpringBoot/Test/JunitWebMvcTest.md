# Slice Test

### @WebMvcTest
```java
@RunWith(SpringRunner.class)
@WebMvcTest(MyTestController.class)
@ActiveProfiles(profiles = {"test"})
public class MyTestControllerTest {
    @MockBean
    TestService testService;
    
    @Autowired
    MockMvc mockMvc;
    
    @Test
    public void do_it_test() {
        // given
        String result = "success";
        given(testService.invokedMethod()).willReturn(result);
        // when
        mockMvc.perform(post("/test/{userId}", "kildong.hong")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"phoneNo\":\"010-1234-5678\"}")
                ).andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string("success"));
    }
}
```
* jsonPath : json 객체를 탐색하기 위한 표준화된 방법
  ```
  andExpect(jsonPath("$.name").value("gildong.hong))
  ```
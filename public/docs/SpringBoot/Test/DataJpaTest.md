# @DataJpaTest
> in-memory test, 테스트가 끝나면 자동 rollback

만약, 실DB 테스트를 하고 싶다면?
```java
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@DataJpaTest
public class MyDataJpaTest {
    @Autowired
    private UserRepository userRepository;
    
    @Test
    public void test() {
        User user = User.builder()
                .setId(1004)
                .setName("test")
                .setSex("man")
                .setAge(19)
                .build();
        
        // when
        userRepository.save(user);
    }
}
```
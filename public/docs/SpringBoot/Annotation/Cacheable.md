# Spring - @Cacheable

dependency `spring-boot-starter-cache`

### @Cacheable
```java
@EnableCaching // 인지가 되어야 함...
@Configuration
public class TestConfig { }

@Service
public class TestService {
    @Cacheable
    public String getName(String name) {
        return "cached name..." + name;
    }
}
```
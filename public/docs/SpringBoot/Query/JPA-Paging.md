# JPA - 페이징 

### 기본 페이지 번호 변경
0부터 시작을 하는데, 1부터 시작 하도록 변경 가능
```java
@Configuration
public class PageableConfig {
    @Bean
    PageableHandlerMethodArgumentResolverCustomizer pageableResolverCustomizer() {
        return pageableResolver -> pageableResolver.setOneIndexedParameters(true);
    }
}
```
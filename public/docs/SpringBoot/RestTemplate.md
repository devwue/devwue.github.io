# RestTemplate, Connection Pool
> 대상 서버가 Keep-Alive 지원 해야 활용 가능

* Connection Pool Configuration

````java
public class RestTemplateConfig {
    @Bean
    HttpClient httpClient() {
        return HttpClientBuilder.create()
                .setMaxConnPerRoute(5)
                .setMaxConnTotal(20)
                .build();
    }
    
    @Bean
    HttpComponentsClientHttpRequestFactory factory(HttpClient client) {
        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
        factory.setReadTimeout(5000);
        factory.setConnectionTimeout(3000);
        factory.setHttpClient(httpClient);
        return factory;
    }
    
    @Bean
    RestTemplate restTemplate(HttpComponentsClientHttpRequestFactory factory) {
        return new RestTemplate(factory);
    }
}
````
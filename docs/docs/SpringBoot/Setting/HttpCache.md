# Spring, HTTP Caching
MSA 구조로 인해서 API 호출을 많이 할 수 밖에 없는데, 잦은 API 호출로 인해 응답값이 늦어지기도 하고 불편..
여기에 캐시를 좀 태우면 그나마, 좀 나은 속도 보장 가능

#### dependency
```groovy
implementation 'org.springframework.boot:spring-boot-starter-cache'
implementation 'org.apache.httpcomponents:httpclient-cache'
```

### RestTemplate
#### HttpClient with EhCache
```java
public class RestTemplateConfig() {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate(clientHttpRequestFactory());
    }

    @Bean
    public ClientHttpRequestFactory clientHttpRequestFactory() {
        return new HttpComponentsClientHttpRequestFactory(
                CachingHttpClients.custom()
                        .setHttpCacheStorage(
                                new EhcacheHttpCacheStorage(getEhCache())
                        )
                        .build()
        );
    }

    private Ehcache getEhcache() {
        try (InputStream inputStream = new ClassPathResource("/ehcache.xml").getInputStream()) {
            return CacheManager.newInstance(inputStream).getEhcache("httpClientCache");
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }
}
```
### OpenFeign with @Cacheable, @EnableCaching
```java
@FeignClient(url="https://test.devwue.com")
public interface TestClient {
    @Cacheable(cacheName = "test-cache", key = "#cacheKey")
    @GetMapping("/test/api/{pathParam}")
    String testEndpoint(@PathVariable String pathParam, String cacheKey);
}
```


## Cache 
### EHCache 
OpenSource 기반의 Local Cache
```java
@Configuration
@EnableCaching(proxTargetClass = true, mode = AdviceMode.PROXY)
public class EHCacheConfig {
    @Bean
    public EhCacheManagerFactoryBean ehCacheManagerFactoryBean() {
        EhCacheManagerFactoryBean ehCacheManagerFactoryBean = new EhCacheManagerFactoryBean();
        ehCacheManagerFactoryBean.setConfigLocation(new ClassPathResource("ehcache.xml"));
        ehCacheManagerFactoryBean.setShared(true);
        return ehCacheManagerFactoryBean;
    }
    
    @Bean
    public EhCacheCachManager ehCacheCachManager(EhCacheManagerFactoryBean ehCacheManagerFactoryBean) {
        EhCacheCachManager ehCacheCachManager = new EhCacheCachManager();
        ehCacheCachManager.setCacheManager(ehCacheManagerFactoryBean.getObject());
        return ehCacheCachManager;
    }
}
```
### Redis
Redis... 뭐 왜 ㅋㅋ 중복이... 
@Cacheable 어노테이션을 이용해 CacheManager로 
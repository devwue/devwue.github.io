# Spring - @Cacheable

dependency `spring-boot-starter-cache`

### @Cacheable
```java
@EnableCaching // 인지가 되어야 함...
@Configuration
public class TestConfig { }

@CacheConfig(cacheManager = "cacheManager")
@Service
public class TestService {
    @Cacheable(cacheManager = "cacheManager")
    public String getName(String name) {
        return "cached name..." + name;
    }
    
    @CacheEvict(cacheManager = "cacheManager", value = {}, allEntries = true)
    public void modifyName(String name) {
        // name is modified..
    }
}
```

### CacheManager
CacheManager 타입 Bean이나 CacheResolver Bean을 cacheResolver 이름으로 정의하지 않으면, 아래 순서로 provider scan
1. Generic
2. JCache (EhCache3, Hazelcast, Infinispan 등)
3. EhCache2.x
4. Couchbase
5. Redis
6. Caffein
7. Simple
#### yml
```yaml
spring.cache.type: none 
# if can...
spring.cache.ehcache.config=classpath:ehcache.xml
```
#### 자동 설정, CacheManagerCustomizer 구현
CacheManager가 초기화 되기전 설정을 추가로 조정할 수 있다.

```java
@Configuration(proxyBeanMethods = false)
public class MyCacheManagerConfiguration {
    // ConcurrentMapCacheManager가 설정 된다고 하면, 없으면 호출 안되지만...
    @Bean
    public CacheManagerCustomizer<ConcurrentMapCacheManager> cacheManagerCustomizer() {
        return (cacheManager) -> cacheManager.setAllowNullValues(false);
    }

    // EmbeddedCAcheManager 설정 된다고 하면...
    @Bean
    public CacheManagerCustomizer<EmbeddedCacheManager> cacheManagerCustomizer() {
        return (cacheManager) -> cacheManager.registerListener()
                .foreach(cacheName -> cacheManager.getCache(cacheName)
                        .addListener(new CacheListener()));
    }
    
    @Slf4j
    @Listener
    public class CacheListener {
        @CacheEntryActivated
        @CacheEntryCreated
        @CacheEntryInvalidated
        @CacheEntryLoaded
        @CacheEntryModified
        @CacheEntryPassivated
        @CacheEntryRemoved
        @CacheEntryVisited
        @CacheEntryExpired
        public void processEvent(CacheEntryEvent<Object, Object> event) {
            log.debug("pre={} | {} - {} - {}", event.isPre(), event.getType(), event.getCache().getName(), event.getKey());
        }
    }
}
```
#### Redis
```yaml
spring.cache.cache-names=cache1,cache2
spring.cache.redis.time-to-live=10m
```
```java
@Configuration
@EnableCaching
public class RedisCacheConfig extends CachingConfigurerSupport {
    private final RedisConnectionFactory redisConnectionFactory;

    @Autowired
    public RedisCacheConfig(RedisConnectionFactory redisConnectionFactory) {
        this.redisConnectionFactory = redisConnectionFactory;
    }

    @Bean
    @Override
    public CacheManager cacheManager() {
        RedisCacheConfiguration configuration = RedisCacheConfiguration
                .defaultCacheConfig()
                .serializeValuesWith(RedisSerializationContext
                        .SerializationPair
                        .fromSerializer(
                                new GenericJackson2JsonRedisSerializer()))
                .entryTtl(Duration.ofMinutes(5L));

        RedisCacheManager.RedisCacheManagerBuilder builder = RedisCacheManager
                .RedisCacheManagerBuilder
                .fromConnectionFactory(redisConnectionFactory);

        return builder.cacheDefaults(configuration)
                .build();
    }
}
```

### Multi-CacheManager 
방법1: 둘중 하나를 Primary 로 지정
```java
@EnableCaching
@Configuration
public class CacheConfig extends CachingConfigurerSupport {
    @Bean
    public CacheManager cacheManager() {
        return new EhCacheCacheManager(ehCacheCacheManager().getObject());
    }

    @Bean
    @Primary
    public CacheManager cacheManagerSecond() {
        return new EhCacheCacheManager(ehCacheCacheManager().getObject());
    }
    
    @Bean
    public EhCacheManagerFactoryBean ehCacheCacheManager() {
        EhCacheManagerFactoryBean cacheManagerFactoryBean = new EhCacheManagerFactoryBean();
        cacheManagerFactoryBean.setConfigLocation(new ClassPathResource("ehcache.xml"));
        cacheManagerFactoryBean.setShared(true);
        return cacheManagerFactoryBean;
    }
}
```
방법2: CachingConfigurerSupport 상속 (또는 CachingConfigurer 구현..)
```java
@EnableCaching
@Configuration
public class CacheConfig extends CachingConfigurerSupport {
    @Bean
    public CacheManager cacheManager() {
        return new EhCacheCacheManager(ehCacheCacheManager().getObject());
    }

    @Bean
    public CacheManager cacheManagerSecond() {
        return new EhCacheCacheManager(ehCacheCacheManager().getObject());
    }

    @Bean
    public EhCacheManagerFactoryBean ehCacheCacheManager() {
        EhCacheManagerFactoryBean cacheManagerFactoryBean = new EhCacheManagerFactoryBean();
        cacheManagerFactoryBean.setConfigLocation(new ClassPathResource("ehcache.xml"));
        cacheManagerFactoryBean.setShared(true);
        return cacheManagerFactoryBean;
    }
}
```



### Reference
* [토리맘의 한글라이즈 프로젝트](https://godekdls.github.io/Spring%20Boot/caching/)

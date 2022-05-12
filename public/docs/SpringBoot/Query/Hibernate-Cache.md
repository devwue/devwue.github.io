# Spring Boot JPA - Hibernate L2 Cache (Second Level Cache)

### L1 Cache
* Hibernate Session 안에서만 유효

### L2 Cache
* Hibernate 전체 Session 과 공유 (SessionFactory를 통해...)

@Cacheable
* Entity 캐시 적용시 사용하는 어노테이션
@Cache
* Hibernate 전용
  * usage - 캐시 동시성 전략 설정
  * region - 캐시 지역 설정
  * include - 연관 객체 포함 여부 선택
    * all (default), non-lazy

#### dependency
`org.hibernate:hibernate-jcache`
`org.hibernate:hibernate-ehcache`

#### setting
```yaml
spring:
  jpa:
    properties:
      hibernate:
        cache.use_second_level_cache: true
        cache.use_query_cache: true
        # L2 Cache Manager...
        cache.region.factory_class: infinispan // or org.hibernate.cache.ehcache.EhCacheRegionFactory
        cache.infinispan.cfg: infinispan/config.xml
        cache.default_cache_concurrency_strategy: read-write
        cache:use_minimal_puts: false
        generate_statistics: true
```

### Usage
#### @Entity class
@Cacheable 반영 및 Serializable 직렬화 가능 하여야 함.
```java
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Book extends Serializable {
    private static final long serialVersionUID = 1L;
}
```
#### @Repository class
```java
@Repository
class BookRepository {
    @QueryHints(@QueryHint(name = HINT_CACHEABLE, value = "true"))
    findBookByName(String name);
}
```
# Spring Boot JPA - Hibernate QueryPlanCache

Hibernate는 쿼리 실행전 QueryPlanCache를 체크하고, 사용가능한 plan이 없는경우 새로운 plan cache를 생성

#### 연관 오류
* OutOfMemory
```sql
select ... from Book where id in (1,2,3,4);
select ... from Book where id in (1,2,3,4,5,6);
```
### 연관 속성 (문제해결)
* in_clause_parameter_padding - In절 쿼리에서 Query Plan Cache를 재사용 할 수 있게 해줌
  * 2의 거듭 제곱 단위로 padding
```yaml
spring:
  jpa:
    properties:
      hibernate:
        query:
          in_clause_parameter_padding: true
```
* 단순 plan cache 크기 조정 (비추천 성능 손실 발생)
  * plan_cache_max_size - default 2048 개
    * 2048은 충분하다, 허나 이것때문에 OutOfMemory가 발생할 수 있다.
  * plan_parameter_metadata_max_size - default 128 개
    * nativeQuery 
```yaml
spring:
  jpa:
    properties:
      hibernate:
        query:
          plan_cache_max_size: 1024
          plan_parameter_metadata_max_size: 64
```

### 코드 수정
* IN 쿼리를 되도록 사용하지 않는게 좋음
  * 테이블 JOIN 이나, exists가 훨씬 더 나은 방법
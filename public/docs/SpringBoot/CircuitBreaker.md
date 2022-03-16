# Spring Cloud Circuit Breaker 
> Spring Cloud Circuit Breaker는 표준 인터페이스를 제공하는 Facade 라이브러리 <br>
> Netflix Hystrix, Resilience4J, Spring Retry ...

### Resilience4J 
1. Circuit Breaker: Count, Time 기준으로 Circuit Breaker 제공
2. Bulkhead : 개별 요청을 격리해 다른 서비스로 영향이 가지 않도록 함
3. RateLimiter : 요청을 조절하여 안정적인 서비스 제공 (유량 제어)
4. Retry : 재시도 제공
5. TimeLimiter : 응답시간 초과시 Timeout 처리
6. Cache : 응답 캐싱 제공

#### Circuit Breaker - 설정
* failureRateThreshold (default: 50)
  * 실패 비율 지정
* slidingWindowType (default: COUNT_BASED)
  * COUNT_BASED: 요청 개수
  * TIME_BASED: 요청 시간
* slidingWindowSize (default: 100)
* minimumNumberOfCalls (default: 100)
  * Circuit 동작 시키기 위한 최소한의 요청 개수
* waitDurationInOpenState (default: 60s)
  * Circuit OPEN -> Half-open 변경 되기전 대기 시간
* automaticTransitionFromOpenToHalfOpenEnabled (default: false)
  * circuit OPEN 상태에서 HALF_OPEN 변경시키는 트리거를 위한 모니터링 thread를 별도로 둘지 여부
* recordExceptions (default: empty)
  * 실패로 처리하지 않을 Exception 명시
* ignoreException 상동
* slowCallRateThreadhold (default 100)
  * 지연된 응답
* slowCallDurationThreshold (default 60s)
  * 요청이 느린것으로 간주하는 시간
* permittedNumberOfCallsInHalfOpenState (default 10)
  * Half-open 상태일때 허가되는 요청수
* maxWaitDurationInHalfOpenState (default 0)
  * Half-open 상태에서 대기할 수 있는 최대 시간, 모든 허가된 요청이 완료될 때까지 0은 무기한으로 기다림
* eventConsumerBufferSize (default 10)
  * 이벤트 발생시 버퍼에 저장되는 크기 지정 
* recordFailurePredicate
  * 성공 / 실패 여부를 추가로 커스터마이징 할 수 있음

### Spring Boot
* 의존성 
```groovy
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-aop'
    implementation "io.github.resilience4j:resilience4j-spring-boot2:${resilience4jVersion}"
    implementation "io.github.resilience4j:resilience4j-circuitbreaker:${resilience4jVersion}"
}
```
* Circuit Breaker 설정
```yaml
resilience4j:
  circuitbreaker:
    configs:
      default:
        registerHealthIndicator: true # health endpoint 사용
        slidingWindowSize: 10 
        slidingWindowType: COUNT_BASED # 요청 개수 or 시간으로 지정 가능
        minimumNumberOfCalls: 10 # 서킷 실패율 계산을 위한 최소 갯수  CallNotPermittedException
        permittedNumberOfCallsInHalfOpenState: 3 # half-open 상태일때 허용되는 요청수
        automaticTransitionFromOpenToHalfOpenEnabled: true
        waitDurationInOpenState: 5s
        failureRateThreshold: 50 # 실패 비율 50% 넘어가면 차단
        eventConsumerBufferSize: 10
        ignoreException:
          - java.util.NoSuchElementException

    instances:
      test: # <--- name
        baseConfig: default
```
* Actuator를 통해 상태 확인을 위한 설정
```yaml
management.endpoint.health.show-details: always
management.health.circuitbreakers.enabled: true
```
* 적용..
```java
public class TestService {
    @CircuitBreaker(name = "test", fallbackMethod = "testFallback")
    public String hello() {
        return "hello world!";
    }
    private void testThrow() {
        int random = new Random().nextInt(10);
        if (random < 7) {
            throw new RuntimeException("failed");
        }
    }

    private void helloFallback(Throwable e) { // @CircuitBreaker 위치와 같은 클래스에 있어야 함.
        e.printStackTrace();;
    }
}
```

#### 외부 서비스 장애 발생시 대응
> 외부에 장애가 났을때 우리는 기능을 Off 해야 할까? 장애 전파를 해야할까? <br>
> 1. 문제가 난건 난거고, 내 일을 한다. (ex. PG 연동, 다른거 보여주면 되니까.. 문제가 난거 off 처리) <br>
> 2. 문제가 발생 되었으니 우리도 멈춘다. (ex. 외부 연동 예약, 상품 off 처리) 
> 
> 우리가 문제일 땐? 짱구를 굴려보자~~

* Feign 으로 외부와 통신시 Error Handling
```java
public class CustomErrorDecoder implements ErrorDecoder {
    @Override
    public Exception decode(String methodKey, Response response) {
        HttpStatus statusCode = HttpStatus.valueOf(response.status());
        switch (statusCode.series()) {
            case INTERNAL_SERVER_ERROR:
                log.error("{} - Status code {}", methodKey, response.status());
            case SERVICE_UNAVAILABLE:
                return new ServiceUnavailableException("HTTP status 503 when calling " + methodKey);
        }
        String message = "";
        if (response.body() != null) {
            try {
                JSONObject jsonObject = new JSONObject(response.body().toString());
                message = jsonObject.getString("message");
                message = stringDecoder.decode(response, String.class).toString();
            } catch (IOException | JSONExceptione e) {
                log.error("{} - Error Deserializing response body", methodKey, e);
            }
        }
        return new FeignClientException(response.status(), message, response.header());
    }
}
public class FeignConfig {
    @Bean
    @ConditionalOnMissingBean(value = ErrorDecoder.class)
    public CustomErrorDecoder customErrorDecoder() {
        return new CustomErrorDecoder();
    }
}
```
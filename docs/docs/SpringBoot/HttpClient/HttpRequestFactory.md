# RestTemplate - HttpRequestFactory 구현체

### ClientHttpRequestFactory Interface
#### SimpleClientHttpRequestFactory
> ResTemplate 생성시 인자 없이 사용할 때 default

HttpUrlConnection 을 사용
* KeepAliveCache 에 커넥션이 존재하면 재사용 함. route(프로토콜, 호스트, 포트)별 커넥션 관리
  * 커넥션 풀 (default 5, http.maxConnections 시스템 프로퍼티 사용하여 변경 가능)
  * 다른 SimpleClientHttpRequestFactory 와 공유 됨
* 요청이 많은경우 TIME_WAIT로 인한 자원 부족 현상 발생
```java
public RestTemplate restTemplate() {
    SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
    factory.setConnectionTimeout(3_000);
    factory.setReadTimeout(50_000);
    
    return new RestTemplateBuilder()
        .requestFactory(() -> factory)
        .build();
}
```

#### HttpComponentsClientHttpRequestFactory
HttpClient 사용, Connection Pool 제한 없음
* 모든 응답 코드를 읽을수 있다. `httpResponse.getStatusLine().getStatusCode()`
* 타임아웃 제어
* 쿠키 제어
* 단점
  * 스트림 처리 로직을 구현 해야 함
  * 응답 컨텐츠 타입에 따른 처리 별도 처리 로직을 구현 해야 함.


```java
public RestTemplate restTemplate() {
    HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
    factory.setConnectionTimeout(3_000);
    factory.setReadTimeout(50_000);
    // connection pooling
    HttpClient httpClient = HttpClientBuilder.create()
        .setMaxConnTotal(100)
        .setMaxConnPerRoute(5)
        .setConnectionTimeToLive(60, TimeUnit.SECONDS) // keep-alive
        .build();
    factory.setHttpClient(httpClient);
    return new RestTemplateBuilder()
        .requestFactory(() -> factory)
        .build();
}
```
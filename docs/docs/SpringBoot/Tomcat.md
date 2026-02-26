# Tomcat Thread Pool

* 스레드풀이란..
> Thread Pool은 프로그램 실행에 필요한 Thread들을 미리 생성하는 개념
(Thread는 cpu의 자원을 이용하여 코드를 실행하는 하나의 단위 입니다. )
Tomcat 3.2 이전에서는, 요청이 들어올 때 마다 Servlet을 실행할 Thread를 하나씩 생성. 요청이 끝나면 destory

* 설정 
  * application.yml
  ```yaml
  server:
    tomcat:
      threads:
        max: 200 # 생성할 수 있는 thread의 총 개수
        min-spare: 10 # 항상 활성화 되어있는(idle) thread의 개수
      max-connections: 8192 # 수립가능한 connection의 총 개수
      accept-count: 100 # 작업큐의 사이즈
      connection-timeout: 20000 # timeout 판단 기준 시간, 20초
   ```
   설정이 없으면 default (ServerProperties.java)
   > 톰캣9.0 버전의 threads default는 각 200, 25개 <br>
     스프링부트에선 default 200, 10개 <br>
  > 톰캣8.0 버전부터 NIO(NonBlocking I/O) connector 기본 채택
 

* TEST 방법
   * Controller 에서 테스트
    ```java
    public class TestController {
        @GetMapping("/block") 
        public String slow(Integer idx) {
            Thread.sleep(2000L);
            return String.valueOf(idx);
        }
  
        @GetMapping("/threadCall")
        public ResponseEntity<Void> threadCall() {
            RestTemplate restTemplate = new RestTemplate();
            for (int i = 0; i < 5; i++) {
                Thread thread = new Thread(() -> {
                    String result = restTemplate.getForObject("http://localhost:8080/block?idx=" + i, String.class);
                    log.info("response - {}",result);
                });
                thread.start();
            }
            return ResponseEntity.ok().build();
        }
  
        @GetMapping("/deferred") // non-blocking with deferred
        public DeferredResult<String> defer() {
            final DeferredResult<String> deferredResult = new DeferredResult<>();
            new Thread(() -> {
                try {
                    deferredResult.setResult("Success");
                } catch (Exception e) {
                    throw e;
                }
            }).start();
            return deferredResult;
        }

        @GetMapping("/future") // non-blocking with CompletableFuture
        public CompletableFuture<String> future() {
            return CompletableFuture.supplyAsync(() -> {
                return "hello";
            }).thenApplyAsync(hello -> {
                return hello + "world";
            }).thenApplyAsync(result -> {
                log.debug("final: {}", result);
                return result;
            });
        }
    }
    ```
  
### 적정 쓰레드 개수
* 적정 쓰레드 풀 개수
  * CPU 개수 * (CPU 목표 사용량) * (1 + 대기(유휴) 시간/서비스 처리 시간)
  * 대기 시간이 짧으면 스레드가 적어야 성능이 좋다. (context switching cost)
* 적정 Request 요청 개수 (리틀의 법칙)
  * L (동시 요청수) = 평균 도착시간 * 평균 대기 시간

#### 쓰레드 풀 개수 : 2 * (1+50/5) = 22
* 응답 시간: 50ms
* 서비스 시간: 5ms
* CPU 듀얼 코어
* CPU 목표 사용량 : 1 (0~1)

#### 초당 적정 Request 처리량 (TPS) : 22 / 0.055 = 400 
* 쓰레드 풀 개수: 22
* 응답 시간 : 55ms

#### 개인적인 생각...
2코어, 메모리 4Gb 서버에서 인스턴스당 100 ~ 150개가 적정 쓰레드라고 생각
* 응답 속도도 가장 빠르고, 인스턴스를 1개 더 올려 Fail Over 하는게 좋다. 
* 인스턴스당 Heap 최대 1GB, New/Old 1:2 비율

```shell
-Xmx1024m -Xms1024m \
-XX:MaxNewSize=348m \
-XX:MaxMetaspaceSize=128m -XX:+UseG1GC -XX:MaxGCPauseMillis=200
```
# SpringBoot Async 설정
> @Async 스프링에서 제공하는 비동기 메소드 지원 Annotation, Thread Pool 활용
* @Async 특징
  1. public method 에만 사용 가능
  2. self-invocation 불가, 같은 클래스내 메소드로 설정시 비동기 불가
  3. QueueCapacity 초과 요청에 대한 비동기 method 호출시 방어코드 작성

* 설명
  * @EnableAsync method에서 비동기 기능을 사용할 수 있도록 활성화
  * CorePoolSize : 기본 실행 thread 수
  * MaxPoolSize : 동시 동작하는 최대 Thread 수
  * QueueCapacity : MaxPoolSize 초과 요청시 요청을 Queue에 저장하는데, 최대 수용 가능한 Queue 수
    * Thread 빈 슬롯이 생기면 빠져 나가서 실행됨
  * KeepAliveTime: MaxPoolSize 가득 찼을때 증하한 thread를 유지시킬 시간 
  * ThreadNamePrefix : Thread 접두사

### Async 설정
```java
@Configuration
@EnableAsync
public class AsyncConfig extends AsyncConfigurerSupport {
    @Value("${service.name}")
    private final String serviceName;
    
    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(15);
        executor.setQueueCapacity(15);
        executor.setKeepAliveSeconds(10);
        executor.setThreadNamePrefix(serviceName + "-async-");
        executor.initialize();
        return executor;
    }
    
    // 이건 필요시 
    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return (ex, method, param) ->
                log.error("Method name : {}, param Count : {}\n\nException Cause -{}",
                        method.getName(), params.length, ex.getMessage());
    }
}
```
### 코드
```java
@Slf4j
public class MyService {
    @Autowired 
    private ThreadPoolTaskExecutor myTaskExecutor;
    
    @Async
    public void asyncMethod(int i) { // 비동기 메소드는 별도 클래스에..
        try {
            log.debug(i);
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
    
    @Async("myTaskExecutor")
    public CompletableFuture ifReturn() {
        return CompletableFuture.supplyAsync(() -> {
            return "hello";
        });
    }

    public CompletableFuture<T> ifReturnAsync() {
        return CompletableFuture.supplyAsync(() -> {
            return "world";
        }, myTaskExecutor);
    }
}
public class AsyncController {
    @Autowired
    private MyService myService; 
    
    @GetMapping("/async")
    public String doAsync() {
        String result = "";
        try {
            for (int i=0; i<50; i++) {
                myService.asyncMethod(i);
            }
        } catch (TaskRejectedException e) { // Thread Pool 과 QueueCapacity 초과로 인한 예외 발생
            // do stuff..
        }
        return result;
    }
}
```
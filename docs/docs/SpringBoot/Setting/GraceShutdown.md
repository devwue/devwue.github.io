# Spring Graceful Shutdown
실행중인 작업이 완료된 이후 어플리케이션을 종료하는 것을 의미

내가 만든 어플리케이션이 스케쥴링이나, 배치 처리를 하고 있다면 반드시 확인해 봐야 함.

### Setting
톰캣에서 graceful 셧다운을 사용하려면 9.0.33 <= 이상
* application.yml
```yaml
server:
  shutdown: graceful
spring:
  lifecycle:
    timeout-per-shutdown-phase: 20s
```
#### ThreadPoolTaskExecutor
```java
@Configuration
public class MyThreadPoolExecutor {
    @Bean
    public ThreadPoolTaskExecutor myExecutor(){
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(2);
        // for graceful shutdown
        executor.setWaitForTasksToCompleteOnShutdown(true); // 진행중인 작업이 완료된 후 Thread 종료 
        executor.setAwaitTerminationSeconds(20); // 작업을 종료까지 지연 시간 설정
        
        executor.initialize();
        return executor;
    }
}
```
#### EndPoint
```java
@RestController
public class TestController {
    @Autowired
    private ThreadPoolTaskExecutor myExecutor;
    
    @GetMapping("/task/new")
    public String task() {
        myExecutor.execute(() -> {
            try {
                // todo: 
                Thread.sleep(15000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });
        return "task complete";
    }
}
```
#### Spring - ContextClosedEvent
스프링에서 리소스를 정리하는 핸들러가 존재하지 않기 때문에 아래와 같은 작업 필요
* Request에서 활용되는 ThreadPool 리소스가 정리될 때까지 기다린 후 종료 하는 로직

```java

@Slf4j
public class GracefulShutdown implements ApplicationListener<ContextClosedEvent> {
    private boolean shutdown;

    @Override
    public void onApplicationEvent(ContextClosedEvent event) {
        log.debug("Terminated Signal For Application - {}", event);
        this.shutdown = true;
        this.connector.pause();
        Executor executor = this.connector.getProtocolHandler().getExecutor();
        if (executor instanceof ThreadPoolExecutor) {
            try {
                ThreadPoolExecutor threadPoolExecutor = (ThreadPoolExecutor) executor;
                threadPoolExecutor.shutdown();
                if (!threadPoolExecutor.awaitTermination(TIMEOUT, TimeUnit.SECONDS)) {
                    log.warn("Tomcat thread pool did not shut down gracefully within "
                            + TIMEOUT + " seconds. Proceeding with forceful shutdown");

                    threadPoolExecutor.shutdownNow();

                    if (!threadPoolExecutor.awaitTermination(TIMEOUT, TimeUnit.SECONDS)) {
                        log.error("Tomcat thread pool did not terminate");
                    }
                }
            } catch (InterruptedException ex) {
                Thread.currentThread().interrupt();
            }
        }
    }

    public boolean isShutdown() {
        return shutdown;
    }
}

@SpringBootApplication
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication application = new SpringApplicationBuilder()
                .sources(MyApplication.class)
                .listeners(new ApplicationPidFileWriter("MyApplication.pid"))
                .build();
        application.run(args);
    }
}
```
#### With Filter
연결 종료 요청, 일반적으로 60초, 웹서버의 경우 5분정도 연결 유지를 하기 때문에 필요함.
```java
@Component
public class KeepAliveConnectionAnnouncer extends OncePerRequestFilter {
    private final GraceShutdown graceShutdown;
    public KeepAliveConnectionAnnouncer(GraceShutdown graceShutdown) {
        this.graceShutdown = graceShutdown;
    }
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) {
        if (graceShutdown.isShutdown()) {
            response.addHeader(HttpHeaders.CONNECTION, "close");
        }
        filterChain.doFilter(request, response);
    }
}
```
##### 참조
* [Marcos Barbero's Blog](http://blog.marcosbarbero.com/graceful-shutdown-spring-boot-apps/)
### 연관있는 Annotation
* @PreDestroy
# Spring - CommandLineRunner, ApplicationRunner, EventListener

스프링부트 어플리케이션 구동 시점에 특정 코드를 실행시키기 위해 제공
* 기본적으로 컴포넌트 스캔이 동작된 이후 빈을 등록됨
* 스프링은 Lazy-Init 전략을 사용해 빠른 구동후, 클라이언트 요청이 왔을때 서블릿 초기화 확인후 동작
  * 서블릿이 초기화되지 않았다면 초기화 진행됨..

### CommandLineRunner
#### 코드 샘플
```java
@Component
public class TestCommandLineRunner implements CommandLineRunner {
    @Override
    public void run(String... args) throws Exception {
        // todo..
        System.out.println("CommandLineRunner Args: " + Arrays.toString(args));
    }
}
```
#### 테스트
```shell
$ java -jar app.jar test param 123
```
```shell
2022-04-26 19:52:12.054  INFO 96622 --- [           main] s.b.c.e.t.TomcatEmbeddedServletContainer : Tomcat started on port(s): 8080 (http)
CommandLineRunner Args: [test, param, 123]
```

#### 실행순서
여러 커맨드라인이 있을때, @Order 사용
```java
@Order(1)
@Component
public class FirstCommandLineRunner implements CommandLineRunner {}

@Order(2)
@Component
public class SecondCommandLineRunner implements CommandLineRunner {}
```

### ApplicationRunner
> CommandLineRunner 보다 최근에 만들어 졌음

차이점 - 파라미터
* CommandLineRunner의 경우 배열로 전달
* ApplicationRunner의 경우 ApplicationArguments 타입의 객체가 파라미터로 전달
```java
@Component
public class TestApplicationRunner implements ApplicationRunner {
    @Override
    public void run(ApplicationArguments args) throws Exception {
        
    }
}
```

### EventListener
> Spring4.2 부터 추가됨, 이벤트 수신을 통해 동작, 좀 다르지...

#### Bean 등록을 통해 동작
```java
@Component
public class TestListener implements ApplicationListener<ApplicationReadyEvent> {
    public TestListener() {
    }
    
    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        // todo..
    }
}
@Configuration
public class ListenerConfig {
    @Bean
    public TestListener testListener() {
        return new TestListener();
    }
}
```

#### 간단하게 동작 확인
```java
@SpringBootApplication
public class TestApplication {
    public static void main(String[] args) {
        SpringApplication.run(TestApplication.class, args);
    }
    
    @EventListener(ApplicationReadyEvent.class)
    public void runAtReady() {
        // do...
    }
}
```

#### ApplicationStartingEvent
#### ApplicationContextInitializedEvent
#### ApplicationEnvironmentPreparedEvent
#### ApplicationPreparedEvent
#### ApplicationStartedEvent
#### ApplicationReadyEvent
#### ApplicationFailedEvent


### 활용
* 어플리케이션 기동시 API 한번씩 호출등...
```java
@Component
public class TestApplicationRunner implements ApplicationRunner {
    @Autowired
    private TestService testService;
    @Autowired
    private ExternalApiClient externalApiClient;
    
    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (!testService.isCalled()) {
            testService.importCache();
        }
        // discover domain...
        externalApiClient.ping();
    }
}
```

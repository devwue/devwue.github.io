# SpringBoot, Micrometer 사용한 데이터 측정하기
> 모니터링 측정에 대한 파사드 제공 <br>

* Supported
  * Atlas, Datadog, Graphite, Ganglia, Influx, JMX, Prometheus, Telegraf
* Facade 패턴
  * 서브 시스템을 가려주는 상위 수준의 인터페이스를 제공

### MeterRegistry
> Meter는 어플리케이션의 Metric 수집을 위한 인터페이스, MeterRegistry 에 의해 생성되고 MeterRegistry에 등록 됨.
1. SimpleMeterRegistry: Meter 최신값을 메모리에 저장
```java
MeterRegistry registry = new SimpleMeterRegistry();
```

2. CompositeMeterRegistry: 여러개의 모니터링 시스템에 정보를 보내야 하는 경우에 사용
   ```java
   SimpleMeterRegistry simpleMeterRegistry = new SimpleMeterRegistry();
   CompositeMeterRegistry compositeMeterRegistry = new CompositeMeterRegistry();
   
   compositeMeterRegistry.add(simpleMeterRegistry);
   ```

#### 스프링부트 연동
* Spring Metrics
  * 기본적으로 메트릭은 http.server.requests 라는 이름으로 만들어짐
    > management.metrics.web.server.request.metric-name
  * @Controller 클래스와 @RequestMapping 메소드에는 @Timed 어노테이션 사용할 수 있음
    > https://godekdls.github.io/Spring%20Boot/metrics/#timed-annotation-support
    * 모든 스프링 요청에서 메트릭을 기록하고 싶지 않다면 아래 설정후, 필요한곳에 @Timed 추가
      > management.metrics.web.server.request.autotime.enabled = false
  
* 프로젝트 의존성 추가
  ```groovy
  dependencies {
      implementation 'org.springframework.boot:spring-boot-starter-actuator' // micrometer 포함
  }
  ```
* 기본적으로 모든 endpoint는 활성화 되어 있음, shutdown 예외
  > management.endpoint.<id>.enabled = true
    ```yaml
    management.endpoint.web.exposure.include=health,info,metrics
    
    # 프로젝트에서 사용하는 의존성 추가 필요
    management.metrics.export.<statsd>.enabled = true
    management.metrics.export.statsd.host=statd.devwue.com
    management.metrics.export.statsd.port=9125
    management.metrics.export.statsd.protocol=udp
    ```
* 커스텀 메트릭스 확인
  > http://my-project/actuator/metrics/myService.feature
  
* 코드 샘플
  ```java
  import java.util.concurrent.ThreadPoolExecutor;
  public class MetricCounter  {
      private final MeterRegistry meterRegistry;
    
      public MetricCounter(MeterRegistry meterRegistry) {
          this.meterRegistry = meterRegistry;
      }

      public void increment(String name, Iterable<Tag> tags) {
          try {
              void meterRegistry.counter(name, tags).increment();
          } catch (Exception e) {
              e.printStackTrace();
          }
      }
  }

  @Configuration
  @ConditionalOnClass(name = { "io.micrometer.core.instrument.MeterRegistry" })
  public class MetricConfig {

      @Bean
      public MetricCounter metricCounter(MeterRegistry meterRegistry) {
          return new MetricCounter(meterRegistry);
      }
  }
  
  @EnableAsync
  @Configuration
  public class TaskExecutorConfig implements AsyncConfigurerSupport { // 쓰레드풀 모니터링을 한다 치자.. 
      @Bean
      public ThreadpoolTaskExecutor taskExecutor(MeterRegistry registry) {
          ThreadPoolExecutor executor = new ThreadPoolTaskExecutor();
          setupGauge(registry, executor, "executors.my-service");
          return executor;
      }

      private void setupGauge(MeterRegistry registry, ThreadPoolExecutor executor, String tag) {
          Gauge.builder("executor.completed", executor, e -> e.getThreadPoolExecutor().getCompletedTaskCount())
              .tag("name", tag)
              .description("쓰레드풀에서 실행 완료된 태스크 갯수")
              .baseUnit(BaseUnits.TASKS)
              .register(registry);
         // add gauge
      }
  }

  public class MyService {
      private final MetricCounter metricCounter;

      public MyService(MetricCounter metricCounter) {
          this.metricCounter = metricCounter;
      }
      
      public void feature() {
          metricCounter.increment("myService.feature", "book", "read");
      }

      public void feature2() {
          metricCounter.increment("myService.feature", "book", "buy");
      }
  }
  
  @Timed
  @Controller
  public class BookController { // @Controller 클래스와, @RequestMapping 메소드
      @Autowired
      private final MyService myService;
  
      @Timed
      @GetMapping("/book/read")
      public String read() {
          myService.feature();
      }
  }
  // 외부 연동 모니터링에도 사용 가능..
  public class MyFeignConfig {
      @Bean
      public MicrometerCapability micrometerCapability(MeterRegistry meterRegistry) {
          return new MicrometerCapability(meterRegistry);
      } 
  }
  ```

### Meters
> 마이크로미터는 Meter의 구현체
* Timer, Counter, Gauge, DistributionSummary, LongTaskTimer, FunctionCounter, FunctionTimer, TimeGauge

  #### Tags
```java
Counter counter = registry.counter("page.visitors", "age", "20s");
```
* 미터 식별자: page.visitors
* 미터 태그: age, 20s

  #### Counter
  > 카운터는 증가만, 감소 안됨
  ```java
  Counter counter = Counter
        .builder("instance")
        .description("인스턴스의 카운터")
        .tags("dev", "performance")
        .register(registry);

  counter.increment(2.0);
  ```

  #### Timers
  > 시스템 이벤트 빈도와 latency 측정, 이벤트 발생한 수와 총 시간을 리포팅
  ```java
  SimpleMeterRegistry registry = new SimpleMeterRegistry();
  Timer timer = registry.timer("app.event");
  
  timer.record(() -> {
      try {
          TimeUnit.MILLISECONDS.sleep(1500);
      } catch (InterruptedException ignored) { }
  });
   
  timer.record(3000, MILISECONDS);
  ```
  #### Gauge
  > Meter의 혅재 값을 보여줌. 즉, 데이터가 확인된 경우에만 데이터를 리포팅 (캐시, 통계 모니터링시 유용)
  ```java
  SimpleMeterRegistry registry = new SimpleMeterRegistry();
  List<String> list = new ArrayList<>(4);
  
  Gauge gage = Gauge.builder("cache.size", list, List::size)
          .register(registry);
  list.add("test");
  ```

### Binders
> JVM, 캐시, ExecutorService, Logging 서비스를 모니터링하는 내장 바인더가 있음.
```java
new LogbackMetrics().bind(registry);
```

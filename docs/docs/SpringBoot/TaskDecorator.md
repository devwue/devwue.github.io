# SpringBoot 동기, 비동기 처리시 context 유지하고 로깅
> MDC, TaskDecorator

* TaskDecorator, context 복제 
````java
public class AsyncTaskDecorator implements TaskDecorator {
    @Override
    public Runnable decorate(Runnable runnable) {
        Map<String, String> callerThreadContext = MDC.getCopyOfContextMap();
        return () -> {
            if (!ObjectUtils.isEmpty(callerThreadContext)) {
                MDC.setContextMap(callerThreadContext);
            }
            try {
                runnable.run();
            } finally {
                MDC.clear();
            }
        };
    }
}
````

* TaskExcutor를 통한 전달
```java
@Bean
public TaskExecutor taskExecutor() {
    ThreadPoolTaskExecutor taskExecutor = new ThreadPoolTaskExecutor();
    taskExecutor.setTaskDecorator(new AsyncTaskDecorator());
    taskExecutor.setThreadNamePrefix("async-task-");
    taskExecutor.setThreadGroupName("async-group");
    return taskExecutor;
}
```

* MDC trackingId 설정

```java
import java.util.UUID;

public class TrackInterceptor extends HandlerInterceptorAdapter {
    @Override
    public void preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        MDC.put("trackingId", UUID.randomUUID().toString());
    }
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception e) {
        MDC.clear();
    }
}

```
* logback.xml 설정
```xml
<appender name="FILE" class="ch.qos.logback.core.FileAppender">
    <file>${LOG_FILE}</file>
    <encoder>
        <pattern>
            %d{yyyy-MM-dd HH:mm:ss.SSS} %magenta([%thread]) %highlight(%-5level) [trackingId=%X{trackingId}] [caller=%X{caller}] %logger{36}.%M - %msg%n
        </pattern>
    </encoder>
</appender>
```
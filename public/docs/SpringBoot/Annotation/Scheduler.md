# Spring - @Scheduler

### @EnableScheduling
```java
@EnableScheduling
@SpringBootApplication
public class MyApplication { 
}
```
#### @Scheduled
#### Dependency
`org.springframework.scheduling`

### 여러 서버에서 중복실행 방지
#### @ShedLock
```java
@Configuration
@EnableShedulerLock
public class ScheduleShedLockConfig {
    @Value("${shedlock.table}")
    private String shedLockTable;
    
    @Bean
    public LockProvider lockProvider(DynamoDbClient dynamoDbClient) {
        return DynamoDBLockProvider(dynamoDbClient, shedLockTable);
    }
}
#### Scheduler
```java
@Component
public class MyScheduler {
    @SchedulerLock(name = "ohSchedule", lockAtLeastFor="30s", lockAtMostFor = "1m")
    @Sheduled(cron = "0 30 * * * *")
    public void ohSchedule() {
        // do stuff
    }
}

```
##### dependency
`net.javacrumbs.shedlock:shedlock-spring`
##### yml
```yaml
shedlock:
  table: shedlock
```
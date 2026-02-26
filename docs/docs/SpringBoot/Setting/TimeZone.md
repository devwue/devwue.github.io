# Spring - Default TimeZone
방법은 여러가지, 없으면 서버의 TimeZone 영향을 받는다.

### with JVM Argument
```shell
java -Duser.timezone="Asia/Seoul" -jar my-app.jar
```

### @PostConstruct
Application 기동후 Bean이 완전 초기화 되고 난 이후 1번만 호출 되는 특징을 가짐. 

```java
@SpringBootApplication
public class TestApplication {
    @PostConstruct
    public void atFirst() {
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"));
    }
    
    public static void main(String[] args) {
        SpringApplication.run(TestApplication.class, args);
    }
}
```

### 코드 보기
어떻게 될까? 내 서비스가 글로벌 서비스를 한다고 한다면 정확히 알고 있자!!
```java
public class TimeUtil {
    // #1 Asia/Seoul로 TimeZone 시간을 뽑고, UTC로 TimeZone을 변경
    public static LocalDateTime now() {
        return LocalDateTime.now().atZone(ZoneId.of("UTC")).toLocalDateTime();
    }
    // #2 Asia/Seoul로 TimeZone이 설정되어 있는데, UTC TimeZone으로 현재 시간을 뽑음
    public static LocalDateTime now() {
        return ZonedDateTime.now(ZoneId.of("UTC")).toLocalDateTime();
    }
    // #3 Asia/Seoul TimeZone 시간을 뽑고, UTC TimeZone만큼 시간을 뺌
    public static LocalDateTime now() {
        return LocalDateTime.now().minusHours(9);
    }
}
```
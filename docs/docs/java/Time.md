# JAVA 시간, 날짜
> LocalDateTime.now()
> LocalDate.now()
```shell
J   |--------------------ZonedDateTime------------------------|
A   |-------------OffsetDateTime---------------|
V   |------LocalDateTime--------|
A   |--LocalDate--|--LocalTime--|--ZoneOffSet--|--ZoneRegion--|
      1980-03-12     23:00:00      +09:00         Asia/Seoul
M   |---------------------------------------------------------|  
y   |---Date------|----TIME-----|
S   |--------DateTime-----------|
Q   |------------------Timetamp----------------|
L   Timestamp : 2038-01-29 03:14:07 UTC 최대값 (32bit int: 2147483647)
```

### 데이터베이스 기준: UTC
* 대부분 시간 라이브러리는 UTC 기준으로 만들어져 있음.
* yyyy-MM-dd hh:mm:ss 문자열 형태로 저

### 서버 기준: Local
* 서버에서는 JVM timezone 기준으로 처리
* 데이터베이스의 데이터를 로컬 타입으로 변환해서 보여줌
  * 변환 비용은 뭐,,,
* Timestamp vs ZonedDateTime
  * ZonedDateTime 좋음, Timestamp는 java.util.Date를 상속받았기 때문에 문제가 있음

### java.util.Date의 문제점
* 불변 객체가 아님
* 상수 필드 남용 : calendar.add(Calendar.SECOND, 2);
* 헷갈리는 월 지정: 1월 = 0
* 일관성 없는 요일 상수
* Date와 Calendar 객체의 역할 분담
  * Calendar 객체를 생성하고 Date객체를 생성하는 프로세스를 거치기 때문에 생성 비용이 비쌈
* 하위 클래스 문제...

### JSR-310: 새로운 Java의 날짜 API
> https://d2.naver.com/helloworld/645609
```java
public class Jsr310Test {  
    @Test  // 예제 1, 2: 1일 후 구하기
    public void shouldGetAfterOneDay() {
        LocalDate theDay = IsoChronology.INSTANCE.date(1582, 10, 4);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");
        assertThat(theDay.format(formatter)).isEqualTo("1582.10.04");


        LocalDate nextDay = theDay.plusDays(1);
        assertThat(nextDay.format(formatter)).isEqualTo("1582.10.05");
    }


    @Test  // 예제 3, 4: 1시간 후 구하기
    public void shouldGetAfterOneHour() {
        ZoneId seoul = ZoneId.of("Asia/Seoul");
        ZonedDateTime theTime = ZonedDateTime.of(1988, 5, 7, 23, 0, 0, 0, seoul);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm");
        assertThat(theTime.format(formatter)).isEqualTo("1988.05.07 23:00");
        ZoneRules seoulRules = seoul.getRules();
        assertThat(seoulRules.isDaylightSavings(Instant.from(theTime))).isFalse();

        ZonedDateTime after1Hour = theTime.plusHours(1);
        assertThat(after1Hour.format(formatter)).isEqualTo("1988.05.08 01:00");
        assertThat(seoulRules.isDaylightSavings(Instant.from(after1Hour))).isTrue();
    }


    @Test  // 예제5, 6: 1분 후 구하기
    public void shouldGetAfterOneMinute() {
         ZoneId seoul = ZoneId.of("Asia/Seoul");
         ZonedDateTime theTime = ZonedDateTime.of(1961, 8, 9, 23, 59, 59, 0, seoul);
         DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm");
         assertThat(theTime.format(formatter)).isEqualTo("1961.08.09 23:59");


         ZonedDateTime after1Minute = theTime.plusMinutes(1);
         assertThat(after1Minute.format(formatter)).isEqualTo("1961.08.10 00:30");
    }

    @Test // 예제 7: 2초 후 구하기
    public void shouldGetAfterTwoSecond() {
        ZoneId utc = ZoneId.of("UTC");
        ZonedDateTime theTime = ZonedDateTime.of(2012, 6, 30, 23, 59, 59, 0, utc);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm:ss");
        assertThat(theTime.format(formatter)).isEqualTo("2012.06.30 23:59:59");


        ZonedDateTime after2Seconds = theTime.plusSeconds(2);
        assertThat(after2Seconds.format(formatter)).isEqualTo("2012.07.01 00:00:01");
    }


    @Test // 예제 12: 1999년 12월 31일을 지정하는 코드
    public void shouldGetDate() {
        LocalDate theDay = LocalDate.of(1999, 12, 31);


        assertThat(theDay.getYear()).isEqualTo(1999);
        assertThat(theDay.getMonthValue()).isEqualTo(12);                
        assertThat(theDay.getDayOfMonth()).isEqualTo(31);                
    }

    @Test(expected=DateTimeException.class) // 예제 12: 1999년 12월 31일을 지정하는 코드의 실수
    public void shouldNotAcceptWrongDate() {
        LocalDate.of(1999, 13, 31);
    }


    @Test // 예제 13: 요일 확인하기
    public void shouldGetDayOfWeek() {
        LocalDate theDay = LocalDate.of(2014, 1, 1);


        DayOfWeek dayOfWeek = theDay.getDayOfWeek();
        assertThat(dayOfWeek).isEqualTo(DayOfWeek.WEDNESDAY);
    }
    
    @Test(expected=ZoneRulesException.class) // 예제 14: 잘못 지정한 시간대 ID
    public void shouldThrowExceptionWhenWrongTimeZoneId(){
         ZoneId.of("Seoul/Asia");
    }
}
```
### 기본
* 특정 시간 
````java
LocalDate.of(2021,03,21);
LocalDateTime.of(2021,03,21, 10, 10, 10);
````
* 포맷 
```java
LocalDateTime.now().format(DateTimeFormatter.ISO_DATE);
LocalDateTime.format(DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 HH시 mm분 ss초"));
```

상수 | 출력예 | 비고
---- | ------ | ----
ISO_DATE_TIME | 2021-03-21T00:00:00.0 
ISO_LOCAL_DATE | 2021-03-21 | ISO_DATE  
ISO_LOCAL_TIME | 00:00:00.1 | ISO_TIMEE 
ISO_LOCAL_DATE_TIME | 2021-03-21T00:00:00.0 




# JAVA 시간, 날짜

> LocalDateTime.now()
> LocalDate.now()


### 응용 
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
||상수|출력예|비고||
|ISO_DATE_TIME|2021-03-21T00:00:00.0| ||
|ISO_LOCAL_DATE|2021-03-21|ISO_DATE||
|ISO_LOCAL_TIME|00:00:00.1|ISO_TIMEE||
|ISO_LOCAL_DATE_TIME|2021-03-21T00:00:00.0|||




# Spring Boot @Transactional 전파 레벨 
> 다른 클래스의 bean에서 호출할때만 transactional 인지 후 동작 <br><br>
> REQUIRED: 트랜잭선 미 설정시 신규 트랜잭선 시작, 롤백시 롤백 전파 (default) <br>
별도 Thread 에서 실행될경우 ThreadLocal 변수에 저장되기 때문에 트랜잭션 전파 안됨. 
> REQUESTS_NEW: 매번 새로운 트랜잭션 시작, 롤백 전파 안됨.  <br>
> NESTED: REQUIRED 포함, SAVEPOINT 지점까지 부분 롤백 가능 (DB가 지원해 줘야 사용 가능)

1. 사용방법
```java
@Transactional(propagation = Propagation.REQUIRED)
public void method() { ... }
```
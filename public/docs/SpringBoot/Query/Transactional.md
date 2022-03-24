# Spring Boot @Transactional 전파 레벨 
> 다른 클래스의 bean에서 호출할때만 transactional 인지 후 동작 <br><br>
* REQUIRED: 트랜잭선 미 설정시 신규 트랜잭선 시작, 롤백시 롤백 전파 (default)
  * 별도 Thread 에서 실행될경우 ThreadLocal 변수에 저장되기 때문에 트랜잭션 전파 안됨. 
* REQUESTS_NEW: 매번 새로운 트랜잭션 시작, 롤백 전파 안됨.
* NESTED: REQUIRED 포함, SAVEPOINT 지점까지 부분 롤백 가능 (DB가 지원해 줘야 사용 가능)

#### 사용방법
```java
@Transactional(propagation = Propagation.REQUIRED)
public void method() { ... }
```

### Spring Transaction Exception 발생시 Rollback
> 비즈니스 정책?적으로 부분 Exception 발생시 전체 Rollback을 하느냐 안하느냐
* Rollback 안되는 상황
```java
@Transactional
public void bizAction() throw Exception {
    firstAction();
    try { // 2번째 처리 로직의 예외를 인지하는 상황
        secondAction();
    } catch (Exception ex) {}
}
```

* Rollback 되는 상황
```java
@Transactional
public void bizAction() throw Exception {
    firstAction();
    throw new Exception("unknown exception"); // 2번째 로직에서 예외를 인지하나, 대처를 안하는 상황
    secondAction();
}
```

* Rollback 되는 예외를 지정 할 수도 있음
```java
// 특정 예외 발생시 롤백 처리
@Transactional(rollbackFor = Exception.class)
// 여러 예외 발생시 롤백
@Transactional(rollbackFor = { RuntimeException.class, Exception.class})
// 특정 예외 발생시 롤백 처리 안하게
@Transactional(noRollbackFor = {IgnoreRollbackException.class})
```
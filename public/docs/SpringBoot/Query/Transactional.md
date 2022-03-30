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

### JPA 사용시 Lock 사용
> 비관적 락: 데이터베이스 리소스에 다른 사람이 접근조차 하지 못하도록 Lock을 걸고 작업을 하는것
* exclusive lock (beta lock) 
  * 읽기 쓰기 모두 불가능 `SELECT ... FOR UPDATE`
* shared lock
  * 읽기는 가능하지만 쓰기는 불가능
  
#### JPA Lock 옵션
1. PESSIMISTIC_READ
   * 타 트랜잭션에서 읽기는 가능하지만 쓰기는 불가능
2. PESSIMISTIC_WRITE
   * 타 트랜잭션에서 읽기 쓰기 모두 불가능
3. PESSIMISTIC_FORCE_INCREMENT
   * 타 트랜잭션에서 읽기 쓰기 모두 불가능
   * 버저닝 처리

#### JPA Lock 특징, 예외
1. PessimisticLockException : Lock 취득을 못함
2. LockTimeoutException : Lock 취득을 시간내에 하지 못함
3. PersistanceException : 값을 변경할 할때 발생 
   * NoResultException, NoUniqueResultException, LockTimeoutException, QueryTimeoudException
   * 롤백 처리됨.

#### Example
```java
public interface MyRepository extends JpaRepository<My, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<My> findById(Long id);
}
```

#### Lock Scope
> 비관적 락은 락 범위 지정이 가능 <br>
> Join을 해서 사용할 때 메인 테이블에 할지, 모든 테이블의 row에 lock를 걸지 지정 <br>
> 데이터베이스에서 지원 하는지 확인후 사용 필요
```java
public interface MyRepository extends JpaRepository<My, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @QueryHints({@QueryHint(name="javax.persistence.lock.scope", value="EXTENDED")})
    Optional<My> findById(Long id);
}
```

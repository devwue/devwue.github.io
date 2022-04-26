# Spring JPA - exists

exists 사용이 필요한 경우 JPA나, QueryDsl이나 사용하기에는 문제가 있다.

### QueryDsl 내부 exists 구현 - QuerydslJpaPredicateExecutor.class
```java
public boolean exists(Predicate predicate) {
    return this.createQuery(predicate).fetchCount() > 0L;
}
```
### QueryDsl - 사용시 변경
```java
public Boolean exist(Long id) {
    Integer fetchOne = jpaQueryFactory
        .selectOne()
        .from(book)
        .where(book.id.eq(id))
        .fetchFirst();
        .fetchOne();
    return fetchOne != null;
}
```
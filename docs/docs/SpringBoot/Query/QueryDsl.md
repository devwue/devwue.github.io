# JPA, QueryDsl 사용
> JPA에서 해결하기 어려운 동적쿼리나, 복잡한 쿼리를 해결하기 위해 QueryDsl을 사용한다. <br>
* JPA 대비 장점
  * JpaSpecification 보다 관리 용이
  * Join이 필요한 경우 복잡도가 증가로 QueryDsl 사용 추천

### JPA Repository

````java
@Repository
public interface BbsJpaRepository extends JpaRepository<Bbs, Long> {
    List<Bbs> findAll(Specification spec, Pageable pageable);
}
````
### QueryDsl Repository

```java
public interface BbsRepository {
    List<Bbs> findAll(SearchRequest request, Pageable pageable);
}
public class BbsQueryDslRepositoryImpl extends QuerydslRepositorySupport implements BbsRepository{
    public BbsRepository() {
        super(Bbs.class);
    }
    
    @PersistenceContext(unitName = "entityManager") // 여러개 사용중이라면...
    @Override
    public void setEntityManager(EntityManager entityManager) {
        super.setEntityManager(entityManager);
    }

    public List<Bbs> findAll(SearchRequest request, Pageable pageable) {
        return jpaQueryFactory
                .select(Projections.bean(Bbs.class, bbs.id, bbs.title, bbs.contents))
                .from(bbs)
                .where(condition(request.getId(), bbs.id::eq),
                        condition(request.getTitle(), bbs.title::contains),
                        condition(request.getConte(), bbs.title::contains))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(orderCondition(pageable))
                .fetch();
    }

    public Long bulkUpdate() {
        return jpaQueryFactory
                .update(bbs)
                .set(bbs.viewCount, bbs.viewCount.add(1))
                .where(bbs.id.eq(25))
                .execute();
    }

    public void bulkDelete() {
        jpaQueryFactory.delete(bbs)
                .where(bbs.id.eq(25))
                .execute();
    }

    private <T> BooleanExpression condition(T value, Function<T, BooleanExpression> function) {
        return Optional.ofNullable(value)
                .map(function)
                .orElse(null);
    }
    
    private OrderSpecifier[] orderCondition(Pageable pageable) {
        PathBuilder<Bbs> entityPath = new PathBuilder<>(Bbs.class, "bbs");
        return pageable.getSort()
                .stream()
                .map(order -> new OrderSpecifier(
                        Order.valueOf(order.getDirection().name(), entityPath.get(order.getProperty))
                        ))
                .toArray(OrderSpecifier[]::new);
    }

}
```
* BooleanBuilder vs BooleanExpression
  * BooleanExpression
    * where 조건에 null 값은 무시됨.
    * Predicate의 구현체
* Bulk Update 유의사항
  * JPA는 더티체킹(변경감지)으로 Update 발생
  * QueryDsl로 벌크 업데이시 영속성 컨텍스트를 무시하고 쿼리 날리기 때문에, 같은 트랜잭션에서 select 할때 영속성 컨텍스트의 값을 조회하게 됨.
    * 벌크 작업후 em.flush(), em.clear()를 통해 영속성 컨텍스트를 초기화 하면 해

### 참고
* https://docs.spring.io/spring-data/jpa/docs/2.1.3.RELEASE/reference/html/#repositories.custom-implementations
  * SpringDataJPA의 Custom Repository 구현체의 이름은 `-Impl`로 끝나야 한다
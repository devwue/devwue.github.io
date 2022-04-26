# Spring JPA, MySQL GroupBy FileSort

MySQL에서 Group By를 실행하면 Group By column에 의한 Filesort 정렬이 추가로 실행됨.
* index가 없을때
* Order by null 를 조건에 추가하면 Filesort 안함.

### QueryDsl - GroupBy FileSort 방지
```java
public class OrderByNull extends OrderSpecifier {

    public static final OrderByNull DEFAULT = new OrderByNull();

    private OrderByNull(){
        super(Order.ASC, NullExpression.DEFAULT, NullHandling.Default);
    }
}
public class MyQueryDslRepository {
    public List<Integer> useOrderByNull() {
        return queryFactory
                .select(member.age.sum())
                .from(member)
                .innerJoin(member.team, team)
                .groupBy(member.team)
                .orderBy(OrderByNull.DEFAULT)
                .fetch();
    }
}
```
```sql
select
    sum(member0_.age) as col_0_0_ 
from
    member member0_ 
inner join
    team team1_ 
        on member0_.team_id=team1_.team_id 
group by
    member0_.team_id 
order by
    null asc
```

### 참조
* https://velog.io/@youngerjesus/%EC%9A%B0%EC%95%84%ED%95%9C-%ED%98%95%EC%A0%9C%EB%93%A4%EC%9D%98-Querydsl-%ED%99%9C%EC%9A%A9%EB%B2%95
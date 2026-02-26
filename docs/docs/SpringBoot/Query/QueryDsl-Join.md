# Spring QueryDsl - Join

### Cross Join 사용 자제..
```java
public List<Member> join() {
    return queryFactory
        .selectFrom(member)
        .where(member.team.id.gt(member.team.leader.id))
        .fetch();
}
```
```sql
select
    member0_.member_id as member_i1_0_,
    member0_.age as age2_0_,
    member0_.team_id as team_id4_0_,
    member0_.username as username3_0_
from
    member member0_ cross
                        join
    team team1_
where
    member0_.team_id=team1_.team_id
  and member0_.team_id>team1_.member_id
```
#### 개선
join시 꼭 innerJoin, leftJoin, rightJoin 명시에서 사용하는 버릇을 기르자
```java
public List<Member> join() {
    return queryFactory
        .selectFrom(member)
        .innerJoin(member.team, team)
        .where(member.team.id.gt(member.team.leader.id))
        .fetch();
}
```
```sql
select
    member0_.member_id as member_i1_0_,
    member0_.age as age2_0_,
    member0_.team_id as team_id4_0_,
    member0_.username as username3_0_ 
from
    member member0_ 
inner join
    team team1_ 
        on member0_.team_id=team1_.team_id 
where
    member0_.team_id>team1_.member_id
```

### 참조 (좋은글 까먹으면 한번더 읽자...)
* https://velog.io/@youngerjesus/%EC%9A%B0%EC%95%84%ED%95%9C-%ED%98%95%EC%A0%9C%EB%93%A4%EC%9D%98-Querydsl-%ED%99%9C%EC%9A%A9%EB%B2%95
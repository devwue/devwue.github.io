# Redis 에서 제공하는 Sorted Sets 자료구조
> zincrby: 지정된 key의 점수 증가 <br>
> zscore: 지정 key의 점수 조회 <br>
> zrevrank: 지정 key의 순위를 reverse로 조회 <br>
> zrervrangebyscore: 지정 key의 순위 범위를  reverse 조회 <br>
> zrem: 지정 key 지우기 

### 무엇을 할 수 있나? 간단한 랭킹
* 주의 사항
  * 랭킹 redis 서버의 메모리 최대 사용량을 예측 해야 함.
  * 기간내 유효한 랭킹을 구현한다면 key를 잘 만들어야 함.
    > rank:point:202101-202103 `1분기 포인트랭킹, 이후 수동 삭제` 
    

* PHP 코드 샘플링

  ```injectablephp
    function redis() { return new RedisCluster(); };
    
    redis()->zincrby('point', 1, memberId);
    // 랭킹 범위 Top 10 (입력된 정보 + 점수 까지 조회)
    redis()->zrevrange('point', 0, 9, 'withscores');
    // 특정 점수 조회
    redis()->zscore('point', memberId);
    // 특정 순위
    redis()->zrevrank('point', memberId);
    // 특정 멤버 삭제
    redis()->zrem('point', memberId);
    ```

* JAVA 코드
```java
// add score
zSetOperations.incrementScore("point", memberId, 1);
// reverse score top10 
zSetOperations.reverseRange("point", 0, 9);
// remove
zSetOperations.remove("point", memberId)
```


### 또 어디에 사용 가능한가?
* 번호표를 사용한 입장권 부여
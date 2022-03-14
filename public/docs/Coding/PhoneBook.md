# 문제풀이 - 전화번호 목록
> 프로그래머스 문제 풀이

* 전화번호 목록
  * https://programmers.co.kr/learn/courses/30/lessons/42577
  * 전화번호 목록 제공
    * 다른 전화번호의 접두어가 있는 경우 false

  | phone_book | return |
  |------|---------|
  |["119", "97674223", "1195524421"]| false|
  |["123","456","789"]| true|
  |["12","123","1235","567","88"]| false|

### 내 코드
```java
import java.util.*;

class Solution {
    public boolean solution(String[] phone_book) {
        Arrays.sort(phone_book);
        for (int i = 0; i < phone_book.length -1; i++) {
            if (phone_book[i+1].startsWith(phone_book[i])) {
                return false;
            }
        }
        return true;
    }
}
```
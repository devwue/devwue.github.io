# 문제풀이 - 위장
> 프로그래머스 문제 풀이

* 위장
  * https://programmers.co.kr/learn/courses/30/lessons/42578
  * 스파이의 착용 가능한 것들 제공해 위장 가능한 가지수 찾기

  | clothes | return |
  |--------|------|
  | [["yellowhat", "headgear"], ["bluesunglasses", "eyewear"], ["green_turban", "headgear"]]| 5      |
  | [["crowmask", "face"], ["bluesunglasses", "face"], ["smoky_makeup", "face"]] | 3 |


### 내코드
```java
import java.util.*;

class Solution {
    public int solution(String[][] clothes) {
        HashMap<String, Integer> map = new HashMap();
        for (String[] clothe : clothes) {
            String type = clothe[1];
            map.put(type, map.getOrDefault(type,0) +1);
        }
        int answer = 1;
        Iterator<Integer> iter = map.values().iterator();
        while (iter.hasNext()) {
            answer *= iter.next().intValue() +1;
        }
        return answer -1;
    }
}
```
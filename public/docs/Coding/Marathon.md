# 문제풀이 - 마라톤 완주하지 못함
> 프로그래머스 문제 풀이

* 완주하지 못한 선수
  * https://programmers.co.kr/learn/courses/30/lessons/42576
  * 참가자, 완주자가 주어졌을때 미 완주 선수 찾기
 
  | participant | completion | return |
  |---|---|---|
  |["leo", "kiki", "eden"] |["eden", "kiki"]|"leo"|
  |  ["marina", "josipa", "nikola", "vinko", "filipa"] |["josipa", "filipa", "marina", "nikola"] | "vinko" |
  |["mislav", "stanko", "mislav", "ana"]	| ["stanko", "ana", "mislav"] | "mislav" |

### 내 코드
```java
import java.util.*; 

class Solution {
    public String solution(String[] participant, String[] completion) {
        String answer = "";
        HashMap<String, Integer> map = new HashMap();
        for (String man: participant) {
            map.put(man, map.getOrDefault(man, 0) +1);
        }
        for (String man: completion) {
            map.put(man, map.get(man) - 1);
        }
        Iterator<Map.Entry<String, Integer>> iter = map.entrySet().iterator();
        while(iter.hasNext()) {
            Map.Entry<String, Integer> entry = iter.next();
            if (entry.getValue() != 0) {
                answer = entry.getKey();
                break;
            }
        }
        return answer;
    }
}
```
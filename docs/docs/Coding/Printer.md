# 문제풀이 - 프린터 
> 프로그래머스 문제 풀이

* 프린터
  * https://programmers.co.kr/learn/courses/30/lessons/42587
  * 중요도가 높은 문서를 먼저 인쇄하는 프린터기
    * 대기열의 몇번째 문서를 인쇄 요청 했을때 몇번째 출력이 되는지 리턴
  * 제한사항
    * 대기목록은 1 ~ 100개 이하
    * 작업 중요도는 1~9, 높을수록 중요
    * location은 0이상

  | priorities | location | return |
  |----------|-------|---|
  |[2, 1, 3, 2]| 2        | 1     |
  |[1, 1, 9, 1, 1, 1]| 0        | 5     |

### 내 코드
```java
import java.util.*;

class Solution {
    public int solution(int[] priorities, int location) {
        int cnt =0;
        // printOrder Array
        int[] cp = Arrays.stream(priorities).boxed()
            .sorted(Comparator.reverseOrder()).mapToInt(Integer::intValue).toArray();
        
        // add Q
        Queue<HashMap> wait = new LinkedList<>();
        
        for (int i =0; i< priorities.length; i++) {
            HashMap<String, Integer> map = new HashMap<>();
            map.put("id", i);
            map.put("data", priorities[i]);
            wait.add(map);
        }
        // printing..
        while(wait.peek() != null) {
            int max = cp[cnt];
            HashMap<String, Integer> map = wait.poll();
            if (max == map.get("data")) {
                if (location == map.get("id")) {
                    return cnt+1;
                }
                cnt++;
            } else {
                wait.add(map);
            }
        }
        return 0;
    }
}
```
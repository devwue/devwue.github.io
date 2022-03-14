# 문제풀이 - 베스트 앨범

* 베스트 앨범
  * https://programmers.co.kr/learn/courses/30/lessons/42579
  * 장르별 많이 재생된 노래를 2개씩 모아 베스트 앨범 출시
    * 재생이 가장 많은 장르 먼저 수록
    * 장르내 많이 재생된 노래 수록
    * 고유번호가 낮은 노래를 먼저 수록
  
  | generes | plays | return |
  |---|---|---|
  | ["classic", "pop", "classic", "classic", "pop"]	  | [500, 600, 150, 800, 2500]	  | [4, 1, 3, 0] |

### 내 코드
```java
import java.util.*;

class Solution {
    public int[] solution(String[] genres, int[] plays) {
        Album[] list = new Album[genres.length];
        HashMap<String, Kinds> catalog = new HashMap();
        
        // merge first
        for(int i = 0; i < genres.length; i++) {
            String type = genres[i];
            Album al = new Album();
            al.id = i;
            al.type = type;
            al.count = plays[i];
            list[i] = al;
            if (catalog.containsKey(type)) {
                Kinds k = catalog.get(type);
                k.count += plays[i];
            } else {
                Kinds k = new Kinds();
                k.type = type;
                k.count = plays[i];
                catalog.put(type, k);
            }
        }
        
        Arrays.sort(list);
        // search max 
        Kinds[] kinds = new Kinds[catalog.size()];
        int i = 0;
        for (Map.Entry<String, Kinds> map : catalog.entrySet()) {
            kinds[i++] = map.getValue();
        }
        Arrays.sort(kinds);
        // add track
        List<Album> best = new ArrayList();
        for (Kinds k: kinds) {
            i = 0;
            for(Album al: list) {
                if (i<2 && al.type.equals(k.type)) {
                    best.add(al);
                    i++;
                }
            }
        }
        int[] answer = new int[best.size()];
        for (i=0; i<best.size(); i++) {
            answer[i] = best.get(i).id;
        }    
        return answer;
    }
    class Kinds implements Comparable<Kinds> {
        String type;
        Integer count;
        
        int getCount() { return count; }
        
        @Override
        public int compareTo(Kinds al) {
            return al.getCount() - count;
        }
    }
    class Album implements Comparable<Album> {
        Integer id;
        String type;
        Integer count;
        
        int getCount() { return count; }
        
        @Override
        public int compareTo(Album al) {
            return al.getCount() - count;
        }
    }
}
```
# 문제풀이 - 기능개발
> 프로그래머스 문제 풀이
* 기능개발
  * https://programmers.co.kr/learn/courses/30/lessons/42586
  * 서로 다른 개발 속도/진행률을 가진 프로젝트가 진행중
    * 먼저 개발이 완료되어도, 앞 개발이 완료되지 않으면 배포 불가
  * 제한
    * 작업 개수는 100개 이하
    * 작업 진도는 100미만 자연수 
    * 작업 속도는 100이하 자연수
    * 배포는 하루 한번, 하루의 끝에 진행

  |progresses| speeds |return|
  |---|--------|----|
  | [93, 30, 55]	| [1, 30, 5]|[2, 1]|
  |[95, 90, 99, 99, 80, 99]| [1, 1, 1, 1, 1, 1]|[1, 3, 2]|

### 내 코드
```java
import java.util.*;

class Solution {
    public int[] solution(int[] progresses, int[] speeds) {
        // merge first
        Project[] projects = new Project[progresses.length];
        for (int i=0; i< progresses.length; i++) {
            Project project = new Project();
            project.progress = progresses[i];
            project.speeds = speeds[i];
            project.days = (int) Math.ceil((100.0 - project.progress) / project.speeds);
            projects[i] = project;
        }
        // deploy schedule
        TreeMap<Integer, Integer> tmp = new TreeMap<>();
        int max = 0;
        for (int i=0; i< projects.length; i++) {
            Project project = projects[i];
            if (max < project.getDays()) {
                max = project.getDays();
            }
            tmp.put(max, tmp.getOrDefault(max, 0) + 1);
        }
        return tmp.values().stream().mapToInt(i->i).toArray();
    }
    class Project implements Comparable<Project> {
        Integer progress;
        Integer speeds;
        Integer days;

        public int getDays() {
            return days;
        }

        @Override
        public int compareTo(Project o) {
            return days - o.getDays();
        }
    }
}
```
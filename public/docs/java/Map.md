# Java - Map, HashMap, TreeMap
> Java 에서 제공하는 컬렉션중 하나

### Map
  > Key, Value 를 Map.Entry 정의하여 저장, 관리
  > 순서 없음
  
* HashMap
  > HashCode() 리턴 값을 기반으로 동작
  > 속도: O(1)

  | HashMap | HashTable  | 특징                |
  |---------|------------|---------------------|
  | O       | X          | Key, Value Null 허용|
  | X       | O          | Thread Safe         |


* TreeMap
  > RedBlock Tree로 저장
  > Key 값 기준, 정렬 상태 유지
  > 속도: O(log N)
 
* LinkedHashMap
  > 데이터의 입력된 순수를 기억
  > 각 Node에 before, after 연결 구조를 가짐
  > 속도: O(1)
  
### 데이터 순회
1. entrySet()
  > Key, Value 모두 필요한 경우 사용
  ```java
  for (Map.Entry<String, String> entry: map.entrySet()) {
     System.out.println(entry.getKey() + ":" + entry.getValue());
  }
  ```

2. keySet()
  > key 만 필요한 경우 사용
  ````java
  for (String key : map.keySet()) {
    System.out.println(key + ":" + map.get(key));
  }
  ```` 

3. etc
````java
// iterator..
Iterator<Map> iter = map.entrySet().iterator();
while (iter.hasNext()) {
    Map.Entry<String, String> entry = iter.next();
    System.out.println(entry.getKey() + ":" + entry.getValue());
}
// lamda
map.entrySet().stream().forEach(entry -> {
  System.out.println(entry.getKey() + ":" + entry.getValue());
});
````
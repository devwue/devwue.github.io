# Java - Stream
> 배열, 컬렉션을 다루는 또 하나의 방법 - Java 8 New Feature

### 배열 스트림
```java
import java.util.Arrays;

Integer[] arr = {1,3,2};

Arrays.stream(arr).forEach(System.out::println);

// output
1
3
2
```

### 컬렉션 스트림
> Collection, List, Set
```java
import java.util.List;

List<String> list = Arrays.asList("a", "b", "c");
list.stream().parallelStream(); // 동시 처리..
```

### 활용하기 
```java
// empty stream
public Stream<String> streamOf(List<String> list) {
    return list.isEmty() ? Stream.empty() 
        : list.stream();
}

// iterate
Stream<Integer> iter = Stream.iterate(2, n -> n+2).limit(3); // [2, 4, 6]

// generate, limit 필수 지정 필요, 없으면 무한
Stream<String> gener = Stream.generate(() -> "gen").limit(3); // ["gen", "gen", "gen"]

// 기본 
IntStream intStream = IntStream.range(1,4); // [1, 2, 3]
LongStream longStream = LongStream.rangeClosed(1,4); // [1, 2, 3, 4]

// 정렬 Asc
int[] intArry = {1,6,2,4};
Arrays.sort(intArry); // [1, 2, 4, 6]
        
// 정렬 Desc
int[] intArry = {1,6,2,4};
Arrays.stream(intArry).boxed()
        .sorted(Comparator.reverseOrder())
        .mapToInt(Integer::intValue).toArray(); // [6, 4, 2, 1]

// 문자열 스트링
IntStream charStream = "Stream".chars(); // [83, 116, 114, 101, 97, 109]
Stream<String> explodeStream = Pattern.compile(", ")
        .splitAsStream("Apple, Banana, Java"); // [ Apple, Banana, Java]


// 파일 스트림
Stream<String> lineStream = Files.lines(Paths.get("file.file"), Charset.forname("UTF-8"));

// 병렬 처리
Stream<Product> parallel = products.paralleStream();
Boolean isParallel = parallel.isParallel(); // true
        
parallel.map(product -> Math.floor(product.getAmount()))
        .anyMatch(amount -> amount > 200);


// 단순 데이터 확인 peek
IntStream.of(1,3,4)
        .peek(System.out::println) // 단순 프린트만 처리
        .sum();

// 데이터 분석
IntSummaryStatistics stat = reserveList.stream()
        .collect(Collectors.summarizingInt(Reserve::getAmount));
      //  IntSummaryStatistics {count=5, sum=86, min=13, average=17.200000, max=23}
```

### 데이터 분석 - collect
  * Collectors.groupingBy
    > 특정 조건으로 요소들을 그룹핑 <br>
    > Function 인자를 받아 처리
    ````java
    Map<String, List<Reserve>> result = reserveList
        .stream()
        .collect(Collectors.groupingBy(Reserve::getType));
    ````
    
  * Collectors.partitioningBy 
    > Predicate 인자를 받아 boolean 리턴
    ````java
    Map<String, List<Reserve>> result = reserveList
        .stream()
        .collect(Collectors.partitioningBy(reserve -> reserve.getType().equals("booked")));
    ````
    
  * Collectors.collectingAndThen
    > 추가 작업이 필요한 경우 사용 <br>
    > Set으로 처리후, 수정 불가능한 Set으로 재처리
    ````java
    Set<Reserve> lockSet = reserveList
      .stream()
      .collect(Collectors.collectingAndThen(
          Collectors.toSet(),
          Collections::unmodifiableSet));
    ````
        

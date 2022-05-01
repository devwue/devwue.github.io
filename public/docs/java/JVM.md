# Java, JVM
### 메모리 구조와 할당
  | Method Area | Heap Area | Stack Area | PC Registers | Native Method Area |
  |-----------|------------|--------------| ---- | ---- |
* Method Area
    * 읽어온 클래스, 인터페이스 정보 저장
    * 각 클래스, 인터페이스 상수, 메소드 필드와 모든 레퍼런스 
      
* Heap Area
    * Runtime 시간에 동적 데이터 저장, GC 동작 대상
    
    | Eden                 | Survivor.. | Old      | Permanent  |
    |------------|----------|------------|------------|
    | <-- Young Generation |       -->|          |
    | new, move to Surviver | Minor GC   | Major GC | Load된 클래스 저장 |
      
* Stack Area
    * 지역 변수, 파라미터, 메소드 정보, 임시 데이터 저장
    * JVM은 push/pop 하는 연산만 수행
    * printStackTrace()를 통해 Stack Trace로 스택 프레임 출력
* PC Registers
    * 스레드가 시작될때 생성
    * 스레드의 명령어 실행을 기록, JVM 명령어 주소 저장
* Native Method Area
    * 바이트 코드가 아닌 Binary Code 실행 영역
    * JNI(Java Native Interface)를 통해 호출되는 C/C++ 코드 실행 영역 (I/O작업을 위한 외부 라이브러리 함수 등)

-----
## JVM 실행 옵션
```shell
$ java -server \
-Xmx8G -Xms8G \
-XX:+UseG1GC \
-XX:MaxMetaspaceSize=256m \
-XX:+CMSClassUnloadingEnabled
```
* -Xms - Java8에서 Deprecated
  * Java8에서 Heap은 Native Memory 영역으로 넘어갔음
  * Heap 메모리 하한선
* -Xmx - Java8에서 Deprecated
  * Heap 메모리 상한선
* -XX:MaxMetaspaceSize - default: None, 사용가능한 메모리 상한선을 정한다고 보면 됨.
  * 미설정시 Metaspace가 증가하다가 JVM이 죽을수 있음
* -XX:CMSClassUnloadingEnabled - Java 5-7와 관련, Java8에서 수정됨
  * 미 설정시 PermGen에 GC가 되지 않아 메모리 누수가 있음
* -XX:MaxDirectMemorySize - Direct Buffer 할당 크기 생략시 (-Xmx 동일)
  
#### GC 종류 - 아래로 갈수록 개선 되었음.
  * Serial GC - 순차적인 GC 방식
    * +UseSerialGC
  * Parallel GC - 메모리도 넉넉하고 CPU도 빵빵하고, Serial GC를 멀티 쓰레드로...
    * +UseParallelGC, +ParallelGCThreads (Miner GC 쓰레드 개수)
  * Parallel Old GC - Parallel GC 업글판 Old GC 개선 버전
    * +UseparallelOldGC, +ParallelGCThreads (Miner, Full GC 쓰레드 개수)
  * CMS GC - 위 보다 개선, GC과정에서 발생되는 시간을 최소화 하는데 초점을 맞춤, 대신 CPU사용량이 위보다 높음
    * +UseConcMarkSweepGC
  * G1 GC (Garbage First) - 큰 메모리에서 좋은 성능을 내기 힘들었기에, 이를 개선한 GC <br>
    큰 Heap 메모리에서 짧은 GC시간을 보장하는데 목적을 둠
    * +UseG1GC

#### GC 로그 분석
```shell
-XX:+PrintClassHistogramAfterFullGC 
-XX:+PrintClassHistogramBeforeFullGC 
-XX:+PrintGC 
-XX:+PrintGCApplicationStoppedTime 
-XX:+PrintGCDateStamps 
-XX:+PrintGCDetails 
-XX:+PrintGCTimeStamps 
-XX:+PrintHeapAtGC 
-XX:+PrintReferenceGC 
```
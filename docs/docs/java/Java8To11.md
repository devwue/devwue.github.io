# Java 8 to Java 11

* Required
  * 최소 (Spring Framework 5.1 or Spring Boot 2.1)
  
* gradle 프로젝트 설정
  ````groovy
  sourceCompatibility = 11
  targetCompatibility = 11
  ````
  
* Jenkins file Docker 설정
  ```groovy
  publishAppPipeline meta: meta, timeoutMin: 15, {
    packageJava meta: meta, jdkVersion: 11, {
      sh "bash gradlew clean build"
    }
  }
  ```
 
### JVM 옵션
* xlog 예제 (G1)
  > -Xms512m -Xmx512m -XX:+UseG1GC -XX:NewRatio=2 -XX:MaxMetaspaceSize=256m -verbose:gc -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/var/log -Xlog:gc*:file=/var/log/gc.log:t,p::filecount=10,filesize=10M

| JAVA8        | JAVA11                           | -              |
|--------------|----------------------------------|----------------|
| -XX:+UseG1GC | -XX:+UseG1GC                     | 동일(default G1) | 
| -verbose:gc | -verbose:gc                      |                |
| -Xloggc | -Xloggc                          |                |
| -XX:+HeapDumpOnOutOfMemoryError | -XX:+HeapDumpOnOutOfMemoryError	 |                |
| -XX:HeapDumpPath	| -XX:HeapDumpPath	                |                |
| -XX:+PrintGCDetails | 지원하지 않음 (Xlog사용)                 |                |
| -XX:+PrintGCDateStamps | 지원하지 않음 (Xlog사용)                 |                |
| -XX:-UseGCLogFileRotation	| 지원하지 않음 (Xlog 사용)	|                |
| -XX:GCLogFileSize	| 지원하지 않음 (Xlog 사용)	|                |
| -XX:NumberOfGCLogFiles |  지원하지 않음 (Xlog 사용)	|                |

## Java Version New Feature
* Java 9
  * JEP 200, 201 Jigsaw Project
  * JEP 110 HTTP Client
    
    ```java
    HttpRequest request = HttpRequest.newBuilder()
      .uri(new URI("https://postman-echo.com/get"))
      .GET()
      .build();
    ```
  * JEP 222 Jshell
    * jshell 에서 라인단위의 자바코드를 실행 가능
  * JEP 269 Collection Factory Method
    * Immutable List, Set, Map and Map.Entry
      ````java
      List immutableList = List.of();
      List immutableList = List.of("one","two","three");
      ````
    * Interface Private Method
      * Java 8에 추가된 Default Method 처럼 private method를 생성해 중복을 줄일 수 있게 함
    * Optional 확장
      * stream : ?? 무엇??
      * ifPresentOrElse : 기존에 ifPresent를 사용한 경우 else 처리를 별도로 해야했지만 하나의 메서드에서 정의가 가능
         ````java
         opt.ifPresentOrElse(x -> System.out.println("Result found: " + x),
             () -> System.out.println("Not Found."))
         ````
      * or : 메인이 empty 인경우 or의 값을 제공하도록 값지정, 대상의 값 자체가 바뀌는 것이 아니라 empty인 상태에서만 대체한다.
* Java 10
  * JEP 286 로컬 변수 타입 유추
    * 유추가능한 경우 var로 담을 수 있다.
     ```java
     var list = new ArrayList<String>(); 
     ```
  * 사용 제약조건
    * 변수 초기화하면서 선언 : var numbers = List.of(1,2,3,4,5);
    * 반복문에서 지역변수로 선언 : for(var number : numbers) {}
  * JEP 307 기본 GC를 G1으로 변경 (기존 기본은 Parallel Full GC)
  * JEP 312 Thread-Local Handshakes
    * JVM safepoint(Stop the world)를 줄여서 Thread callback이 가능하게 하는 기능
  * JEP 317 Jit Compiler 실험적 도입
    * 기존 C1, C2 의 Runtime Compiler 외에 JIT Compliler가 사용가능함
    * JIT으로 Graal 설정가능 : -XX:+UnlockExperimentalVMOptions -XX:+UseJVMCICompiler
* Java 11
  * Java String New Method
    * String.isBlank() - blank 체크
    * String.lines() - Line Split과 동일 동작
    * String.strip() - Trim 동작 (Unicode 포함)
    * String.repeat(count) - 특정 문자열 반복생성
  * JEP 335 Deprecate Nashorn JavaScript Engine
    * Hibernate의 ScrpitAssert와 같은 곳에서 사용하는 엔진이 deprecated 되어 warning 발생
  * JEP 333 ZGC 실험적 도입
  * JEP 181 클래스 중첩 접근 제한
    ````java
    public class Main {
        public void myPublic() {
        }

        private void myPrivate() {
        }

        class Nested {
            public void nestedPublic() {
               myPrivate();  // throw IllegalStateException
            }
        }
    }
    ````
  * JEP 318 Epsilon No-Op GC
    * 메모리 할당, 해제를 하는 GC가 아닌 할당만 하는 GC
    * 수명이 짧아 수행하고 사라지는 경우 해제를 하지 않아 종료시 처리가 빠르나 OOM 발생 가능성이 있어서 실 서비스에서 사용처가 많지 않을 듯
  * 최소 (Spring Framwork 5.1 / Spring Boot 2.1)

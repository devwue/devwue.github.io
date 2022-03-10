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



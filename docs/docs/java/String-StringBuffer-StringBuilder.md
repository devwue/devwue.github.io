# String, StringBuffer, StringBuilder

String 은 불변하기 때문에 값을 변경할 수 없다.
* 한번 사용 후 GC 처리 대상이 된다.. 

### String
### StringBuffer vs StringBuilder
공통 메소드가 동기화 되기 때문에 멀티 쓰레드 환경에서 좋음
* 일반적인 환경에서는 StrinBuilder 가 좋다
#### StringBuffer
#### StringBuilder
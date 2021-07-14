# Jackson ObjectMapper
> SpringBoot @RestController 어노테이션을 사용한 경우 요청과 응답의 객체, 변환 및 직렬화/역직렬화 처리가 필요할 때 자동으로 이라이브러리가 적용됨.

* object -> json 변환시 자동으로 맡겨도 문제 없음, 그러나 가끔 세부적으로 컨트롤이 필요한 경우가 있음
  * @JsonIncloude
    > Null Value 필드에 대한 제외 처리 (클래스/필드 모두 가능)
    ```java
    @JsonInclude(Include.NON_NULL)
    public class Member {
        private String MemberName;
    
        @JsonInclude(Include.NON_NULL)
        private String memberName;
    }
    ```
# Bean Validation - Annotation
> 여기서는 annotation
* Bean Validation 은 명세일 뿐 실제 코드가 아님.

### Annotation ...
> @Valid 을 붙여야 실제 동작  
* @DecimalMax(value=, inclusive=) : value로 설정한 값보다 작은지 확인 (inclusive가 true이면 value 값도 인정)
* @DecimalMin(value=, inclusive=) : value로 설정한 값보다 큰지 확인 (inclusive가 true이면 value 값도 인정)
* @Digits(integer=, fraction=) : 정해진 자릿수 이하인지 확인 (integer는 허용 가능한 정수 자릿수, fraction은 허용 가능한 소수점 이하 자릿수)
* @Email : 이메일 형식인지 확인
* @Future : 해당 시간이 미래인지 확인
* @FutureOrPresent : 해당 시간이 현재 또는 미래인지 확인
* @Max(value=) : 설정한 값보다 작은지 확인
* @Min(value=) : 설정한 값보다 큰지 확인
* @NotBlank : null이 아니고 한 개 이상의 문자를 포함하는지 확인(공백 제외)
* @NotEmpty : null이 아니고 한 개 이상의 문자를 포함하는지 확인(공백 포함)
* @Negative : 음수인지 확인
* @NegativeOrZero : 음수이거나 0인지 확인
* @Null : null인지 확인
* @Past : 해당 시간이 과거인지 확인
* @PastOrPresent : 해당 시간이 현재 또는 과거인지 확인
* @Positive : 양수인지 확인
* @PositiveOrZero : 양수이거나 0인지 확인
* @Size(min=, max=) : 해당 범위의 값인지 확인(max, min 값 포함)
* @Length
  * Hibernate 의 @Size 어노테이션
* @NotBlank
* @NotNull : null이 아닌지 확인
* @AssertTrue, @AssertFalse
  ```java
  public class MemberRequest {
      private Boolean hasAgree;
      @AssertTrue(message = "항상 동의")
      public boolean isAgree() {
          return hasAgree;
      }
  }
  ```
* @Pattern(regex=, flags=) : 해당 정규식을 만족하는지 확인
  ````java
  public class MemberRequest {
      @Pattern(regexp = "^\\d{3}-\\d{3,4}-\\d{4}$", message = "전화번호 형식")
      private String phone;
  }
  ````
* @ScriptAssert - 필드 수준이 아닌 클래스 수준에서 검증
  ```java
  @ScriptAssert(lang="javascript",
      script = "(_.email != null && _.email.length() > 0) ||" +
       "(_.phone != null && _phone.length() > 0)",
      message = "이메일 혹은 전화번호중 하나는 필수")
  public class MemberRequest {
      private String email;
      private String phone;
  }
  ```
  
### Exception Handling
* @ExceptionHandler
```java
public class MyController {
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(ConstraintViolationException.class)
    public Object exception(Exception e) {
        return e.getMessage();
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleMethod(MethodArgumentNotValidException e) {
        final ErrorResponse response = ErrorResponse.of(ErrorCode.INVALID_INPUT_VALUE, e.getBindingResult());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}
```
* ContainsValidator.class
   ```java
   @Contraint(validdatedBy = ContrainsValidator.class)
   @Target({ ElementType.METHOD, ElementType.FIELD, ElementType.PARAMETER})
   @Retension(RetentionPolicy.RUNTIME)
   @Documented    
   public @interface MyConstraint {
       String message() default "{com.my.spring.message}";
       Class<?>[] groups() default {};
       Class<? extends Payload>[] payload() default{};
   }
   ```
   
### Hibernate Validator는 구현체 
* Message 재정의
> javax.validation.constraints.Positive.message=어쩌고 저쩌고
> @AssertTrue(message = "{com.my.spring.message}")
> ValidationMessage.properties 파일에 정의 (영어)
  ```yaml
  com.my.spring.validation.message=${validatedValue} is not allowd
  ```
> ValidationMessage_Ko_KR.properties
  ```yaml
  com.my.spring.validation.message=${validatedValue} 허용 되지 않는 값 입니다.
  ```
  > Locale.setDefault(Locale.KOREAN)

* Spring Boot 에서 사용
> org.springframework.boot:spring-boot-starter-validation
* Service / Bean
  ````java
  @Validated
  @Service 
  public class MyService {
      //todo
  }
  ````
* Controller
  `````java
  @PostMapping("/signup")
  public Response signup(@Valid SignUp signup) {}
  `````
> 
> 

### Test Code
```java
@Test
public void testMemberRequest() {
    final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();
    final MemberRequest memberRequest = MemberRequest.builder()
        .email("my@email.com")
        .phone("0")
        .build();
    // when
    final Collection<ConstraintViolation<MemberRequest>> constraint = validator.validate(memberRequest);
    // then
    Assert.assertEquals("폰번호 형식", constraint.iterator().next().getMessage());
}
```
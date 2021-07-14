# Bean Validation - Annotation
> 여기서는 annotation
* Bean Validation 은 명세일 뿐 실제 코드가 아님.

> @Valid 을 붙여야 실제 동작  
* @Length
* @NotBlank
* @NotNull
*  ContainsValidator.class
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
   
## Hibernate Validator는 구현체 
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

1. @ScriptAssert
2. 

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

# Spring - @ControllerAdvice, @RestControllerAdvice
> 예외 처리, 바인딩 설정, 컨트롤러 전반에 걸쳐 적용하고 싶은 경우 사용
* @ExceptionHandler 와 함께 사용시 범위내 예외 처리 가능
* @InitBinder와 함께 사용시 범위내 바인딩 또는 검증을 설정 가능
* @ModelAttribute와 함께 사용시 범위내 모델 정보 설정 가능

```java
// @RestControllerAdvice(annotations = RestController.class) // 범위 지정을 annotation 으로
// @RestControllerAdvice("com.devwue.demo") // 범위 지정을 패키지로...
@RestControllerAdvice(assignableType = {TestController.class})
public class TestControllerAdvice {
    @InitBinder("test")
    public void testBinder(WebDataBinder webDataBinder) {
        webDataBinder.setDisallowedFields("id");
    }
    
    @ModelAttribute
    public void test(Model model) {
        model.addAttribute("testOnly", Arrays.asList("charly", "monaco", "gil"));
    }
    
    @ExceptionHandler
    public String test(TestException exception, Model model) {
        model.addAttribute("message", "test error");
        return "error";
    }
}
```
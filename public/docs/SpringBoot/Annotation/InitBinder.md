# Spring - @InitBinder in @Controller, @RestController, @ControllerAdvice
WebDataBinder를 초기화 하는 메소드 설정을 제공
* 특정 컨트롤러에서 바인딩 또는 Validation 설정을 변경하고 싶을때 사용
* 요청전 @InitBinder를 선언한 메소드가 선 실행

### @InitBinder
```java
@RestController
public class TestController {
    @InitBinder("userRequest")
    
    @GetMapping("/user/info")
    public ResponseEntity<UserInfo> userInfo(@RequestParam UserRequest userRequest) {
        UserInfo userInfo = UserInfo.of(userService.getInfo(userRequest));
        return ResponseEntity.ok(userInfo);
    }
    
    @InitBinder("userRequest")
    public void userInfoBinder(WebDataBinder webDataBinder) {
        webDataBinder.addValidators(userRequestValidator);
    }
}

@Component
public class UserRequestValidator implements Validator {
    @Override
    public boolean supports(Class<?> clazz) {
        return clazz.isAssignableFrom(UserRequest.class);
    }
    @Override
    public void validate(Object object, Errors errors) {
        UserRequest userRequest = (UserRequest) object;
        if (userRequest.getUserId() < 1) {
            errors.rejectValue("userId", "invalid.userId", "입력값을 확인하세요.");
        }
    }
}
```
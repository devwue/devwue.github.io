# @Controller, @RestController

Spring Web MVC 코드에서 상요되는 어노케이션
* HTTP Respose Body 생성되는 방식의 차이


### @Controller
* View를 반환하기 위해 사용
```java
@Controller
class UserController {
    @Autowired
    private final UserService userService;
    
    @GetMapping("/user/{userId}")
    public String detail(Model model, @PathVariable("userId") Long userId) {
        User user = userService.getUserById(userId);
        model.addAttribute("user", user);
        return "/user/detail";
    }
    
    @GetMapping("/users")
    public @ResponseBody ResponseEntity<User> search(@RequestParam("userName") String userName) {
        return ResponseEntity.ok(userService.getSearchByUserName(userName));
    }
}
```
### @RestController
> @Controller + @ResponseBody 형태이며, Json 형태로 객체 데이터를 반환 하는것이 목적
```java
@RestController
class UserController {
    @Autowired
    private final UserService userService;

    @GetMapping("/user/{userId}")
    public User detail(Model model, @PathVariable("userId") Long userId) {
        return userService.getUserById(userId);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> search(@RequestParam("userName") String userName) {
        return ResponseEntity.ok(userService.getSearchByUserName(userName));
    }
}
```
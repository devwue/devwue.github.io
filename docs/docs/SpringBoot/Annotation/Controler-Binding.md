# Spring Controller Request 객체 바인딩

### @RequestParam
* 1개의 요청 파라미터를 받기 위해 사용
```java
@GetMapping("/user")
public ResponseEntity<User> user(@RequestParam(value = "userId", required = true) Long userId) {
    return ResponseEntity.ok(userService.getUserById());
}
```
### @RequestBody
* application/json, application/*+json 형태의 body 내용을 Object로 변환하기 위해 사용
  * Spring 에서는 MappingJackson2HttpMessageConverter를 통해 Java 객체로 변환됨
* text/xml, application/xml, application/*+xml
  * Jaxb2RootElementHttpMessageConverter
```java
@PostMapping("/user")
public ResponseEntity<User> user(@RequestBody UserRequest user) {
    return ResponseEntity.ok(userService.getUser(user));
}
```
### @ModelAttribute
* application/x-www-form-urlencoded, multipart/form-data 형태의 body, 파라미터의 값들을 생성자나, Setter를 통해 주입시키기 위해 사용
  * @RequestBody와 다른점은 생성자, Setter 함수를 통해 매핑을 시키고있어 없다면 null을 갖게됨.
* JSP 파일에 반환시에도 사용
```java
@PostMapping("/user")
public ResponseEntity<User> user(@ModelAttribute UserRequest user) {
    return ResponseEntity.ok(userService.getUser(user));
}

@PostMapping("/user")
public String user(@ModelAttribute UserRequest userRequest, Model model) {
    User user = userService.getUser(userRequest);
    model.addAttribute("user", user);
    return "user/detail";
}
```
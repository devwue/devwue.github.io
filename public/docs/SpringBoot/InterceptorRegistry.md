# SpringBoot Interceptor
말 그대로 스프링 프레임워크 DispatcherServlet 뒷 단에 위치 하면서 컨틀로러의 Handler가 실행되기 전에나 후에 추가 작업이 수행 되어야 할때 사용
* 공통 코드 사용으로 코드 재 사용성이 증가
* 메모리 낭비, 서버 부하 감소
* 코드 누락에 대한 위험성 감소

### Interface
```java
public interface HandlerInterceptor {
    boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler);
    void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView mav);
    void afterCompletion(HttpServletRequest request, HttpServeletResponse response, Object handler, Exception ex);
}
```
#### method
* preHandle - controller 호출전, HandlerAdaptor 이전 호출
* postHandle - controller 호출후, HandlerAdapter 호출 이후, 예외 발생시 호출 안됨.
* afterCompletion - controller / handlerAdapter 호출 이후, 무조건 호출됨

### 코드 샘플
#### 공통 
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new JwtInterceptor())
                .order(1) // 순서 지정 가능..
                .addPathPatterns("/**")
                .excludePathPatterns("/", "/login", "/logout", "/assert/**");
    }
}
```
#### JWT 로그인
```java
public class JwtInterceptor extends HandlerInterceptorAdapter {
	@Autowired
	private AuthService authService;

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws IOException, JwtException {
		String jwt = request.getHeader("Authorization");
		if (jwt == null) {
			throw new AuthenticationException("JWT is null");
		}
		try {
			authService.vertifyJwt(jwt);
		} catch (JwtException e) {
			throw new AuthenticationException("JWT is not valid");
		}
		return true;
	}
}
```
#### Session 로그인
```java
@Configuration
public class LoginInterceptor extends HandlerInterceptorAdapter {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        if (handler instanceof HandlerMethod) {
            HandlerMethod hm = (HandlerMethod) handler;
            User sessionUser = (User) request.getSession().getAttribute("USER");
            if (hm.hasMethodAnnotation(LoginRequired.class) && sessionUser == null) {
                throw new AuthenticationException(request.getRequestURI());
            }
            if(hm.hasMethodAnnotation(AdminOnly.class) && sessionUser.getAuthority() != "ADMIN") {
                throw new AuthorizationException();
            }
        }
        return super.preHandle(request, response, handler);
    }
}
```

### Interceptor vs Filter
Filter 는 인증, 로깅 / 감사, 데이터 압축
Interceptor는 어플리케이션 한정 기능 처리에 적합
* Filter 보다 상세한 데이터 처리 관련 작업, 권한 인가에 따른 데이터 처리 내용등..
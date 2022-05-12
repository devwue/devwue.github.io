# Spring AOP - @Aspect

스프링 프레임워크에서 @Aspect 로 동작을 중간에 가로 채거나 추가 로직을 실행을 할 수 있게 제공

| Servlet Container |                            | Spring             | Framework           |                                  |            |
|-------------------|----------------------------|--------------------|---------------------|----------------------------------|------------|
| Servlet Request   | FILTER                     | Dispatcher Servlet | Handler Interceptor | AOP                              | Controller |
|                   | doFilter, doFilterInternal |                    | preHandler          | @Before                          |            |
| Servlet Response  | doFilter, doFilterInternal |                    | postHandler         | @After                           |            |
|                   | doFilter, doFilterInternal |                    | afterCompletion     | @AfterReturning, @AfterThrowing  |            |
* Aspect: 관심사를 모듈화 한 것
* Target: Aspect 적용하는 대상
* Advice: 실질적인 부가기능을 담은 구현체
* JointPoint: Advice 가 적용될 위치, 지점 혹은 시점
* PointCut: JointPoint의 스펙 정의

```java
@Aspect
public class TestAspect {
    @Around()
    
    @Before("@annotation(MyAnnotation)")
    public void checkBefore(MyAnnotation annotation) {
        // do stuff
    }
    
    @Before("myMethod()")
    public void checkBefore2(JointPoint jointPoint) {
        // do stuff
    }
    
    @AfterReturning(pointcut = "myMethod()", returning = "ret")
    public void afterMyMethod(JointPoint jointPoint, Object ret) {
        // do stuff
    }
    
    @AfterThrowing(pointcut = "myMethod()", throwing = "exception")
    public void afterThrowMethod(JointPoint jointPoint, Exception exception) {
        // do stuff
    }
    
    @After("myMethod()")
    public void afterMethod(JointPoint jointPoint) {
        // do stuff
    }
    
    @Arround("myMethod()")
    public Object aroundMethod(ProceedingJointPoint jointPoint) {
        // do stuff
        jointPoint.proceed();
    }
    
    @Pointcut("@annotation(com.devwue.test.controller.*(..))")
    public void myMethod(JointPoint jointPoint) {
        // do stuff
    }
}
```

#### Advice 실행 순서
1. @Before
2. @Around
3. 타겟 메소드
4. @Around
5. @After
6. @AfterReturning


### Reference
* https://www.egovframe.go.kr/wiki/doku.php?id=egovframework:rte:fdl:aop:aspectj
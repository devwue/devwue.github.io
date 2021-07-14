# Assertion Exception
* 프로그래밍 오류, 버그를 감지하는 수단으로 사용하기 위한 것
  * 프로그램의 일부 기능 구현에 포함되어서는 안됨. 검증을 위해서만 사용 되어야 함.
* Exception
  > 다른 종류의 오류 예외 조건을 나타내기 위함
  1. 잘못된 사용자 입력, 누락된 파일...
  2. 리소스 부족 / 예상치 못한 상황 발
    
    
Java는 assert 형식으로 assertion에 대한 구문을 제공
```java
if ( x != y) {
    throw new Exception("x != y");
}
assert x != y;
```

### Spring Boot Assertion (Assert)
1. isTrue
   > throw new IllegalArgumentException
2. state   
   > throw new IllegalStateException
3. Object and Type
   > notNull, isNull, isInstanceOf, isAssignable
4. Text
   > hasLength, hasText, doesNotContain
5. Collection / Map
   > notEmpty 
6. Array
   > notEmpty, noNullElements

#### 사용자 정의
> 공통적으로 사용되는 규칙을 정의하면 유지보수가 편할수 있다.
```java
public class MyAssert extends Assert {
    public static void state(boolean expression, String message, final class<? extends ?> exceptionClass) {
        if (!expression) {
            throwException(message, exceptionClass);
        }
    }
    private static void throwException(String message, final class<? extends ?> exceptionClass) {
        try {
            throw exceptionClass.getDeclaredConstructor(String.class).newInstance(message);
        } catch (Exception e) {
            e.printStackTrace();
            throw new MySystemException(e.getMessage());
        }
    }
}
```

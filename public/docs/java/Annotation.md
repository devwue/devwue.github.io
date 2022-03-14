# Java - Annotation
> @Autowired... 같이 앞에 @붙여명명 JDK 1.5 이상 <br>
> 메타데이터란? 처리해야 하는 데이터가 아닌, 코드 처리를 어떻게 할지를 알려주는 정보
1. 컴파일러에게 코드 문법 에러를 체크하도록 정보 제공
2. 개발툴, 빌드시 코드를 자동으로 생성할 수 있도록 정보를 제공
3. 실행시 특정 기능을 실행하도록 정보 제공

### Meta Annotation
* @Retention
  > Life Time
  * Class (RetentionPolicy default)
    > 바이트 코드 파일까지 정보 유지
    > 리플렉션을 통해 어노테이션 정보를 얻을수 없음
  * Runtime
    > 바이트 코드 파일까지 정보 유지, 런타임시에 어노테이션 정보를 얻을수 있음
  * Source
    > 컴파일 이후 삭제
* @Documented
  > 문서에 어노테이션 정보가 표현됨
* @Target
  > 적용할 위치
* @Inherited
  > 자식클래스가 어노테이션을 상속 받을수 있음
* @Repeatable
  > 반복적으로 어노테이션을 선언할 수 있음

### Custom..
```java
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;

@Inherited
@Documented
@Target({
        ElementType.METHOD,
})
@Retention(RetentionPolicy.RUNTIME)
public @interface MyAnnotation {
    public enum Sex {
        MAN, FEMAIL
    }
    String name();

    Integer age() default 18;
    Sex sex() default Sex.MAN;
}

```
* 붙이기
  ```java
  class TestService {
    @MyAnnotation(name = "홍길동", age = 20, sex = MyAnnotation.Sex.MAN)
    public void method1() {
        System.out.println("method 1");
    }
  
    @MyAnnotation(name = "홍길동") // default 값이 있는 경우 생략 가능
    public void method2() {
        System.out.println("method 1");
    }
  }
  ```
* Reflection 으로 정보 가져오기
  ````java
  import java.lang.reflect.Method;
  public class Test {
     public vd main() {
        Method[] methods = TestService.class.getMethods();
        for (Method method : methods) {
            if(method.isAnnotationPresent(MyAnnotation.class)) {
                MyAnnotation anno = method.getDeclaredAnnotation(MyAnnotation.class);
                System.out.println(method.getName() + ": name is " + anno.name());
            }
        }
     }
  }
  ````
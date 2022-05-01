# Spring - Design Pattern

#### Dependency Injection
객체 자체가 아니라 Framework에 의해 객체의 의존성이 주입되는 패턴
* Framework에 의해 동적으로 주입되어 여러 객체간의 결합을 줄일수 있다.
* 스프링 IoC 컨테이너를 통해 관리됨
  1. Component Scan
  2. Bean 설정파일에 직접 빈을 등록

#### Singleton Pattern
클래스에 대해 최초 한번만 메모리를 할당 메모리에 인스턴스를 만들어 사용하는 패턴
* 실제 여러번 호출 되더라도 객체는 1개
* 스프링 컨테이너에 의해 @Bean이 정의되면 생성/관리됨 
  * @Autowired

#### Factory Pattern
객체 생성처리를 서브 클래스로 분리하여 처리하도록 캡슐화한 패턴
* 객체 생성을 별도 클래스/메소드로 분리하여 객체 생성 변화에 대비
* 스프링의 ApplicationContext getBean()
  * 스프링은 CGLib 사용, Code Generator Library로 클래스의 바이트코드를 조작하여 Proxy 객체를 생성해 주는 라이브러리
* 장점
  * 객체 인터페이스를 통해 하나로 관리
  * 비슷한 유형의 객체가 생성되어도 implement를 통해 쉽게 추가 가능
  * 협업시 공통코드를 건드리는 일이 없이 업무 진행 가능
* 단점
  * 요구 사항을 담을 인터페이스 정의
  * 인터페이스를 상속받아 구현하는 클래스 정의
  * 파라미터에 따라 구현한 Class 객체를 반환해주는 Factory Class 정의
  * Factory Class를 통해 객체를 받아 사용

#### Proxy Pattern
제어 흐름을 조정하기위해 중간에 대리자를 두는 패턴
* 실제 객체의 메소드를 호출하면, 호출을 중간에서 가로 채는 패턴
* AOP 
  * Before
  * After returning
  * After throwing
  * Around

#### Strategy Pattern
캡슐화된 패턴으로 상속을 통해 객체를 좀더 유연하게 사용 가능(팩토리와 공통점)
* 전략 패턴은 운영 패턴으로 특정 방식으로 작업을 수행하는데 사용됨.

#### MVC 패턴
Controller를 통해 요청을 받아, 업무로직, 데이터 처리는 다른 클래스로 처리, 다시 결과 데이터를 Model에 담아 
Controller에서 사용자에게 보여줄 화면을 반환하여 View를 보여주는 방식

#### Template Method Pattern
슈퍼 클래스에 기본적인 로직의 흐름을 작성, 일부 변경이 필요한 부분은 서브 클래스에서 추상 메소드로 오버라이딩하여 
사용할 수 있는 형태로 서브 클래스에서 필요에 맞게 이를 구현하여 사용하는 디자인 패턴
* ex) WebMvcConfigurer, JDBCTemplate 등...

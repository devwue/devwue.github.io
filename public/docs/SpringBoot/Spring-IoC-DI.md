# Spring - IoC / DI
스프링 컨테이너는 Bean 생명 주기를 관리하고 IoC(Inversion of Control)를 사용
* 스프링 컨테이너는 BeanFactory 를 제공하고, ApplicationContext는 이를 상속, 이를통해 컨테이너는 주입된 빈을 제어

스프링 DI
* 스프링은 런타임 시점에 객체간의 의존 관계를 연결해 줌

1. WebApplication 시작이 되면 ServletContainer 에 의해 web.xml 로딩
2. web.xml 설정에 따라 ApplicationContext 생성
   * ServletContainer 에 의해 단 한번만 초기화 됨.
3. ApplicationContext.xml 설정에 따라 Spring Container 구동
   * 이때 개발자가 작성한 클래스 객체 생성
4. Client 에서 최초 요청 발생시 Spring DispatcherServlet 생성 됨, 요청 분배
   * Font Controller Pattern

| Servlet Container |         | Spring             | Framework      |                     |            |
|-------------------|---------|--------------------|----------------|---------------------|------------|
| Servlet Request   | FILTER  | Dispatcher Servlet | HandlerMapping | Handler Adapter     | Controller |
|                   |         | Dispatcher Servlet | ViewResolver   |                     |            |
| Servlet Response  | FILTER  | Dispatcher Servlet | View           |                     |            |

### Servlet Container
서블릿 컨테이너는 프로세스 하나에 배정 되어있고, 요청은 Thread 별로 처리되고, ThreadPool 에서 배정 관리를 함.
이렇게 개발자가 아닌 프로그램에 의해 객체가 관리되는 방법을 IoC(Inversion of Control) 라고 함.

### web.xml
모든 Java Servlet 은 web.xml 에 등록 되어야 함

### Spring Boot
스프링부트는 Tomcat(Servlet Container)을 내장하고 있고, web.xml 에 일일이 등록 처리해야 하는것을 MVC 패턴을 이용하여 처리할 수 있도록 해 줌.
1. DispatcherServlet이 스프링에 @Bean으로 등록
2. DispatcherServlet이 컨텍스트에 서블릿 등록
3. 서블릿 컨테이너 필터에 등록 설정 해놓은 필터 등록
4. DispatcherServlet에 각종 핸들러 매핑(자원 url)들이 등록
   * 컨트롤러 빈들이 다 생성되어 싱글톤으로 관리되어 진다.

#### Dispatcher Servlet
DispatcherServlet extend FrameworkServlet extend HttpServlet
1. FrameworkServlet.service()가 호출
2. FrameworkServlet.service()는 dispatch.doService()를 호출
3. dispatch.doService()는 dispatch.doDispatch()를 실행하고
4. doDispatch()는 AbstractHandlerMapping에서 Handler(Controller)를 할당
5. Interceptor 를 지나서 해당 Controller Method 이동
6. Handler(Controller)는 ModelAndView 리턴
   * @RestController 사용시 컨버터를 이용하여 바로 결과값 리턴
   * View에 대한 정보가 있으면 ViewResolver에 들려 View 객체를 얻고, View 렌더링

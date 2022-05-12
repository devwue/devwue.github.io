# Java Servlet 

Servlet API 모든 서블릿이 구현해야 하는 메소드를 정의
* init : 서블릿 초기화하기 위해 호출 하는 메소드
* service
* destroy : 더이상 사용되지 않을때 호출
* getServletConfig : 서블릿 설정 객체값을 불러올 수 있도록 하는 메소드
* getServletInfo : 서블릿과 관련된 정보를 문자열로 반환

### 구성
#### ServletConfig
서블릿 컨테이너가 서블릿을 초기화 할때 필요한 정보를 전달해 주기 위한 인터페이스
#### GenericServlet
상위 두 인터페이스를 구현하여 일반적인 서블릿 기능을 구현한 클래스
#### HttpServlet
GenericServlet 을 상속받아 HTTP 프로토콜을 사용하는 서블릿 기능을 수행하는 클래스
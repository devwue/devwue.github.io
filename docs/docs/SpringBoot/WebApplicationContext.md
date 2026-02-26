# WebApplicationContext, ApplicationContext

### ServletContext
> Servlet API에서 제공하는 context

### ApplicationContext
> Spring에서 만든 인터페이스, 어플리케이션에 대한 context

### WebApplicationContext
> ApplicationContext 를 확장한 인터페이스, 웹 어플리케이션에서 필요한 몇가지 기능을 추가한 인터페이스

```java
class ContextService {
    @Autowired
    WebApplicationContext context;
    
    public void accessBean() {
        try {
            MyBean bean = context.getBean(MyBean.class);
            bean.doSomething();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    public void accessServletContext() {
        context.getServletContext();
    }
    
    public void accessWebApplicationContext() {
        RequestContextUtils.findWebApplicationContext();
    }
}
```
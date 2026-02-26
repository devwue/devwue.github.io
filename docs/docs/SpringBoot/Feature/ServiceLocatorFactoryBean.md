# Spring - ServiceLocatorFactoryBean
서비스 개발시 동일한 기능을 하는 서비스를 여러개 만들어야 하는 경우가 있다... 
이때, 스프링에서는 ServiceLocatorFactoryBean 을 이용해 서로간의 의존성을 끊고, 프록시 객체를 만들어 준다.
* 코드 내에서 if / switch 같은 구문으로 분기 처리할 필요가 없어짐.

```java
public interface InventoryLocator {
    InventoryHandler getInventoryHandler(ChannelType channelType);
}
public interface InventoryHandler {
    List<Inventory> findAllBy(InventorySearch inventorySearch);
}
public enum ChannelType {
    GOOGLE, APPLE, ETC
}

@Configuration
public class ServiceLocatorConfig {
    @Bean
    public ServiceLocatorFactoryBean serviceLocatorFactoryBean() {
        ServiceLocatorFactoryBean serviceLocatorFactoryBean = new ServiceLocatorFactoryBean();
        serviceLocatorFactoryBean.setServiceLocatorInterface(InventoryLocator.class);
        return serviceLocatorFactoryBean;
    }
}

@RestController
public class MyController {
    private final InventoryLocator inventoryLocator;
    MyController(InventoryLocator inventoryLocator) {
        this.inventoryLocator = inventoryLocator;
    }
    
    @GetMapping("/inventory/{channel}")
    public ResponseEntity findAll(String channel) {
        final InventorySearch inventorySearch = new InventorySearch(channel);
        final InventoryHandler inventoryHandler = inventoryLocator.getInventoryHandler(inventorySearch.getChannelType());
        return ResponseEntity.ok()
                .body(inventoryHandler.findAllBy(inventorySearch));
    }
}
```

#### 단점
1. 위와 같은 경우 Bean 이름을 ChannelType Enum에 정의된 이름으로 설정 하거나 지정 해야함.
2. No Bean 오류 처리... 

#### 우회 방법
ServiceLocatorFactoryBean 을 흉내내는 방식

```java
@Component
public class InventoryLocator {
    @Autowire
    private ListableBeanFactory beanFactory;

    @Override
    public InventoryHandler getInventoryHandler(ChannelType channelType) {
        try {
            String beanName = channelType.toString().toLowerCase() + "InventoryHandler";
            return beanFactory.getBean(beanName, InventoryHandler.class);
        } catch (BeansException e) {
            throw new RuntimeException("연동하지 않은 채널..", e);
        }
    }
}
```
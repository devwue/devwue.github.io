# Spring - Request With Enum
API를 만들어서 전달을 했는데, API에 어떤 값을 던져야 할지 모른다?

```java
public enum WIP {
    ALPHA,
    BETA
}
```
```java
public class TestController {
    @GetMapping("/api/{version}")
    public String getVersion(@PathVariable("version") WIP wip) {
        return wip.name;
    }
    
    @GetMaping("/api/info") 
    public String apiInfo(@RequestParam("version") WIP wip) {
        return wip.name;
    }
}
```
### Custom Message Converter
```java
@Slf4j
public class StringToWipConverter implements Converter<String, WIP> {
    @Override
    public WIP convert(String value) {
        try {
            return WIP.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            log.error("failed convert error", e);
            return null;      
        }
    }
}
```
#### Register in Spring
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(new StringToWipConverter());
    }
}
```
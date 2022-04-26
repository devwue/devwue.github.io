# Netflix 에서 만든 Feign Client
> netflix 에서 만든 http 통신용 라이브러리
> 참조: https://cloud.spring.io/spring-cloud-netflix/multi/multi_spring-cloud-feign.html

#### Default
> default URLConnection 
* 설정을 통해 변경 가능
```yaml
feign:
  httpclient:
    enable: false
  okhttp:
    enable: true
```
````groovy
implement 'org.apache.httpcomponents:httpclient:version'
implement 'io.github.openfeign:feign-okhttp:version'
implement 'io.github.openfeign:feign-httpclient'
````

```yaml
feign:
  httpclient:
    enabled: false # disabled httpclient
  okhttp:
    enabled: true # enable okhttp
  client:
    config:
      default: # @FeignClient default, 분리해서 사용시 customName 으로 추가
        max-connections: 200 # default 200
        max-connections-per-route: 50 # default: 50
        connection-timeout: 2000 # default: 2000/ms
        time-to-live: 900 # default 900
        timeToLiveUnit: SECONDS # default TimeUnit.SECONDS
        readTimeout: 5000 # ms
        loggerLevel: full # default: info
        decode404: false
        requestInterceptors:
          - com.devwue.spring.api.requestInterceptor
        retryer: com.devwue.spring.api.requestInterceptor
        errorDecoder: com.devwue.spring.api.requestInterceptor
  compression:
    request:
      enabled: true
    response:
      enabled: true
```
## configuration 
1. 모든 요청에 헤더 붙이기

````java
public class FeignCustomConfig {
    @Bean
    public RequestInterceptor reqeustInterceptor() {
        return reqeustTemplate -> requestTemplate
                .header("Authorization", "key", "value")
                .query("trackId", UUID.randomUUID().toString());
    }
}
@FeignClient(name="myClient", url = "${my.api.url}", configuration = FeignCustomConfig.class)
public interface MyFeignClient {
    @RequestMapping(method = RequestMethod.GET, value = "/test/uri/{testId}")
    List<String> getSearchLogs(@PathVariable("testId") Integer testId);
    
    // form 전송도 가능..
    @PostMapping(value = "/form/submit", consumes = "application/x-www-form-urlencoded", produces = "application/json")
    String submitForm(@RequestBody TestParam param);
}
````
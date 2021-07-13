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
````

```yaml
feign:
  client:
    config:
      default:
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
@Bean
public RequestInterceptor reqeustInterceptor() {
    return reqeustTemplate -> requestTemplate.header("Authorization", "key", "value");
}
````
# Spring API Document - Swagger, SpringDoc
스프링 프레임워크에서 API 문서를 생성 해주는 라이브러리

### Swagger `springfox-swagger-ui`
2018년 업데이트 중지, 2020년 신버전 릴리즈 (ㅋㅋㅋ)
* [Springfox SwaggerUI](https://springfox.github.io/springfox/docs/current/#springfox-swagger-ui)

### SpringDoc `springdoc-openapi-ui`
2019년 7월 등장...
* [springdoc.org](https://springdoc.org/#properties)
```yaml
springdoc:
  version: '@springdoc.version@'
  swagger-ui:
    path: /swagger-ui.html
    tags-sorter: alpha
    operations-sorter: alpha
    display-request-duration: true
    group-order: DESC
    disable-swagger-default-url: true
  show-actuator: true
  group-configs:
    - group: store
    paths-to-match: /store/**
    - group: users
      packages-to-scan: org.company.demo.app
  api-docs:
    groups:
      enabled: true
  default-consumes-media-type: application/json
  default-produces-media-type: application/json
```

# HttpClient

1. URLConnection
   > java jdk 1.2부터 내장
  * 특징
    * 응답이 4xx, 5xx일때 IOException 발생
    * 타임아웃 제어 불가
    * 쿠키 제어 불가
    
2. Apache HttpClient
   > 모든 응답코드를 읽을수 있음    
  * 특징
    * 타임아웃 설정 가능
    * 쿠키 제어 가능
    * 스트림 처리 로직 별도 작성 필요
    * 응답 컨텐츠타입에 따라 별도 코드 작성 필요
    
3. RestTemplate
   > org.springframework.http.client
  * 특징
    * 위에 좋은 특징 가능
    * 위에 단점 없음
    * 연결 pool 사용 가능 ( default: false )
      1. setMaxConnPerRoute: IP, Port 1쌍에 대해 연결수 제한
      2. setMaxConnTotal: 최대 오픈 연결수 제

4. Retrofit (OKHttp)    
3. FeignClient
   > `@FeignClient`(name="-", url="-"...)
   > org.springframework.cloud:spring-cloud-starter-openfeign
  * 특징
    * RestTemplate에 비해 코드가 간소  
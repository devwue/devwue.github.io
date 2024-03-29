# REST API
> Representational State Transfer Application Programming Interface
> 자원을 이름으로 구분하여 자원의 상태를 주고 받는 모든것

* 아래 RESTfull 을 만족하는 API 구현체
  * 일반적으로 Json을 사용하여 메시지를 경량화 함
  1. 자원: HTTP URI
  2. 자원에 대한 행위: HTTP Method
  3. 자원에 대한 행위의 내용: HTTP Message Payload

### REST (RESTfull)
* REST는 프로토콜이나 표준이 아닌 아키텍쳐 원칙 세트
1. 클라이언트, 서버 및 리소스로 구성되며 요청이 HTTP를 통해 관리되는 클라이언트 - 서버 아키텍처
2. stateless 클라이언트-서버 커뮤니케이션
   * 요청간 클라이언트 정보가 저장되지 않고, 각 요청이 분리
3. 클라이언트-서버 상호 작용을 간소화 하는 캐시 기능 데이터
4. 정보가 표준 형식으로 전송되도록 하기 위한 구성 요소간 통합 인터페이스
   * 요청된 리소스가 식별가능하면 클라이언트에 전송된 표현과 분리 되어야 함
   * 수신한 표혀을 통해 클라이언트가 리소스를 조작할 수 있어야 함
   * 클라이언트에 반환되는 자기 기술적 메시지에 클라이언트가 정보를 어떻게 처리해야 할지 설명하는 정보가 충분히 포함되어야 함
   * 하이퍼 미디어: 클라이언트가 리소스에 엑세스한 후 하이퍼 링크를 사용해 현재 수행 가능한 기타 모든 작업을 찾을수 있어야 함.
5. 요청된 정보를 검색하는데 관련된 서버(보안, 로드 밸런싱등)의 각 유형을 클라이언트가 볼수 없는 계층 구조로 계층화된 시스템


### REST, Request HTTP Method
* 조회: GET
  * 200 ok, 204 no content
* 등록: POST
  * 201 created
* 수정: PUT
  * 200 ok, 204 no content
  * 만약 없었다면 201 created
  * PATCH: 리소스의 일부만 수정이 필요할때
* 삭제: DELETE
  * 200 ok

### REST, Response HTTP Method
* 400: 잘못된 요청, 요청이 잘못되었거나 형식이 잘못되어 요청을 처리할 수 없음
* 401: 권한 없음, 필수 인증 정보 누락
* 403: 사용할 수 없음, 리소스에 대한 엑세스 거부 (충분한 권한이 없음)
* 404: 리소스 없음
* 405: 메소드가 허용하지 않음
* 406: 허용되지 않음, Accept 헤더에 요청된 형식을 지원하지 않음
* 409: 충돌
* 410: 리소스가 있었으나, 현재는 없음
* 411: 요청에 Content-Length 헤더가 필요함
* 412: 사전 조건 실패
* 413: 요청 크기가 최대 한도를 초과함
* 415: 지원하지 않는 미디어 유형
* 416: 요청범위가 충분하지 않음
* 422: 요청을 처리할 수 없음
* 423: 잠김
* 429: 너무 많은 요청
* 500: 내부 서버 오류
* 501: 구현되지 않음
* 503: 서비스를 사용할 수 없음, Retry-After 헤더 지정할 수 있음
* 504: Gateway Timeout
* 507: 스토리지 부족
* 509: 대역폭 한도 초과
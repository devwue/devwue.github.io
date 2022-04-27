# Spring - HttpMessageConverter 

* HTTP API처럼 Json 데이터를 Http body를 직접 읽거나 쓰는 경우 사용
* @ResponseBody 어노테이션 사용시 HttpMessageConverter
* String 문자 처리시 StringHttpMessageConveter
* Json Object 처리시 MappingJackson2HttpMessageConverter 
* application/x-www-form-urlencoded 일때 FormHttpMessageConverter
* Xml 처리시
  * SourceHttpMessageConverter
  * Jaxb2RootElementHttpMessageConverter
* 이외에도 많음...

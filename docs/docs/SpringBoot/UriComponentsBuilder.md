# Spring - UriComponentsBuilder
UriComponents 를 Build할 수 있도록 도와주는 클래스

### Basic Usage
```java
UriComponents uriComponent = UriComponentsBuilder.newInstance()
        .scheme("https")
        .host("test.devwue.com")
        .path("/test")
        .build();
```
### URI encoding
```java
UriComponents uriComponent = UriComponentsBuilder.newInstance()
        .scheme("https")
        .host("test.devwue.com")
        .path("/test")
        .build().encode();
```
### URI Path variable
```java
UriComponents uriComponent = UriComponentsBuilder.newInstance()
        .scheme("https")
        .host("test.devwue.com")
        .path("/test/{keyword}/{pathValue}")
        .buildAndExpand("mykeword", "search");
```
### URI Query parameter
```java
UriComponents uriComponent = UriComponentsBuilder.newInstance()
        .scheme("https")
        .host("test.devwue.com")
        .path("/test/{path}")
        .query("q={value1}")
        .query("q={value2}")
        .buildAndExpand("testPath", "value1", "value2");
```
### URI from String
```java
// #1
UriComponents uriComponent = UriComponentsBuilder.newInstance()
        .fromUriString("https://test.devwue.com/test/{path}")
        .queryParam("q", "{value}")
        .encode()
        .buildAndExpand("testPath", "value");
// #2
UriComponents uriComponent = UriComponentsBuilder
        .fromHttpUrl("https://test/devwue.com/test{path}?q={value}")
        .build(
            ImmutableMap.<String, String>builder()
                .put("path", "testPath")
                .put("q", "value")
                .build()
        );
```

# Gradle - Kafka Schema-Registry plugins

Schema Registry 사용시 도움을 주는 역할을 함
1. Avro 스키마 다운로드
2. 다운로드된 Avro 스키마를 기반으로 Java Class 생성
3. 생성된 Java Class를 Kafka Consume Record의 모델로 사용할 수 있도록 해줌

### 뭐야? Avro 
##### IDL (Interface Description Language)
IDL은 소프트웨어 컴포넌트간 통신시 사용되는 인터페이스를 정의한 언어
* Java <-> Java 뿐 아니라 다른 언어간 Java <-> Python 에도 언어 중립적인 방법으로 통신하는 개념
##### Avro
* Apache Hadoop 프로젝트에서 개발된 RPC / Serialize Framework
* Binary encoding / Json encoding 모두 지원
* JSON 으로 작성하는 스키마 파일
* 다양안 언어에서 API 제공 
  * C/C++, C#, Go, Haskel, Java, Perl, Python, PHP, Ruby, Pascal, Scala, etc...
* Hadoop, Spark, BigQuery, Vertica, Logstash 등 소프트웨어에서 통신시 권장하는 방식으로 사용되고, plugin 지원
##### Avro Schema (avsc)
Avro 에서 IDL로 사용되는 Schema 파일, Json 포맷으로 정의됨.
```javascript
{
    "namespace": "example.avro",
        "type": "record",
        "name": "User",
        "fields": [
        {"name": "name", "type": "string"},
        {"name": "age", "type": ["int", "null"]},
        {"name": "favorite_color", "type": ["string", "null"]}
    ]
}
```
-----
## Schema-registry-plugin
[Schema Registry Maven Plugins](https://docs.confluent.io/platform/current/schema-registry/develop/maven-plugin.html)

### com.github.imflog.kafka-schema-registry-gradle-plugin
[GitHub ImFlog](https://github.com/ImFlog/schema-registry-plugin)
##### Tasks
* downloadSchemasTask
* testSchemasTask
* registerSchemasTask
* configSubjectsTask
##### Global Configuration
* schemaRegistry 
```groovy
schemaRegistry {
    url = 'https://schema-registry-url/'
    quiet = true
}
```
##### 참조
* [ImFlog/build.gradle](https://github.com/ImFlog/schema-registry-plugin/blob/master/examples/avro/build.gradle)

### com.commercehub.gradle.plugin.avro
[CommerceHub](https://plugins.gradle.org/plugin/com.commercehub.gradle.plugin.avro)
##### Configuration
설정은 아래 저장소 참조
[GitHub](https://github.com/davidmc24/gradle-avro-plugin)
##### Tasks
* generateAvroJava
##### Global Configuration
```groovy
avro {
    createSetters = false
    fieldVisibility = "PRIVATE"
}
defendencies {
    implementation "org.apache.avro:avro"
}
```

##### 참조
* [medium, @gaemi/kafka-confluent-schema-registry](https://medium.com/@gaemi/kafka-%EC%99%80-confluent-schema-registry-%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%9C-%EC%8A%A4%ED%82%A4%EB%A7%88-%EA%B4%80%EB%A6%AC-2-bfa96622a974)
  * [Github Source](https://github.com/gaemi/confluent-kafka-samples)



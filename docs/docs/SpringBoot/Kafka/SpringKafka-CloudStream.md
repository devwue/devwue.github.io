# Spring Kafka - Spring Cloud Stream

### Spring Kafka
대충 개념만 보시길... 
#### 구성
spring kafka + schema registry + gradle plugin
* Schema Registry - avro 스키마 관리
* Gradle Plugin - avro 스키마 다운로드 

#### dependency
`org.springframework.kafka:spring-kafka`
#### Yml Properties
```yaml
spring:
  kafka:
    consumer:
      bootstrap-servers: localhost:9092
      group-id: group_id
      auto-offset-reset: earliest
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.apache.kafka.common.serialization.StringDeserializer
    producer:
      bootstrap-servers: localhost:9092
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.apache.kafka.common.serialization.StringSerializer
```
#### 설정
```groovy
// settings.gradle
pluginManagement {
    repositories {
        gradlePluginPortal()
        jcenter()
        maven {
            name "JCenter Gradle Plugins"
            url 'https://dl.bintray.com/gradle/gradle-plugins'
        }
    }
}
// build.gradle
repositories {
    confluent {
        url 'https://packages.confluent.io/maven/'
    }
}
plugins {
    id "com.commercehub.gradle.plugin.avro" version "0.22.0"
    //id "com.github.imflog:kafka-schema-registry-gradle-plugin" version "1.0.1"
}
dependencies {
    implementation 'io.confluent:kafka-schema-registry-client:5.3.0'
    implementation 'io.confluent:kafka-streams-avro-serde:5.3.0'
    implementation 'io.confluent:kafka-avro-serializer:5.2.1'
    implementation 'org.apache.avro:avro:1.8.2'
}

def avroResourceDir = "${rootDir}/src/main/avro"
task makeAvroDir() {
  if (!new File(avroResourceDir).exists()) {
    mkdir avroResourceDir
  }
}
task downloadAvro() {
  src "https://schema-registry-domain/target.avsc";
  dest avroResourceDir
  dependsOn makeAvroDir
}
task buildWithAvro() {
  downloadAvro.mustRunAfter clean
  build.mustRunAfter downloadAvro
  dependsOn clean, downloadAvro, build
}
```
### Spring Cloud Stream
Binder 와 Binding 을 통해 미들웨어(Apache Kafka, RabbitMQ, ...)와 통신을 시켜주는 프레임워크
* 미들웨어는 언제든지 교체될 수 있다. (과연...)
#### Binder
* 미들웨어와의 통신 컴포넌트
* 미들웨어 구현체 제공
* 미들웨어와 연결, 위임 및 라우팅 처리
#### Binding
* 입/출력을 연결하기 위한 브릿지 
* @EnableBinding
* 바인딩 인터페이스 제공 
  * Sink : input (inbound)
  * Source : output (outbound) 
  * Processor : input, output
  * 사용자가 바인더 정의도 가능
#### dependency
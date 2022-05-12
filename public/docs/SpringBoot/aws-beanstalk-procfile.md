# AWS Elastic Beanstalk 환경에서 Java Charset 설정

AWS Elastic Beanstalk은 어플리케이션을 수동으로 실행하지 않음
```shell
java -Dfile.encoding=UTF-8 -jar application.jar
```

### Charset 설정
jar 배포시 Procfile 을 아래와 같이 작성해 어플리케이션 실행 명령 입력
```shell
# Procfile
web: java -Dfile.encoding=UTF-8 -jar application.jar
```

#### Gradle 빌드 시스템이라면?
```groovy
task zip(type: Zip, dependsOn: bootJar) {
    from('.procfile') { // Procfile 이 위치한 디렉토리
        into '.'
    }
    from(jar.outputs.files) { // jar 디렉토리
        rename { String fileName -> "my-application.jar" }
    }

    archiveName 'my-application.zip'
    destinationDir project.buildDir
}

```
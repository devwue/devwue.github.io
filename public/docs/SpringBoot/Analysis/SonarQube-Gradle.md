# SonarQube 코드 정적 분석
### 프로젝트 구조
```shell
.
├── module-a
│   └── src
│       ├── main
│       ├── integrationTest
│       └── test
└── module-b
    └── src
        ├── main
        ├── integrationTest
        └── test
```
### Gradle 코드 설정
> ./gradlew check sonarqube
```groovy
plugins {
    id 'java'
    id 'org.sonarqube' version '2.8'
}

dependencies {
    integrationTestImplementation("org.springframework.batch:spring-batch-test")
}

subprojects {
    apply plugin: 'jacoco'

    sourceSets {
        integrationTest {
            java.srcDir "$projectDir/src/integrationTest/java"
            resources.srcDir "$projectDir/src/integrationTest/resources"
            compileClasspath += main.output + test.output
            runtimeClasspath += main.output + test.output
        }
    }
    
    configurations {
        integrationTestImplementation.extendsFrom implementation
        integrationTestImplementation.extendsFrom testImplementation
        integrationTestRuntimeOnly.extendsFrom testRuntimeOnly
    }

    test {
        useJUnitPlatform()
        jacoco {
            enabled = true
            destinationFile = file("${buildDir}/jacoco/jacoco.exec")
        }
    }
    
    task integrationTest(type: Test) {
        description = 'integration tests...'
        group = 'verification'
        
        testClassesDirs = sourceSets.integrationTest.output.classesDirs
        classpath = sourceSets.integrationTest.runtimeClasspath
        
        jacoco {
            enabled = true
            destinationFile = file("${buildDir}/jacoco/jacoco-integration.exec")
        }
    }
    
    jacocoTestReport {
        executionData(fileTree(buildDir).include("/jacoco/*.exec"))
        reports {
            xml.enabled true
            xml.destination = file("${buildDir}/jacoco/jacoco.xml")
        }
        dependsOn(test, integrationTest)
    }
    check.dependsOn integrationTest
}

sonarqube {
    properties {
        property 'sonar.projectKey', project.group + ':' + project.name
        property 'sonar.coverage.jacoco.xmlReportPaths', "${project.projectDir}/**/build/jacoco/jacoco.xml"
    }
}
```

### Local 환경에 SonarQube 테스트
```yaml
version: '3.8'
services:
  sonar:
    image: sonarqube:community
    restart: always
    depends_on:
      - postgres
    volumes:
      - sonarqube_data:/opt/sonarqube/data
      - sonarqube_logs:/opt/sonarqube/logs
    environment:
      SONAR_SEARCH_JAVAADDITIONALOPTS: "-Dbootstrap.system_call_filter=false"
      SONAR_ES_BOOTSTRAP_CHECKS_DISABLE: true
      SONAR_CE_JAVAOPTS: "-Xmx2G -Xms2G"
      SONAR_WEB_JAVAOPTS: "-Xmx512m"
      SONAR_SEARCH_OPTS: "-Xmx1G"
    #  SONAR_SCANNER_OPTS: "-Xmx1G"
      SONARQUBE_JDBC_USERNAME: sonar
      SONARQUBE_JDBC_PASSWORD: sonar
      SONARQUBE_JDBC_URL: jdbc:postgresql://postgres:5432/sonar
    ulimits:
      nproc: 262144
      nofile:
        soft: 262144
        hard: 262144
    ports:
      - 9000:9000
  postgres:
    image: postgres:12
    environment:
      POSTGRES_USER: sonar
      POSTGRES_PASSWORD: sonar
    volumes:
      - postgresql:/var/lib/postgresql
      - postgresql_data:/var/lib/postgresql/data

volumes:
  sonarqube_data:
  sonarqube_extensions:
  sonarqube_logs:
  postgresql:
  postgresql_data:
```
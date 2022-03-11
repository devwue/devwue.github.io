# Junit 테스트, Mock, 단위 테스트
* JUnit Vintage
   > JUnit4 기반 TestEngine 제공
* JUnit5
  * Junit Platform
    > Jupiter 코드 실행 결과 보고, IDE 연동 보조
  * Junit Jupiter
    > jupiter-api를 사용해 작성한 테스트 코드 실행
  * Junit Vintage
    > Junit4 버전으로 작성한 테스트 코드 실행

### Annotation - 단위 with Mocking
  * @RunWith
    * SpringRunner, JUnit4
      > Alias SpringJunit4ClassRunner <br>
      > JUnit4에서는 하나의 Runner만 이용 가능 <br>
      > `@RunWith(SpringRunner.class)` @AutoWired, @MockBean, @SpyBean, H2...
      ```groovy
      testImplementation("junit:junit:3.12");
      testRuntimeOnly("org.junit.vintage:junit-vintage-engine")
          혹은... 
      testImplementation('org.springframework.boot:spring-boot-starter-test') {
        exclude group: 'org.junit.vintage', module: 'junit-vintage-engine'
      }
      ``` 
    * MockitoJUnitRunner, JUnit4
      > JUnit4에서 Mockito를 활용해 mock, spy 생성할수 있도록 지원 <br>
      > Mockito 이용해 mock 객체 주입 테스트시 사용 @Mock, @InjectMocks, @Spy 
      > `@RunWith(MockitoJUnitRunner.class)`
      ```groovy
      testImplementation 'org.mockito:mockito-core:2.7.22'
      ``` 
  * @ExtendWith
    * MockitoExtension, JUnit5
      > 테스트 클래스가 Mockito를 사용함을 알림 @Mock, @InjectMocks <br>
      > `@ExtendWith(MockitoExtension.class)`
      ```groovy
      testImplementation('org.junit.jupiter:junit-jupiter-api:5.2.0')
      testRuntimeOnly('org.junit.jupiter:junit-jupiter-engine:5.2.0')
      ```
  * @TestInstance, JUnit5
    * 테스트 인스턴스의 라이프 사이클 설정
      > `@TestInstance(TestInstance.Lifecycle.PER_METHOD)`
    
    
      
### Annotation - 통합 테스트
* @SpringBootTest
  * 기능 검증이 아닌 실제 데이터 플로우 동작 검증시 사용 
* @ActiveProfiles
  > 테스트 코드 사용시 profile 설정
* @Transactional
  * 테스트 완료후 rollback 처리
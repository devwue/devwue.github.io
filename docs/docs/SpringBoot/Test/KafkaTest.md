# Kafka Test 
### EmbeddedKafka
* 실제 Kafka Broker를 실행하지 않고 in-memory에만 data를 저장
* 참조
  * https://github.com/embeddedkafka/embedded-kafka
  * https://medium.com/@njns08/test-spring-boot-applications-using-embeddedkafka-and-awaitility-875aaecde5d0
 
```yaml
spring.kafka.listener.missing-topics-fatal: false
spring.kafka.bootStrapServers: ${spring.embedded.kafka.brokers}
```
```java
@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@EmbeddedKafka(partitions = 1, brokerProperties = {"listeners = PLAINTEXT://localhost:9092", "port=9092"})
class KafkaTest {
    @Autowired
    UserService userService;

    @Autowired
    EmbeddedKafkaBroker embeddedKafkaBroker;
    BlockingQueue<ConsumerRecord<String, String>> records;
    KafkaMessageListenerContainer<String, String> container;

    @Before
    public void setUp() {
      Map<String, Object> configs = new HashMap<>(KafkaTestUtils.consumerProps("test-listener-group", "false", embeddedKafkaBroker));
      DefaultKafkaConsumerFactory<String, String> consumerFactory = new DefaultKafkaConsumerFactory<>(configs, new StringDeserializer(), new StringDeserializer());
      ContainerProperties containerProperties = new ContainerProperties("test-event");
      containerProperties.setMissingTopicsFatal(false);

      this.records = new LinkedBlockingQueue<>();
      this.container = new KafkaMessageListenerContainer<>(consumerFactory, containerProperties);
      this.container.setupMessageListener((MessageListener<String, String>) this::publishEvent); // or direct records::add
      this.container.start();
      // if need delay..
      ContainerTestUtils.waitForAssignment(container, embeddedKafkaBroker.getPartitionsPerTopic());
    }

    @After
    public void tearDown() {
      container.stop();
    }

    @Test
    public void testProduceAtLogin() {
      // when
      userService.login("test", 1004);
      // then
      ConsumerRecord<String, String> message = records.poll(100, TimeUnit.MILLISECONDS);
      Assert.assertNotNull(message);
      Assert.assertEquals("{\"userEventType\":\"SIGN_IN\",\"userId\":1004}", message.value());
    }

    @Test
    public void testProduceByDirect() {
        // when
        Map<String, Object> configs = HashMap<>(KafkaTestUtils.producerProps(embeddedKafkaBroker));
        Producer<String, String> producer = new DefaultKafkaProducerFactory<>(configs, new StringSerializer(), new StringSerializer()).createProducer();
        producer.send(new ProducerRecord<>("test-event", userId, "{\"userEventType\":\"SIGN_IN\",\"userId\":1004}"));
        producer.flush();

        // then
        ConsumerRecord<String, String> message = records.poll(100, TimeUnit.MILLISECONDS);
        Assert.assertThat(singleRecord).isNotNull();
        Assert.assertEquals("{\"userEventType\":\"SIGN_IN\",\"userId\":1004}", message.value());
    }

    private void publishEvent(ConsumerRecord<String, String> record) {
      records.add(record);
    }
}
```

### MockProducer, MockConsumer
* 별도의 서버를 운영할 필요가 없다보니 test 속도가 빠르다
* 참조
  * https://www.baeldung.com/kafka-mockproducer
  * https://www.baeldung.com/kafka-mockconsumer

 
### Kafka 소스코드의 test에서 제공
* 참조
  * https://gist.github.com/asmaier/6465468
  * https://gist.github.com/qudongfang/9fac0750e5715cb8c46b

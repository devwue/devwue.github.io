# Spring With Kafka


### Kafka Unit Test
#### 1. with Mock
```java
public class kafkaTest {
    @InjectMocks
    SendService service;
    
    @Mock
    Kafkatemplete kafkatemplete;
    
    @Test
    public void produceOnSuccess() {
        String testTopic = "testTopic";
        
        SendResult<String, TestMessageEvent> result = mock(SendResult.class);
        TopicPartition topicPartition = new TopicPartition(testTopic, 1);
        RecordMetadata recordMetadata = new RecordMetadata(topicPartition, 0L, 0L, 0L, 0L, 0, 0);
        ListenableFuture<SendResult<String, TestMessageEvent>> future = mock(ListenableFuture.class);

        given(result.getRecordMetadata()).willReturn(recordMetadata);
        given(kafkatemplete.send(anyString(), any())).willReturn(future);
        doAnswer(invocation -> {
            ListenableFutureCallback listenableFutureCallback = invocation.getArgument(0);
            listenableFutureCallback.onSuccess(result);
            return null;
        }).when(future).addCallback(any(ListenableFutureCallback.class));
        // when
        service.publishExtMemberEvent(mock(TestMessageEvent.class));
        // then
        verify(kafkaTemplate, times(1)).send(anyString(), any(TestMessageEvent.class));
    }
    
    @Test
    public void produceOnFail() {
        ListenableFuture<SendResult<String, TestMessageEvent>> future = mock(ListenableFuture.class);
        Throwable throwable = mock(Throwable.class);

        given(throwable.getMessage()).willReturn("kafka failed");
        given(kafkaTemplate.send(anyString(), any(TestMessageEvent.class))).willReturn(future);
        doAnswer(invocation -> {
            ListenableFutureCallback listenableFutureCallback = invocation.getArgument(0);
            listenableFutureCallback.onFailure(throwable);
            return null;
        }).when(future).addCallback(any(ListenableFutureCallback.class));
        // when
        service.publishExtMemberEvent(mock(TestMessageEvent.class));
        // then
        verify(kafkaTemplate, times(1)).send(anyString(), any(TestMessageEvent.class));
    }
}
```
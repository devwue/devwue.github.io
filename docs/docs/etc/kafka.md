# Apache Kafka
> 여러대의 분산 서버에서 대량의 데이터를 처리하는 분산 메시징 시스템
>
> 높은 처리량과 실시간 데량의 데이터 취급
> 임의의 타이망에서 데이터 읽음
> 메시지 잃지 않음
### 구성
* Producer: 메시지 생산자비 - 토픽 발행
* Broker : 메시지 수집 / 전달 - 토픽을 적절한 파티션에 분
* Consumer: 메시지 소배비 

### 카프카 명령 
* 카프카 토픽 지우기
  * 방법1
  ```bash
  kafka-topics.sh --zookeeper <zkhost>:2181 --alter --topic <topic name> --config retention.ms=1000
  ```
  * 방법2
  ```bash
  kafka-topics.sh --zookeeper <zkhost>:2181 --delete --topic <topic name>
  ```
  
* 토픽 생성
  ```bash
  kafka-topics.sh --create \
  --bootstrap-server <host name>:9092 \
  --replication-factor <복제 수> --partitions <파티션 개수> --topic <topic name>
  ```

* 토픽 리스트
  ````bash
  kafka-topics.sh --zookeeper <zhost>:2181 --list | grep <topic_name>
  ````
  
* 토픽 offset 돌리기
  ```bash
  kafka-consumer-groups --bootstrap-server {url} \
  --topic {topic} \
  --group {consumer-group} \
  --reset-offsets --to-datetime 2020-11-11T00:00:00.000+0900 \
  --execute
   ```

### 토픽 오프셋 
> 참조: https://gunju-ko.github.io/kafka/2018/04/02/Kafka-Offsets.html
> 
> 원하는 offset부터 다시 읽을수 있도록 할수 있다.
> enable.autocommit = false 
* ConsumerRecord offset 저장 
  > 재 시작시 seek(TopicPartition, long) 사용
  > 수동 처리
  > seekToBegining(Collection)
  > seekToEnd(Collection)
  
* Partition 할동이 재 할당된 경우
  > ConsumerRebalanceListener 사
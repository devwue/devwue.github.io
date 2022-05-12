# ThreadPool

## Java ThreadPoolExecutor
> Java 1.5 이후, ExecutorService 제공
#### newScheduledThreadPool
* 1분에 한번 수행 시키기 위한 쓰레드 풀
#### newFixedThreadPool
* 고정적으로 몇개를 사용할지 정하는 방식
#### newCachedThreadPool
* 유기적으로 쓰레드의 숫자가 증가, 감소하는 쓰레드 풀
#### ForkJoin 의 분할정복 알고리즘
* Java 7에서 추가됨, 큰 작업을 작은 단위로 나누워서 배분 작업후 취합
  * 내부 적으로 inbound queue 처리
* 인터페이스
  * RecursiveAction - void
  * RecursiveTask

## SpringBoot ThreadPoolTaskExecutor
* ThreadPoolExecutor + @추가적인 기능제공
* 내부적으로 ThreadPoolTaskExecutor 생성해 사용
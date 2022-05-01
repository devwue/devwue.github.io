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
* 설명이 ...

## SpringBoot ThreadPoolTaskExecutor
* ThreadPoolExecutor + @추가적인 기능제공
* 내부적으로 ThreadPoolTaskExecutor 생성해 사용
# CompletableFuture - 비동기

### Future
* Java 5부터 미래 시점에 결과를 얻을수 있는 Future 인터페이스 제공
* 비동기 연산들을 합치거나, 에러 핸들링을 할 수 없는 단점..
```java
ExecutorService executor = ...;
Future future = executor.submit(code);
f.get(); // blocked until complete
```
#### with ListenableFuture
```java
ListenableFuture listenable = executor.submit(new Callable<String>() {
    @Override
    public String call() throw Exception {
        // do stuff       
    }
});
Futures.addCallback(listenable, new FutureCallback<Object>() {
    @Override
    public void onSuccess(Object o) {
        // do success
    }
    @Override
    public void onFailure(Throwable throwable) {
        // do fail...    
    }
})
```

### CompletableFuture
* Java 8부터
  * Future, CompletionStage 상속
```java
import java.util.concurrent.CompletableFuture;

public class ProductService {
    public Future<Double> getPrice(String product) {
        CompletableFuture<Double> future = new CompletableFuture<>();
        new Thread(() -> {
            double price = remotePrice(product);
            future.complete(price);
        }).start();
        return future;
    }
    
    public Future<Double> getPriceOther(String product) {
        return CompletableFuture.supplyAsync(() -> remotePrice(product));
    }
}
```
#### supplyAsync
* supplier를 인수로 받아 CompletableFuture 반환
* 두번째 인수로 쓰레드풀 지정 가능
#### runAsync
* supplyAsync와 같지만 비동기 처리되고, 반환값이 없음
#### exceptionally
* 처리중 에러 핸들링
#### thenApply
* CompletableFuture를 반환하기 때문에 또다른 콜백 함수 연결할 수 있음
#### thenAccept
* void를 반환, 더이상 콜백 연결 불가
#### thenCompose
* 여러개의 CompletionStage를 연결해 계산 가능
```java
CompletableFuture.supplyAsync(() -> {
    // something
}).thenCompose(CompletableFuture.supplyAsync(() -> {
    // do something
}));
```
#### thenCombine
* 여러개의 비동기 결과에 의존적인 콜백 처리
```java
CompletableFuture<Double> price = CompletableFuture.supplyAsync(() -> remotePrice(product));
CompletableFuture.supplyAsync(() -> {
    return remoteProductInfo(product);
}).thenCombine(price, (productInfo) -> {
    // do something
    MyProduct myProduct = new MyProduct();
    myProduct.price = price;
    myProduct.info = productInfo;
    return myProduct;
});
```
#### allOf
* 여러개를 병렬로 실행, 단 void 값을 가져서 연산 결과를 반환하지 않음
  * 결과 반환을 원한다면, thenApply() 과, join()을 추가로 작업해야 함.
```java
CompletableFuture.allOf(future1, future2, future3)
        //  future1-3 모두 string 반환시
        .thenApply(void -> {
            Stream.of(future1, future2, future3)
            .map(CompletableFutureFuture::join)
            .collect(Collectors.joinning(" "))
        }).join();
```
#### get - Blocking
* Future 결과를 받아옮
  * Future 가 complete 되지 않으면 checked exception 발생, try-catch 처리 필요.
#### join - Blocking
* Future 결과를 받아옮
  * Future 가 complete 되지 않으면 unchecked exception 발생, try-catch 필요 없음
#### handle
* throw / catch 가 아닌 handle 메소드를 이용해 에러 핸들링 
* 첫번째 인자 정상 결과값, 두번째 인자 exception
```java
CompletableFuture.supplyAsync(() -> "hello world")
        .handle((result, ex) -> result != null ? result : ex.getMessage())
        .join();
```
#### anyOf
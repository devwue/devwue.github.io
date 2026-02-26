# ListenableFuture - 비동기
> Spring 4.0 에서 추가된 인터페이스

```java
ExecutorService executor = Executors.newSingleThreadExecutor();
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

### addListener
```java
listenableFuture.addListener(new Runnable() {
    @Override
    public void run() {
        try {
            System.out.pringln(listenableFuture.get());
        } catch(Exception e) {
            e.printStackTrace();
        }
    }
}, executor);
```
#### ListenableFuture -> CompletableFuture 변환
```java
public static <T> convertCompletableFuture(ListenableFuture<T> future) {
    CompletableFuture<T> cf = new CompletableFuture<>();
    future.addCallback(cf::complete, cf::completeExceptionally);
    return cf;
}
```
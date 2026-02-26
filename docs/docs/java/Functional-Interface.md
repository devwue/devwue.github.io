# Java8 -  functional interface

### Function
파라미터 1개를 받아 1개의 결과를 반환
```java
Function<Integer, Integer> func = i -> i * i;
System.out.println(func.apply(10));
```
#### BiFunction
파라미터 2개를 받고 1개으 1개 결과 반환
```java
BiFunction<Integer, Integer, Integer> func = (x,y) -> x * y;
System.out.println(func.apply(10, 20));
```

### Supplier
파라미터를 받지 않고 Type T객체를 반환
```java
Supplier<String> supplier = () -> "any Type";
System.out.println(supplier.get());
```

### Consumer
단일 Type T 파라미터를 받아 리턴값이 없음.
```java
Consumer<String> consumer = s -> System.out.println(s.toUpperCase());
consumer.accept("any type");
```
#### BiConsumer
2개 인자를 받고 리턴값이 없음
```java
BiConsumeer<Integer, Integer> multiply = (x, y) -> System.out.println(x * y);
multiply.accept(10, 10);
```
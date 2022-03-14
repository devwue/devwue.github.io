# Java - Queue / Stack
> Queue : First In First Out <br>
> Stack : Last In First Out


### Queue
> LinkedList를 사용해 생성
```java
import java.util.LinkedList;
import java.util.Queue;

Queue<Integer> q = new LinkedList<>();
Queue<Map> q = new LinkedList<>();

q.add(1);
q.add(2);
q.poll();
q.remove();
q.clear();

// loop
while(!q.peak() != null) {
    Integer data = q.poll();
}
```

### Stack
```java
import java.util.Stack;

Stack<Integer> stack = new Stack<>();
stack.push(1);
stack.push(2);
stack.pop();
stack.clear();

// loop
while(!stack.empty()) {
    Integer data = stack.pop();
}
```
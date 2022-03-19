# 배열 순회...
> M = 2
* 해석 : 오른쪽으로 2칸 이동

| Given           | Then            |
|-----------------|-----------------|
| [3 4 5 2 3 1 4] | [1 4 3 4 5 2 3] |

### Simple
> M이 음수인 경우에도 동작 
```javascript
function solution(give, m) {
    var result = [];
    let len = give.length;
    let start = (len - m) % len
    for (i=0; i<len; i++) {
        result.push(give[(start+i) % len])
    }
    return result;
}
```

### 색다른 해석 가독성과 효율 O(1) 
* stack overflow 에서 본건데, 값을 업데이트 하지 않고 인덱스만 기억
> https://stackoverflow.com/questions/876293/fastest-algorithm-for-circle-shift-n-sized-array-for-m-position
```javascript
function solution(give, m) {
    let index = 0;
    let size = give.length;
    
    function next() {
        index = (index + 1) % size;
        return give[index];
    }
    
    function shift(m) {
        index = (index+m) % size;
    }
    
    shift(m);
    for (i=0; i<size; i++) {
        console.log(next());
    }
}

```
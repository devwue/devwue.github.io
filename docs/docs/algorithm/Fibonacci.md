# 알고리즘, 피보나치 수열
> 1로 시작하여 앞의 두 항의 합이 뒤의 항으로 되어 있는 수열

### 
```javascript
function fibonacci(n) {
    if (n == 0) return 0;
    else if(n ==1) return 1;
    else return fibonacci(n-1) + fino(n-2);
}
```
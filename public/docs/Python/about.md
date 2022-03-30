# 파이썬 특징
* 스크립트 언어, 동적 타입 언어, 플랫폼 독립적
* 사용이 쉽고, 개발 속도가 빠르고, 확장 및 이식성이 좋다
* 컴파일 언어에 비해 느리다
  * byte로 전환되고 virtual machine에서 돌아감
  * GIL (Gobal Intepreter Lock)
    * 하나의 쓰레드에 모든 자원을 허락하고, 나머지 쓰레드에 락을 걸어 버림
* 다른 언어와 결합도가 높다

### 2.x vs 3.x
* 2.x
  * 기본 ASCII 방식으로 저장, 유니코드는 u'this is string'
  * 정수형 연산시 실수형 결과가 나오지 않음
  * print "string"
* 3.x
  * default Unicode 저장
  * 정수형 연산해도 실수형 결과
  * print("string")


### Sample Code
```python
def plus(a, b):
    return a + b
    
print(plus(1,2)); // 3    
```
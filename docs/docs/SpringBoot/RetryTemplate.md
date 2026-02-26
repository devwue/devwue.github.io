# Spring RetryTemplate
상황에 맞게 재시도가 필요할 때 적용할 수 있다.

### RetryPolicy
* SimpleRetryPolicy
* AlwaysRetryPolicy
* NeverRetryPolicy
* CircuitBreakerRetryPolicy
* ExceptionClassifierRetryPolicy
* TimeoutRetryPolicy
* ExpressionRetryPolicy
* CompositeRetryPolicy

### BackOffPolicy
* NoBackOffPolicy
* FixedBackOffPolicy
* ExponentialBackOffPolicy
* ExponentialRandomBackOffPolicy
* UniformRandomBackOffPolicy
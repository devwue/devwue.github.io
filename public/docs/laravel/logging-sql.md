# SQL logging

1. 리스너 구현 
```injectablephp
class MyQueryListener {
    public function handle($query) {
        $message = [
           'sql' => $query->sql,
           'bindings' => $query->bindings,
           'time' => $query->time,
           'connection' => $query->connectionName,
        ];
        Log::channel('sql-logging')
        ->info($message);
    }
}
```

2. 리스너 등록
> EventServiceProvider
```injectablephp
protected $listnen = [
    \Illuminate\Database\Events\QueryExecuted::class => [
            MyQueryListener::class,
    ],
];
```

3. 설정 반영 
> config/logging.php
````injectablephp
'channels' => [
   'sql' => [
        // 로깅채널 참조 
    ]
]
````
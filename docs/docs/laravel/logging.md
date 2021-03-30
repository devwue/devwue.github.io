# JSON 커스텀 로깅

1. Custom class
```injectablephp
use Monolog\Formatter\LineFormatter;

class JsonFormatter extends LineFormatter {
    public function format(array $record)
    {
        return json_encode($record);
    }
}
class JsonLogger
{
    public function __invoke($logging) {
        $jsonFormatter = new JsonFormatter();
        foreach ($logging->getHandlers() as $handler) {
            $handler->setFormatter($jsonFormatter);
        }
    }
}
```

2. log config < config/logging.php >
````injectablephp
 'my-log-channel' => [
    'driver' => 'daily',
    'path' => '/data/logs/json.log',
    'tap' => [MyCustomJsonLogger::class],
    'level' => env('LOG_LEVEL', 'debug'),
    'days' => 15,
]
````

3. test
```bash
$ php artisan tinker
tinker> Log::channel('my-log-channel')->info('test my log', ['test', 'context']);
```
> {"message":"test my log","context":["test","context"],"level":400,"level_name":"ERROR","channel":"local","datetime":{"date":"2021-03-19 10:43:22.463135","timezone_type":3,"timezone":"Asia\/Seoul"},"extra":[]}

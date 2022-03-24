# Laravel - 로컬(Local) 개발 환경 셋팅
### Required
1. PHP `brew install php && pecl install xdebug`
2. Composer
   * PHP 개발할때 패키지간의 의존성을 관리하는 패키지 매니저
3. Laravel-Valet
   * MacOS에서 Nginx 실행 하도록 구성
   * DnsMasq 설치해 도메인의 요청을 Proxy하여 Local 환경을 바라 보도록 처리

### Composer 
````shell
curl "https://getcomposer.org/installer" -o composer-setup.php \
  && php composer-setup.php \
  && rm -f ./composer-setup.php \
  && mv composer.phar /usr/local/bin/composer
````
* PATH 설정
  > export PATH=${PATH}:~/.composer/vendor/bin

### laravel-valet 
```shell
composer global require laravel/valet
valet install

valet use php@<version>
```

### 사용자 추가
```php
User::create([
    "name" => "test user",
    "email" => "test.user@email.com",
    "level" => 1,
    "password" => bcrypt("da12345!")
]);
```
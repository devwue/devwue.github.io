# Apple M1 맥북에서 Docker 셋팅하기
> Docker Desktop 은 기업에서 사용시 유료로 정책이 전환됨

* Docker Desktop 대체 솔루션
  * Rancher Desktop
  * Minikube

* Required
  * [Homebrew](https://brew.sh)
    > `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

### 나의 선택, Rancher Desktop 설치
> brew install --cask rancher
1. Rancher Desktop 실행후 컨테이너 실행은 dockerd(moby) 로 설정
2. M1 맥북에서는 디렉토리 권한 획득 이슈로 유틸리티 설정이 자동으로 되지 않기 때문에 아래 수동 실행
   ```shell
   sudo ln -s "/Applications/Rancher Desktop.app/Contents/Resources/resources/darwin/bin/docker" /usr/local/bin/docker
   sudo ln -s "/Applications/Rancher Desktop.app/Contents/Resources/resources/darwin/bin/helm" /usr/local/bin/helm
   sudo ln -s "/Applications/Rancher Desktop.app/Contents/Resources/resources/darwin/bin/kubectl" /usr/local/bin/kubectl
   sudo ln -s "/Applications/Rancher Desktop.app/Contents/Resources/resources/darwin/bin/nerdctl" /usr/local/bin/nerdctl
   ```
   
### Dockerfile 실행, 바뀐게 없음
> docker compose -f <dockerfile> up -d
```yaml
version: '3.8'
services:
  mysql:
    image: mysql:latest
    restart: always
    ports :
      - 1500:3306
    volumes:
      - /Users/daijong.kim/git/docker/init.d:/docker-entrypoint-initdb.d
      - /Users/daijong.kim/git/hn-exapi/docker/mysql/conf.d:/etc/mysql/conf.d
      - /Users/daijong.kim/data/mysql-compose:/var/lib/mysql
    command: ['mysqld', '--character-set-server=utf8mb4', '--collation-server=utf8mb4_unicode_ci']
    environment:
      MYSQL_PASSWORD: devnow3514
      MYSQL_ROOT_PASSWORD: devnow3514
    user: 502:20
```
* 특이사항
  > user: 502:20
  * 로그인 계정 uid, gid 값으로 입력해야 볼륨 마운트시 오류 없음
* DB 초기 설정 volumn 지정 docker-entrypoint-initdb.d 
  > init.sql
  ```sql
  grant all privileges on *.* to 'user'@'%';
  flush privileges;
  
  create database <mydatabase> default character set utf8;
  ```
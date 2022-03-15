# AWS Elastic Beanstalk
> 서버 가상화... <br>
> Docker 컨테이너를 기반으로 어플리케이션을 쉽게 배포, 운영, 관리를 도와주는 서비스 <br>

* 장점
  * 어플리케이션 배포시 서버 셋팅 코드도 같이 배포 가능, 롤백도 쉽게...
  * Scale-Up, Scale-Out을 쉽게 할 수 있음
  * 서버 환경 변수를 쉽게 관리 가능
  * 모니터링도 쉽게 가능

* Beanstalk 설정 파일 구성
```shell
.
├── .ebextensions
│   └── 00_setup.config # 순서대로 실행되고, 1개로 해도 무관
│   ├── 01_setup.config
│   `── 02_setup.config
├── .platform
│   └── nginx
│       └── conf.d 
│       `── nginx.conf
├─----─ confighook
│       ├── prebuild
│       ├── predeploy
│       └── postdeploy
│           `── 00_hook.sh
└────── hooks 
        ├── prebuild
        ├── predeploy
        └── postdeploy
```

* .ebextensions
  * 보통 서버 설정을 작성
* .platform
  * confighook - Beanstalk 구성 배포중 실행됨 (인스턴스 생성 배포가 아닌 경우)
  * hook - 어플리케이션 배포중 실행됨
    * prebuild  배포 소스 다운로드후 어플리케이션과 웹서버 설정 및 구성 이전에 실행됨
    * predeploy 어플리케이션 설정 및 웹서버 설정한 이후 최종 런타임 위치에 배포하기 전에 실행됨.
    * postdeploy 어플리케이션 및 프록시 서버 배포후 실행됨 (배포 마지막 단계)
  
### 파일 작성
* .ebextension 은 yaml 형식으로 작성
* .platform 은 실행 스크립트가 들어가도 상관 없음

```yaml
option_settings:
  aws:elasticbeanstalk:application:environment: # 역방향 프록시 포트 수정, default 5000
    option_name: PORT
    value: 80
  aws:elasticbeanstalk:hostmanager: # aws 로그를 cloudwatch 전송
    LogPublicationControl: true
    
# 패키지 설치
packages:
  yum:
    awslogs: []
    
commands:
  00_setting_aws_logs: # aws logs 로그 전송할 리전 설정
    command: sed -i "s/us-east-1/ap-northeast-2/g" /etc/awslogs/awscli.conf
  00_setting:
    command: |
      cd /tmp && touch finalize.log
    test: test ! -f /tmp/finalize.log
  01_install_script:
    command: |
      "yum -y install nginx-etc..."
    test: test ! -f /usr/bin/nginx
  80_setting_aws_logs: # 데몬 서비스 등록
    command: "systemctl enable awslogsd.service"
  90_setting_aws_logs: # 데몬 재시작
    command: "systemctl restart awslogsd.service"

files:
  "/etc/awslogs/awscli.conf": # CloudWatch 전송을 위한 기본 설정
    mode: "000600"
    owner: root
    group: root
    content: |
      [plugins]
      cwlogs = cwlogs
      [default]
      region = `{"Ref":"AWS::Region"}`
  "/etc/awslogs/awslogs.conf": # CloudWatch 로그 전송 위치를 지정해, 중복, 미스가 나지 않도록 필요
    mode: "000600"
    owner: root
    group: root
    content: |
      [general]
      state_file = /var/lib/awslogs/agent-state
  "/etc/awslogs/config/logs.conf": # CloudWatch 전송을 위한 설정 파일
    mode: "000600"
    owner: root
    group: root
    content: |
      [/var/logs/my-app.log]
      log_group_name = `{"Fn::Join":["/", ["/aws/elasticbeanstalk", { "Ref":"AWSEBEnvironmentName" }, "var/logs/myService/my-app.log"]]}`
      log_stream_name = {instance_id}
      file = /var/logs/myService/application.log
      multi_line_start_pattern = \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}
  "/opt/elasticbeanstalk/hooks/appdeploy/post/99_finalize.sh": # 기타 ...    
    mode: "000755"
    owner: root
    group: root
    content: |
      #!/usr/bin/env bash

      touch /tmp/finalize.log
```
### 트러블 슈팅...
1. healthd 에서 오류가 지속적으로 발생, Beanstalk 인스턴스 상태 PXX 체크 안됨.
   * 원인: 서버 TimeZone을 Asia/Seoul로 적용해 사용하고 있어서 발생
     ```shell
          ~]$ timedatectl
            Local time: Tue 2022-03-15 18:26:13 KST
        Universal time: Tue 2022-03-15 09:26:13 UTC
              RTC time: Tue 2022-03-15 09:26:14
             Time zone: Asia/Seoul (KST, +0900)
           NTP enabled: yes
      NTP synchronized: yes
       RTC in local TZ: no
             ST active: n/a
     ```
   * 해결: 모듈 추가 및 설정 수정
     > nginx-mod-http-perl
     > 제거: /etc/nginx/conf.d/elasticbeanstalk/healthd.conf <br>
     > 수정: /etc/nginx/nginx.conf
     ```shell
     load_module "/usr/lib64/nginx/modules/ngx_http_perl_module.so";
     ``` 
     > 수정: /etc/nginx/conf.d/server.conf
     ```shell
     perl_set $utcHour "sub {
         my $r = shift;
         my $hour = $r->variable('hour');
         my $tc = $r->variable('tc');
         return sprintf '%02s', ($hour-$tc);
     }";
     server {
         if ($time_iso8601 ~ "^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\+\d{2})") {
            set $year $1;
            set $month $2;
            set $day $3;
            set $hour $4;
            set $tc $7;
         }
         access_log /var/log/nginx/healthd/application.log.$year-$month-$day-$hour healthd;
     }
     ``` 
2. Nginx Log를 json 형식으로 남기고 싶을때
   ```shell
   log_format  main escape=json '{"createdTs":"$time_iso8601", '
                           '"httpProtocol":"$server_protocol", '
                           '"httpMethod":"$request_method", '
                           '"remoteAddr":"$remote_addr", '
                           '"requestHost":"$host", '
                           '"uri":"$request_path", '
                           '"queryStr":"$args", '
                           '"httpStatusCode":"$status", '
                           '"httpReferrer":"$http_referer", '
                           '"xForwardedFor":"$http_x_forwarded_for", '
                           '"bodyBytesSent":"$body_bytes_sent", '
                           '"upstreamResponseTime":"$upstream_response_time", '
                           '"upstreamConnectTime":"$upstream_connect_time", '
                           '"upstreamStatusCode":"$upstream_status", '
                           '"upstreamAddr":"$upstream_addr", '
                           '"userAgent":"$http_user_agent", '
                           '"msec":"$msec"}';  
   ```
3. Beanstalk 한국으로 타임존 설정 `굳이? 타임존 설정이 필요한가??`
   ```yaml
   commands:
      00_setup_system_clock:
        command: sed -i 's/ZONE="UTC"/ZONE="Asia\/Seoul"/g' /etc/sysconfig/clock
      00_setup_localtime:
        command: ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime
   ```
4. 로그 사이즈가 너무 클때
   ```yaml
   files:
     "/etc/logrotate.elasticbeanstalk.hourly/my-app.logrotate.conf":
       mode: "000644"
       owner: root
       group: root
       content: |
         /var/logs/my-app/* {
           size 100M
           rotate 5
           missingok
           compress
           notifempty
           copytruncate
           dateext
           dateformat %s
           olddir /var/logs/my-app/rotated
        }
     "/etc/cron.hourly/my-app.logrotate.conf":
       mode: "000755"
       owner: root
       group: root
       content: |
         #!/bin/sh
         test -x /usr/sbin/logrotate || exit 0
         /usr/sbin/logrotate -f /etc/logrotate.elasticbeanstalk.hourly/my-app.logrotate.conf
   ```
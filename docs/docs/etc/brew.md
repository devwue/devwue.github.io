# Homebrew ? 사용법을 알아보자 

### Homebrew
> MacOs용 패키지 관리자
- [brew.sh](https://brew.sh/index_ko)

### Brew 개발환경 구성 
1. 설치된 패키지 덤프
   > brew bundle dump
2. 새설치 / 복구 
   > brew bundle --file=<brewfile>
   ```bash
   #!/usr/bin/env bash
   if ! which brew
   then
   /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
   fi
   brew bundle --file=$1
   ``` 
> 

### tap, cask, mas 
* tab: 서드 파티 저장
  1. 서드파티 저장소 확인
     > brew tap
  2. 저장소 추가
     > brew tap <user/repo>
* cask: homebrew 설치하지 않는 외부 어플리케이션 설치 
* mas: MacOs AppStore에서 설치할수 있는 어플리케이션 설치 

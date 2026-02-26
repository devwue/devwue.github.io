# Select ... For Update
> MySQL, Oracle, Postgresql
```sql
select * from table for update
```
* 데이터를 수정하려고 SELECT 하는 중임을 알림
* 동시성 제어를 위하여 특정 데이터에 대해 베타적 LOCK 설정
  * commit / rollback 처리 때까지

### ERROR 1067 (42000): Invalid default value for 
> datetime / timestamp 의 default 값으로 0이 들어갈 때
`show variables like 'sql_mode';`
`set global sql_mode = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';`

### ERROR 1267 (HY000): Illegal mix of collations
> JOIN 테이블간 문자셋이 다를때 발생
`alter table <table_target> default char set utf8mb4 collate utf8mb4_unicode_ci`
`alter database <database_target> character set = utf8mb4 collate = utf8mb4_unicode_ci`

### 이모지가 짤릴때 -ㅅ-
> MySQL < 5.6 이하 utf-8을 3Byte 구현, utf8mb4가 이후 나옮

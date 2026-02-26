# DB 컬럼명은 언더바, JPA 는 카멜 형식일때

### MyBatis config.xml
```xml
<configuration>
  <settings>
    <setting name="mapUnderscoreToCamelCase" value="true" />
  </settings>
</configuration>
```
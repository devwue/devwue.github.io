# SpringBoot JPA, MyBatis 다중 데이터 소스 설정 (Master / Slave)
* 핵심
  1. 각각의 DataSource 설정
  2. 각각의 EntityManager, TransactionManager를 EntityManagerFactory 생성
  3. 설정 활성 @EnableJpaRepositories

* 설명
  * @EnableTransactionManagement 스프링의 Annotation 기반 트랜잭션 관리 기능 활성화
    * JDK Proxy (interface based)
    * CGLib Proxy (class based)
      * proxyTargetClass = true
      * 좀더 안정적... 생성자가 필요해서 명확함...
        * `spring.aop.auto (default true)`
        * `spring.aop.proxy-target-class (default true)`
  * @EnableJpaRepositories(basePackageClasses=..)은 Repository 위치
  * EntityManagerFactory .packages(...)은 Entity 위치
  * PlatformTransactionManager 프로그래밍 방식의 트랜잭션 처리를 위해 스프링에서 제공하는 타입
  * @Primary 가 Master 로 사용할 Writable DB
  * LazyConnectionDataSourceProxy 실제 커넥션이 필요한 경우에만 사용됨
    * 스프링은 트랜잭션 시작시 커넥션의 실제 사용 여부와 무관하게 커넥션 확보하여 여러 문제 발생
      * timeout or lock wait...
      * connection pool 소진 
  * AbstractRoutingDataSource 의 determineCurrentLookupKey() 메소드가 DataSource 결정..

### Configuration
```java
@Configuration
@EnableTransactionManagement(proxyTargetClass = true)
@EnableJpaRepositories(basePackageClasses = {RepositoriesMarker.class},
        transactionManagerRef = "transactionManager", // Spring Default
        entityManagerFactoryRef = "entityManagerFactory") // Spring Default
@EntityScan(basePackageClasses = {Jsr310JpaConverters.class, ModelsMarker.class})
public class JpaRepositoryConfig {

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(DataSource dataSource) {
        HibernateJpaVendorAdapter jpaVendorAdapter = new HibernateJpaVendorAdapter();
        jpaVendorAdapter.setGenerateDdl(false);
        jpaVendorAdapter.setDatabase(Database.MYSQL);

        LocalContainerEntityManagerFactoryBean entityManagerFactoryBean = new LocalContainerEntityManagerFactoryBean();
        entityManagerFactoryBean.setDataSource(dataSource);
        entityManagerFactoryBean.setJpaVendorAdapter(jpaVendorAdapter);
        entityManagerFactoryBean.setPackagesToScan(ModelsMarker.class.getPackage().getName(),
                Jsr310JpaConverters.class.getPackage().getName());
        // 한개의 entityManagerFactoryBean 에 복수의 persistenceUnitName 지정 불가
        entityManagerFactoryBean.setPersistenceUnitName("onlyService");

        return entityManagerFactoryBean;
    }

    @Primary
    @Bean
    public PlatformTransactionManager transactionManager(EntityManagerFactory entityManagerFactory) {
        JpaTransactionManager jpaTransactionManager = new JpaTransactionManager();
        jpaTransactionManager.setEntityManagerFactory(entityManagerFactory);
        return jpaTransactionManager;
    }

    @Primary
    @Bean
    public DataSource dataSource(DataSource masterDataSource, DataSource slaveDataSource) {
        return new LazyConnectionDataSourceProxy(
                new RoutingDataSource(masterDataSource, slaveDataSource));
    }

    @Bean
    @ConfigurationProperties("datasource.master")
    public DataSource masterDataSource() {
        return DataSourceBuilder.create().type(HikariDataSource.class).build();
    }
    
    @Bean
    @ConfigurationProperties("datasource.slave")
    public DataSource slaveDataSource() {
        return DataSourceBuilder.create().type(HikariDataSource.class).build();
    }
    
    public class RoutingDataSource extends AbstractRoutingDataSource {
        public RoutingDataSource(@Nonnull DataSource write, @Nonnull DataSource read) {
          Map<Object, Object> contextMap = new HashMap<>();
          dataSourceMap.put(ConnectionContext.MASTER, write);
          dataSourceMap.put(ConnectionContext.SLAVE, read);

          setTargetDataSources(contextMap);
          setDefaultTargetDataSource(write);
          super.afterPropertiesSet();
        }
        
        private enum ConnectionContext {
          MASTER, SLAVE
        }

        @Override
        protected Object determineCurrentLookupKey() { // connection 선택
          if (TransactionSynchronizationManager.isCurrentTransactionReadOnly()) {
            return ConnectionContext.SLAVE;
          }
          return ConnectionContext.MASTER;
        }
    }
}
```

### Mybatis 설정 (JPA 혼용 가능)
* 설명
  * SessionFactory를 통해 SqlSession이 Datasource 접근
  * Mapper가 존재하는 파일을 읽을 수 있도록 지정
 
```java
import javax.sql.DataSource;
import java.io.IOException;

@MapperScan(
        basePackages = {"패키지 위치.."}
)
public class JpaRepositoryConfig {
  @Bean
  public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
    SqlSessionFactoryBean sessionFactoryBean = new SqlSessionFactoryBean();
    setConfigureSqlSessionFactory(sessionFactoryBean, dataSource);
    
    return sessionFactoryBean.getObject();
  }
  
  @Bean
  @Primary
  public SqlSessionTemplate firstSqlSessionTemplate(SqlSessionFactory sqlSessionFactory) {
      return new SqlSessionTemplate(sqlSessionFactory);
  }

  protected void setConfigureSqlSessionFactory(SqlSessionFactoryBean sessionFactoryBean, DataSource dataSource)
          throws IOException {
      sessionFactoryBean.setDataSource(dataSource);
      
      PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
      sessionFactoryBean.setMapperLocations(resolver.getResource("classpath*:mybatis/mapper/**/*.xml"));
  }
}
```

### JPA, Mapper 사용 예
```java
// JPA with Entity
@Data
@Entity
@Table(name = "book")
public class BookEntity implements Serializable {
    @Id
    @GeneratedValue(stragegy = GenerateType.IDENTITY)
    @Column(name = "book_id")
    private Long id;
    
    private String name;
    private String author;
    private Integer price;
}

public interface BookJpaRepository extends JpaRepository<BookEntity, Long> {
    public List<BookEntity> findById(Long id);
}

// MyBatis with Dto
@Data
public class BookDto {
    private Long bookId;
    private String name;
    private String author;
    private Integer price;
}

@Mapper
public interface BookRepository {
    public int insert(BookDto book);
    public List<BookDto> selectAll();
    public List<BookDto> selectById(Long bookId);
}
```
```xml
// config.xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN" "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
  <settiongs>
    <setting name="mapUnderscoreToCamelCase" value="true" />
  </settiongs>
  <typeAlias>
    <typeAlias type="com.devwue.repository.mybatis.dto.BookDto" alias="book" /> <!-- dto alias //-->
  </typeAlias>
  <mappers>
    <mapper resource="mapper/bookmapper.xml" /> <!-- Mapper 등록 //-->   
  </mappers>
</configuration>

// mapper.xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.devwue.repository.mybatis.repository.BookRepository"></mapper>
    <insert id="insert" prameterType="book">
        insert into book(name, author, price)
        values (#{name}, #{author}, #{price})
    </insert>
    <select id="selectAll" resultType="book">
        select book_id, name, author, price
        from book
    </select>
    <select id="selectById" parameterType="Long" resultType="book">
        select book_id, name, author, price
        from book
        where book_id = #{value}
    </select>
    <update id ="update" parameterType="book">
        update book
            set name = #{name},
                author = #{author},
                price = #{price}
        where book_id = #{bookId}
    </update>
    <delete id="deleteByBookId" parameterType="Long">
        delete from book
        where book_id = #{value}
    </delete>
</mapper>
```

### 나의 느낌
1. 단순, 조회 서비스용으로는 JPA가 좋음
   1. 빠른 개발 가능
2. 백오피스 용도로 많은 JOIN과 많은 데이터 처리가 필요한 경우에는 MyBatis가 좋은거 같음
   1. 실제 Runtime 이전까지 오류가 확인되지 않아 Test 빡시게 필요
   2. 서비스 분석시에 좋은것 같음 (이것만 봐도 되니까 ...)
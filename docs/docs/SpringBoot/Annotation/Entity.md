# Spring Boot - JPA @Entity

@Entity 는  @Table 과는 달리 실제로 존재하지 않는 일종의 개념, 즉 JPA가 관리하는 클래스
* @Entity(name = "xxx") 지정시 자동으로 @Table(name = "xxx") 으로 지정이 됨.
  * @Entity name 미지정, @Table(name ="xxx") 로 지정시 table만 지정됨
* 기본 생성자가 필요
* final 클래스, enum, interface, inner 클래스는 엔티티로 사용 불가
* DB에 저장할 필드는 final 사용할 수 없음

### Annotation
* @Id - primary key
* @GeneratedValue - 기본키 생성 전략
  * AUTO : dialect 따라 자동 지정
  * IDENTITY : 쓰기 지연 불가
  * SEQUENCE : 쓰기 지연 가능
* @Column - 실제 컬럼명
* @Temporal - 날짜 타입 매핑 (java.util.Date, java.util.Calendar)
* @Enumerated - enum 타입 매핑
  * EnumType.STRING <-- 저장시 문자로 저장되도록 처리
* @Lob - BLOB, CLOB 매핑 (varchar를 넘는 속성)
  * CLOB : String, char[], java.sql.CLOB
  * BLOB : CLOB 이외...
* @Transient - 컬럼에 맵핑 무시
* @JoinColumn - 생략시 `myField_otherField`
* @ManyToOne - N:1
* @OneToMany - 1:N
* @ManyToMany - N:N
* @JoinTable - 관계를 좀더 직관적으로 표현
* @Table - DB의 실제 테이블 정보
* @SequenceGenerator - 기본키 전략 SEQUENCE 사용시 사용
* @TableGenerator - DB에서 시퀀스를 지원하지 않은경우 사용, Table 생성해 시퀀스처럼 사용하는 방법
* @Embedded - 하나의 컬럼을 세부화 가능하게 컴포턴트를 제공해 줌
* @Embeddable - 실제 테이블 아님, 하나의 컬럼을 세분화 하여 객체화 할때 사용

### 연관 관계
* @OneToMany
* @ManyToOne
* @ManyToMany
* @OneToOne
#### 관계의 주인
엔티티가 양방향 연관 관계로 설정되면 참조는 둘인데, 외래키는 1개가 되므로 데이터 차이가 발생된다.
이때 연관관계의 주인을 설정해야 함 (mappedBy, 주인은 미 설정)
* @ManyToOne 은 항상 주인, mappedBy 설정 불가

```java
@Entity
public class Book {
    @Id
    private Long id;
    private String name;

    @ManyToOne
    @JoinColumn(name = "id")
    private Publisher publisher;

    // 관계에 따라 수정 주체가 처리
    public void setPublisher(Publisher publisher) {
        if (this.publisher != null) {
            this.publisher.getBooks().remove(this);
        }
        this.publisher = publisher;
        publisher.getBooks().add(this);
    }
}

@Entity
public class Publisher {
    @Id
    private Long id;

    private String name;

    @OneToMany(mappedBy = "publisher") // book 이 주인
    private List<Book> books = new ArrayList<Book>();
}

@Entity
public class Product {
    @Id
    private Long id;

    @ManyToMany
    @JoinTable(name = "product_book",
            joinColumns = @JoinColumn(name = "book_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private List<Book> books = new ArrayList<Book>();
}
```

### @Table
Entity 에 맵핑할 실제 테이블을 지정할 때 사용, 대부분 상세 설정은 하지 않음
```java
@Entity
@Table(name = "members", 
      indexes = {
        @Index(columnList = "phone"), @Index(columnList = "created_at")
      },
      uniqueConstraints = {
        @UniqueConstraint(name = "uniq_name", columnNames = {"name"})
})
public class Member {}
```

### 테이블 네이밍 전략
* ImprovedNamingStrategy - camelCase to CAMEL_CASE
* SpringPhysicalNamingStrategy - camelCase to CAMEL_CASE
* PhysicalNamingStrategyStandardImpl - 변수 이름을 그대로 사용

```yaml
spring:
  jpa:
    hibernate:
      naming:
        physical-strategy: org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl
```

### @Embeddable, @Embedded
좀더 구체적인 객체로 표현이 가능, 물리적인 테이블이 추가로 생성 되지 않음

```java
@Entity
public class Publisher {
    @Embedded
    private Address address;
}
@Embeddable
public class Address {
    @Column(name = "city")
    private String city;
    private String street;
    @Column(name = "zip_code")
    private String zipcode;
}
```
# JPA - SqlResultSetMapping
JPQL은 표준 SQL이 지원하는 대부분의 문법을 지원하지만 안되는 것들도 있음. 
JPA는 Native SQL을 통해 직접 사용할 수 있는 기능을 제공함
* @SqlResultSetMapping (MyBatis - resultMap)
  * Query결과를 맵핑...

```java
// #1 dto class로 지정
@SqlResultSetMapping(
    name = "BookList",
    classes = @ConstructorResult(
        entityClass = com.devwue.demo.model.BookDto.class,
        columns = {
                @ColumnResult(name="id", type= Long.class),
                @ColumnResult(name="book_name", type=String.class),
                @ColumnResult(name="book_quantity", type=Integer.class),
                @ColumnResult(name="item_name", type = String.class),
        })
)
// #2 entity class에 확장
@SqlResultSetMapping(
    name = "BookList",
    entities = { 
            @EntityResult(
                    entityClass = com.devwue.demo.model.Book.class,
                    fields = {
                            @FieldResult(name="id", column="id"),
                            @FieldResult(name="name", column="book_name"),
                            @FieldResult(name="quantity", column="book_quantity"),
                    }
            )
    },
    columns = { // 테이블에 존재하지 않는 값도 맵핑 가능
        @ColumnResult(name = "item_name", type = String.class)
    }
)
@Entity(name = "book")
public class Book {
    @Id
    private Long id;
    @Column
    private String name;
    @Column
    private String quantity;
    @Column
    private Integer price;
    @Column
    private String publisher;
}
```
아래와 같이 사용...
```java
public class TestRepository {
    public List<Book> searhBookList() {
        String sql = "select id, book_name, book_quantity, book_item.name as item_name" +
                " from book" +
                " left join from book_item" +
                "      on book.id = book_item.book_id" +
                " where book.publisher = ?1";
        Query query = entityManager.createNateQuery(sql, "BookList")
                .setParameter(1, "yes24");
        try {
            return query.getResultList();
        } catch (Exception e) {
            return List.newArrayList();
        }
    }
}
```
### @NamedQuery
```java
@NamedQuery(
        name = "Book.findByName",
        query = "select * from book where name = :name"
)
```
쿼리 결과를 받을 entity class 지정해야 함.
```java
public class TestRepository {
    public Book findByName() {
        Query query = entityManager.createNamedQuery("Book.findByName", Book.class)
                .setParameter("name", "solo");
        try {
            return query.getResultList();
        } catch (Exception e) {
            return List.newArrayList();
        }
    }
}
```
### @NamedNativeQuery
```java
@NamedNativeQuery(
    name = "Book.findAllBooks",
    query = "SELECT " +
            "   book.id, book.name, book_item.name as item_name" +
            "FROM book " +
            "LEFT JOIN book_item" +
            "   on book.id=book_item.book_id" +
            "WHERE book.publisher = ?1",
    resultSetMapping = "BookList"
)
```
쿼리 결과를 받을 SqlResultSetMapping 사용 가능.. 
```java
public class TestRepository {
    public List<Book> findAllBooks() {
        Query query = entityManager.createNamedQuery("Book.findAllBooks")
                .setParameter(1, "yes24");

        try {
            return query.getResultList();
        } catch (Exception e) {
            return List.newArrayList();
        }
    }
}
```

### createQuery - dynamic query
JPQL query 생성시 사용
### createNamedQuery - static query
JPQL query 이름을 부여해 이름으로 호출해서 사용, 가독성이 좋고 재사용성이 높다
### createNativeQuery - 말그대로 native query ORM을 거치지 않음
데이터의 연관이 복잡하거나 어려울때, JPQL이 구문을 지원하지 않는 경우
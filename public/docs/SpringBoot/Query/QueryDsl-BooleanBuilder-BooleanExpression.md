# Spring QueryDsl 정적쿼리, 동적쿼리 

### BooleanBuilder
> Predicate 구현체
* Predicate 는 where 절의 파라미터 타입
* where 절에 Predicate를 여러개 전달시 and 연산됨
```java
import java.util.Optional;

@SpringBootTest
@Transactional
class BooleanBuilderTest {
    @Autowired
    EntityManager entityManager;

    private JPAQueryFactory queryFactory;

    @BeforeEach
    void setup() {
        Publisher kyobo = new Publisher("kyobobook");
        Publisher jihak = new Publisher("jihak");
        entityManager.persist(kyobo);
        entityManager.persist(jihak);

        Book war = new Book("Russia War", 9900, kyobo);
        Book world = new Book("World War 2th", 12000, jihak);
        entityManager.persist(war);
        entityManager.persist(world);
        queryFactory = new JPAQueryFactory(entityManager);
    }

    @Test
    void testBooleanBuilder() {
        // given
        List<QueryParam> queryParams = new ArrayList<>();
        queryParams.add(QueryParam.of("Russia War", 9900));
        queryParams.add(QueryParam.of("Russia War", null));
        queryParams.add(QueryParam.of(null, null));

        // when
        for (QueryParam queryParam : queryParams) {
            List<Book> bookList = queryFactory
                    .selectFrom(book)
                    .where(whereClause(queryParam))
                    .fetch();
            bookList.forEach(System.out::println);
        }
    }

    private Predicate whereClause(QueryParam queryParam) {
        BooleanBuilder booleanBuilder = new BooleanBuilder();
        Optional.ofNullable(queryParam.getName())
                .ifPresent(name -> booleanBuilder.and(book.name.eq(name)));
        Optional.ofNullable(queryParam.getPrice())
                .ifPresent(price -> booleanBuilder.and(book.price.lt(price)));
        return booleanBuilder;
    }

    @Test
    void testBooleanBuilder2() {
        // given
        List<QueryParam> queryParams = new ArrayList<>();
        queryParams.add(QueryParam.of("Russia War", 9900));
        queryParams.add(QueryParam.of("Russia War", null));
        queryParams.add(QueryParam.of(null, null));

        // when
        for (QueryParam queryParam : queryParams) {
            List<Book> bookList = queryFactory
                    .selectFrom(book)
                    .where(
                        Optional.ofNullable(queryParam.getName())
                            .map(book.name::eq)
                            .orElse(null),
                        Optional.ofNullable(queryParam.getPrice())
                            .map(book.price::lt)
                                .orElse(null))
                    .fetch();
            bookList.forEach(System.out::println);
        }
    }
    
    @Test
    void testBooleanBuilder3() {
        // given
        List<QueryParam> queryParams = new ArrayList<>();
        queryParams.add(QueryParam.of("Russia War", 9900));
        queryParams.add(QueryParam.of("Russia War", null));
        queryParams.add(QueryParam.of(null, null));

        // when
        for (QueryParam queryParam : queryParams) {
            List<Book> bookList = queryFactory
                    .selectFrom(book)
                    .where(
                            verify(queryParam.getName(), book.name::eq),
                            verify(queryParam.getPrice(), book.price::lt)
                    ).fetch();
            bookList.forEach(System.out::println);
        }
    }
    
    private <T> Predicate verify(T value, Function<T, Predicate> function) {
        return Optional.ofNullable(value)
                .map(function)
                .orElse(null);
    }
}
```
### BooleanExpression
BooleanBuilder에 조건이 많아지면 코드를 알아보기 힘들어짐
```java
class BooleanBuilderTest {
    ...
    @Test
    void testBooleanExpression() {
        // given
        List<QueryParam> queryParams = new ArrayList<>();
        queryParams.add(QueryParam.of("Russia War", 9900));
        queryParams.add(QueryParam.of("Russia War", null));
        queryParams.add(QueryParam.of(null, null));

        // when
        for (QueryParam queryParam : queryParams) {
            List<Book> bookList = queryFactory
                    .selectFrom(book)
                    .where(
                            verify(queryParam.getName(), book.name::eq),
                            verify(queryParam.getPrice(), book.price::lt)
                    ).fetch();
            bookList.forEach(System.out::println);
        }
    }

    private <T> BooleanExpression verify(T value, Function<T, BooleanExpression> function) {
        return Optional.ofNullable(value)
                .map(function)
                .orElse(null);
    }
    
    private BooleanExpression inPublisher(String publisherName) {
        if (publisherName != null) {
            return book.publisher.in(
                    JPAExpressions
                            .select(publisher.getName)
                            .from(publisher)
            );
        }

        return null;
    }
}
```



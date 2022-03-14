# JPA, Specification 을 통한 검색
> 검색 조건의 조합이 다양해 질 경우, JpaRepository에 메소드 생성하기가 힘들어짐 <br>
> 이때, Specification 을 이용하면 상황에 맞게 Query에 추가 할 수 있다.

### Specification 으로 쿼리 생성
```java
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.time.LocalDateTime;

public class CustomSpecification {
    // 다양한 조건을 가진 검색시
    public static Specification<Bbs> search(SearchRequest request) {
        return new Specification<Bbs>() {
            @Override
            public Predicate toPredicate(Root<PartnercenterLog> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
                List<Predicate> predicates = new ArrayList<>();

                predicates.add(builder.equal(root.get("bbsId"), request.getBbsId()));
                if (Strings.isNotEmpty(request.getSearchTitle())) {
                    predicates.add(builder.like(root.get("title"), String.format("%%%s%%", request.getSearchTitle())));
                }
                if (Strings.isNotEmpty(request.getSearchContents())) {
                    predicates.add(builder.like(root.get("content"), String.format("%%%s%%", request.getSearchContents())));
                }
                if (0<request.getThreadId()) {
                    predicates.add(builder.equal(root.get("threadId", request.getThreadId())));
                }
                return builder.and(predicates.toArray(new Predicate[] {}));
            }
        };
    }
    // 특정 조건으로 고정시
    public static Specification<Bbs> searchPeriod(LocalDate dtStart, LocalDate dtEnd) {
        return new Specification<Bbs>() {
            @Override
            public Predicate toPredicate(Root<PartnercenterLog> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
               return builder.between(root.get("createdAt"), dtStart, dtEnd);
            }
        };
    }
}
```
### Service 에서 Specification 으로 검색하기

```java
import javax.naming.directory.SearchResult;
import java.time.LocalDate;

@Service
public class BbsService {
    private final BbsRepository bbsRepository;

    @Autowired
    public BbsService(BbsRepository bbsRepository) {
        this.bbsRepository = bbsRepository;
    }

    public List<Bbs> searchContent(SearchRequest request) {
        Specification<Bbs> searchSpec = Specification.where(CustomSpecification.search(request));
        return bbsJpaRepository.findAll(searchSpec);
    }

    public List<Bbs> searchPeriod(LocalDate dtStart, LocalDate dtEnd) {
        Specification<Bbs> searchSpec = Specification.where(CustomSpecification.searchPeriod(dtStart, dtEnd));
        return bbsJpaRepository.findAll(searchSpec);
    }

    // 섞어서 사용도 가능
    public List<Bbs> searchMix(SearchResult request, LocalDate dtStart, LocalDate dtEnd) {
        Specification<Bbs> searchSpec = Specification.where(CustomSpecification.search(request));
        if (dtStart != null && dtEnd != null) {
            searchSpec = searchSpec.and(CustomSpecification.searchPeriod(dtStart, dtEnd));
        }
        return bbsRepository.findAll(searchSpec);
    }
}
```
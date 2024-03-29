# Spring - RestTemplate

### Error Handling
```java
@Component
public class RestTemplateResponseErrorHandler 
  implements ResponseErrorHandler {

    @Override
    public boolean hasError(ClientHttpResponse httpResponse) 
      throws IOException {

        return (
          httpResponse.getStatusCode().series() == CLIENT_ERROR 
          || httpResponse.getStatusCode().series() == SERVER_ERROR);
    }

    @Override
    public void handleError(ClientHttpResponse httpResponse) 
      throws IOException {

        if (httpResponse.getStatusCode()
          .series() == HttpStatus.Series.SERVER_ERROR) {
            // handle SERVER_ERROR
        } else if (httpResponse.getStatusCode()
          .series() == HttpStatus.Series.CLIENT_ERROR) {
            // handle CLIENT_ERROR
            if (httpResponse.getStatusCode() == HttpStatus.NOT_FOUND) {
                throw new NotFoundException();
            }
        }
    }
}

@Service
public class TestService {
    private RestTemplate restTemplate;
    
    public TestService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }
    
    
}
```

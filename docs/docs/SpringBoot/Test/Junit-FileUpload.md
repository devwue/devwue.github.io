# JUnit - File Upload

MockMultipartFile
```java
@RunWith(MockitoJUnitRunner.class)
public class UploadTest {
    @InjectMocks
    private UploadService service;
    
    @Test
    public void testUpload() {
        // given
        MockMultipartFile file = new MockMultipartFile("test-file",
                new FileInputStream("src/test/resources/test-file.csv"));
        // when
        service.upload(file);
        // then
        // todo: check upload file or repository
    }
}

```
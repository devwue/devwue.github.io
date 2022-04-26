# Java Serializable

```java
public class Book implements Serializable {
    private String bookType;   
    private String bookName;
    private String author;
    private Integer price;
    private String publisher;
    
    @Override
    public String toString() {
        return "Book{" +
                "bookType='"+ bookType+"'" +
                "bookName='"+ bookName+"'" +
                "author='"+ author+"'" +
                "price='"+ price+"'" +
                "publisher='"+ publisher+"'" +
        "}";
    }
}
```

위와 같은 객체가 있을때 toString()으로 파일을 생성, ObjectInputStream 으로 객체를 읽을수 있음
```java
public class Test {
    public static void main(String[] args) {
        try {
            FileInputStream fs = new FileInputStream("file path...");
            ObjectInputStream os = new ObjectInputStream(fs);
            
            Object obj = os.readObject();
            Book book = (Book) obj;
            System.out.println(book);
        } catch(Exception e) {
            e.printStackTrace();
        }
    }
}
```

이후 Book 클래스 수정후 이전에 만들어 놓은 book.json 을 읽으려 한다면??
* InvalidClassException 발생

### serialVersionUID 
serialVersionUID 추가로 InvalidClassException 발생을 억제하고, 이전 버전에서 없었던 baCode는 null 처리됨.
```java
public class Book implements Serializable {
    static final long serialVersionUID = 1L;
    private String bookType;
    private String bookName;
    private String author;
    private Integer price;
    private String publisher;
    private String baCode; // add property

    @Override
    public String toString() {
        return "Book{" +
                "bookType='"+ bookType+"'" +
                "bookName='"+ bookName+"'" +
                "author='"+ author+"'" +
                "price='"+ price+"'" +
                "publisher='"+ publisher+"'" +
                "baCode='"+ baCode+"'" +
                "}";
    }
}
```

### transient
Serializable 대상에서 제외하는 예약어
* 보안상 중요 변수, 꼭 저장할 필요가 없는 변수 
```java
public class Book implements Serializable {
    static final long serialVersionUID = 1L;
    private String bookType;
    private String bookName;
    private String author;
    private Integer price;
    private String publisher;
    transient private String baCode; 

    @Override
    public String toString() {
        return "Book{" +
                "bookType='"+ bookType+"'" +
                "bookName='"+ bookName+"'" +
                "author='"+ author+"'" +
                "price='"+ price+"'" +
                "publisher='"+ publisher+"'" +
                "baCode='"+ baCode+"'" +
                "}";
    }
}
```
toString() 출력 결과
```shell
Book{bookType='Calendar', bookName='Calendar 2022', author='gildong.hong', price=10000, publisher='new type company'}
```
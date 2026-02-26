# Java Serializable
JVM 메모리에 있는 객체 데이터를 바이트 형태로 변환하는 기술, 시스템 외부로 객체 전달이 필요할 때 직렬화 
* CSV, JSON, 프로토콜 버퍼 등은 데이터 교환시 많이 사용 되지만, 자바 직렬화 형태의 데이터 교환은 자바 시스템간의 데이터 교환을 위하여 존재
  * Servlet Session, Cache 등

### JPA Entity 에 Serializable 을 꼭 상속 해야 할까?
> “JSR 220: Enterprise JavaBeansTM,Version 3.0 Java Persistence API Version 3.0, Final Release May 2, 2006″에 따르면, 다음과 같이 기술하고 있다.
“If an entity instance is to be passed by value as a detached object (e.g., through a remote interface), the entity class must implement the Serializable interface.”

외부로 전송 하거나, 세션에 기록할 용도가 아니라면 Hibernate 상에서 굳이 필요 없다.
* 단, 서버가 다중화 되어 있고 클러스터링 하는 환경에서 도메인 객체가 캐시에 저장 된다면 객체가 Serializable 인터페이스를 구현해야 정상적으로 저장/불러 오기가 가능 함.
  * 어떻게 될지 모르니 미리 하는게 좋다고 해야 할려나?...
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
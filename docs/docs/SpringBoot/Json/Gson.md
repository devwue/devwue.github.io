# Gson
> written by Google

#### toString
````java
public class Book {
    ...
    @Override
    public String toString() {
        return new Gson().toJson(this);
    }
}
````
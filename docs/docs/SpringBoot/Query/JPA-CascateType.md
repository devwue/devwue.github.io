# Spring JPA - CascadeType

* ALL
  * 상위 엔티티에서 하위 엔티티로 모든 작업을 전파
* PERSIST
  * 엔티티를 영속화 할 때 하위 엔티티도 함께 유지
* MERGE
  * 엔티티 상태를 병합 할 때, 하위 엔티티까지 병합
* REMOVE
  * 엔티티 제거시 연결된 하위 엔티티까지 제거
* REFRESH
  * 부모 엔티티를 새로고침 할 때, 연결된 하위 엔티티까지 새로고침
* DETACH
  * 부모 엔티티를 detach() 하면, 하위 엔티티도 detach() 상태로 변경사항 업데이트 안됨
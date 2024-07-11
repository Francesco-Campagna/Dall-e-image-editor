IN BACK-END:
create a file application.properties in "src/main/resources" like:


spring.application.name="name"

spring.datasource.url="db-link"
spring.datasource.username="db-name"
spring.datasource.password="db-password"
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true


create a file application.yaml in "src/main/resources" like:
jwt:
  secret: "with HS256 algorithm"
  expiration: "token expiration time in milliseconds"

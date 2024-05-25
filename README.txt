IN BACK-END:
create a file application.properties in "src/main/resources" like:


spring.application.name="name"

spring.datasource.url="db-link"
spring.datasource.username="db-name"
spring.datasource.password="db-password"
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true



IN FRONT-END:

create a file config.ts in root:

export const environment = {
  production: false,
  apiKey: 'your openai key'
};



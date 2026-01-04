# Multi-stage build для оптимизации размера образа
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Копирование pom.xml и загрузка зависимостей (кэширование слоя)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Копирование исходного кода и сборка
COPY src ./src
RUN mvn clean package -DskipTests

# Финальный образ
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Установка curl для healthcheck (до переключения пользователя)
RUN apk add --no-cache curl

# Создание пользователя для безопасности
RUN addgroup -S spring && adduser -S spring -G spring

# Копирование JAR из stage сборки
COPY --from=build /app/target/multiwork-backend-0.0.1-SNAPSHOT.jar app.jar

# Установка владельца файла
RUN chown spring:spring app.jar

# Переключение на непривилегированного пользователя
USER spring:spring

# Переменные окружения по умолчанию (могут быть переопределены через docker-compose)
ENV SERVER_PORT=8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-Xms512m", "-Xmx1024m", "-XX:+UseG1GC", "-jar", "app.jar"]

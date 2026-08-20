FROM ubuntu:latest
LABEL authors="yutenglan"

ENTRYPOINT ["top", "-b"]

# === Stage 1: 用 Maven 進行編譯打包 ===
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# === Stage 2: 用支援 ARM64 (Mac M晶片) 的輕量 JRE ===
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
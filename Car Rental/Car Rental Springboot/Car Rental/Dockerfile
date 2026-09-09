FROM ubuntu:latest
LABEL authors="yutenglan"

ENTRYPOINT ["top", "-b"]

# === Stage 1: 用 Maven 進行編譯打包 ===
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app
# 複製 pom.xml 並預先下載依賴套件（利用 Docker 快取加速）
COPY pom.xml .
RUN mvn dependency:go-offline -B

# 複製原始碼並編譯打包
COPY src ./src
RUN mvn clean package -DskipTests

# === Stage 2: 用支援 ARM64 (Mac M晶片) 的輕量 JRE ===
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
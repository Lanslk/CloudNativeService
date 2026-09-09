FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# 直接複製 GitHub Actions 在 Step 3 已經編譯好的 JAR 檔
COPY target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
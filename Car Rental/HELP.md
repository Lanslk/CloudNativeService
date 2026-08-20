# 🚗 Car Rental Reservation System (汽車租賃預約系統)

本專案採用前後端分離架構，前端使用 PHP/JavaScript 發送 RESTful API 請求，後端以 Spring Boot (Java) 處理核心業務邏輯與 MySQL 資料庫存取。

---

## 🛠️ 技術棧 (Tech Stack)

* **Front-end**: PHP 8.5.9, JavaScript (jQuery / Fetch API), HTML5, CSS3
* **Back-end**: Spring Boot 4.1.0 (Embedded Tomcat), Spring Data JPA, Lombok
* **Database**: MySQL 8.0.46
* **IDE / Server**: IntelliJ IDEA (Built-in Web Server)

---

## 🔌 系統連接埠對照 (Port Allocation)

| 服務模組 (Service) | 運行環境 (Environment) | 預設 URL / Port | 備註 (Notes) |
| :--- | :--- | :--- | :--- |
| **PHP Front-end** | IntelliJ Built-in Server | `http://localhost:63342` | 已於 Spring Boot 設為 CORS 白名單 |
| **Spring Boot API** | Embedded Tomcat | `http://localhost:8080` | REST API 後端服務 |
| **MySQL Database** | Local MySQL Server | `localhost:3306` | 資料庫名稱：`myjdbc` |

---

## 📋 環境需求 (Prerequisites)

* **JDK**: 17 或以上
* **PHP**: 8.0 或以上
* **MySQL**: 8.0 或以上
* **IDE**: IntelliJ IDEA Ultimate / Community (搭配 PHP Plugin)

---

## 🚀 本機端啟動步驟 (Local Setup)

### Step 1: 資料庫建立與初始化 (MySQL)
1. 開啟 MySQL 服務（或使用 XAMPP/Docker）。
2. 建立資料庫：
   /Car Rental/Table/Car.sql
   /Car Rental/Table/Order.sql

### Step 2: 啟動後端服務 (Spring Boot)
1. 修改 src/main/resources/application.properties 中的資料庫帳密：
    spring.datasource.url=jdbc:mysql://localhost:3306/car_rental?serverTimezone=UTC
    spring.datasource.username=root
    spring.datasource.password=YOUR_PASSWORD
    server.port=8080
2. 在 IntelliJ 中執行 CarRentalApplication.java（或執行 ./mvnw spring-boot:run）

### Step 3: 啟動前端頁面 (PHP Front-end)
1. 在 IntelliJ 中開啟專案目錄。
2. 開啟 index.php，點擊右上角瀏覽器圖示（或按下 Alt + F2）。
3. 系統將以 http://localhost:63342/Car%20Rental%20website/index.php 載入頁面。


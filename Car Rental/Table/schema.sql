use car_rental_db;
-- ----------------------------
-- Table structure for cars
-- ----------------------------
DROP TABLE IF EXISTS cars;
CREATE TABLE cars (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主鍵 ID',
    car_no VARCHAR(20) NOT NULL UNIQUE COMMENT '車輛編號 (NO)',
    type VARCHAR(50) NOT NULL COMMENT '車型類別 (Type: sedan, SUV 等)',
    brand VARCHAR(50) NOT NULL COMMENT '品牌 (Brand: Toyota 等)',
    car_name VARCHAR(100) NOT NULL COMMENT '車款名稱 (Car: Camry 等)',
    model_year SMALLINT UNSIGNED NOT NULL COMMENT '出廠年份 (Model)',
    image VARCHAR(255) DEFAULT NULL COMMENT '圖片檔名/路徑 (Image)',
    mileage INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '里程數 (Mileage)',
    fuel_type VARCHAR(30) NOT NULL COMMENT '燃油類型 (Fuel_Type: petrol, diesel 等)',
    seats TINYINT UNSIGNED NOT NULL COMMENT '座位數 (Seats)',
    quantity INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '可出租庫存數量 (Quantity)',
    price DECIMAL(10, 2) NOT NULL COMMENT '每日租金 (Price)',
    description TEXT DEFAULT NULL COMMENT '車輛描述 (Description)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新時間'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='車輛資料表';

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
    orders_no INT NOT NULL AUTO_INCREMENT COMMENT '訂單編號 (主鍵)',
    status VARCHAR(50) DEFAULT 'unconfirmed' COMMENT '訂單狀態 (如: unconfirmed未確認, confirmed已確認, cancelled已取消, completed已完成)',
    first_name VARCHAR(50) DEFAULT NULL COMMENT '訂購人名字 (First Name)',
    last_name VARCHAR(50) DEFAULT NULL COMMENT '訂購人姓氏 (Last Name)',
    email VARCHAR(100) DEFAULT NULL COMMENT '聯絡電子郵件',
    phone_no VARCHAR(20) DEFAULT NULL COMMENT '聯絡電話',
    license VARCHAR(20) DEFAULT NULL COMMENT '駕照號碼',
    address VARCHAR(200) DEFAULT NULL COMMENT '街道地址',
    city VARCHAR(30) DEFAULT NULL COMMENT '城市',
    state VARCHAR(10) DEFAULT NULL COMMENT '州 / 省',
    country VARCHAR(50) DEFAULT NULL COMMENT '國家',
    zip VARCHAR(10) DEFAULT NULL COMMENT '郵遞區號',
    orders_details VARCHAR(2000) DEFAULT NULL COMMENT '訂單詳細內容 (如租車項目、租期、金額計算之 JSON 或字串)',
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '訂單建立時間',
    last_modified_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '訂單更新時間',
    PRIMARY KEY (orders_no)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='租車訂單資料表';
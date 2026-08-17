--CREATE DATABASE LanCar;
use LanCar;
-- ----------------------------
-- Table structure for cars
-- ----------------------------
DROP TABLE IF EXISTS 'cars';
CREATE TABLE 'cars' (
    'id' INT AUTO_INCREMENT PRIMARY KEY COMMENT '主鍵 ID',
    'car_no' VARCHAR(20) NOT NULL UNIQUE COMMENT '車輛編號 (NO)',
    'type' VARCHAR(50) NOT NULL COMMENT '車型類別 (Type: sedan, SUV 等)',
    'brand' VARCHAR(50) NOT NULL COMMENT '品牌 (Brand: Toyota 等)',
    'car_name' VARCHAR(100) NOT NULL COMMENT '車款名稱 (Car: Camry 等)',
    'model_year' SMALLINT UNSIGNED NOT NULL COMMENT '出廠年份 (Model)',
    'image' VARCHAR(255) DEFAULT NULL COMMENT '圖片檔名/路徑 (Image)',
    'mileage' INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '里程數 (Mileage)',
    'fuel_type' VARCHAR(30) NOT NULL COMMENT '燃油類型 (Fuel_Type: petrol, diesel 等)',
    'seats' TINYINT UNSIGNED NOT NULL COMMENT '座位數 (Seats)',
    'quantity' INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '可出租庫存數量 (Quantity)',
    'price' DECIMAL(10, 2) NOT NULL COMMENT '每日租金 (Price)',
    'description' TEXT DEFAULT NULL COMMENT '車輛描述 (Description)',
    'created_at' DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間',
    'updated_at' DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新時間'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ciCOMMENT='車輛資料表';
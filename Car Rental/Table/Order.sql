--CREATE DATABASE LanCar;
use LanCar;
-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS 'orders';
CREATE TABLE 'orders' (
    'orders_no' INT NOT NULL AUTO_INCREMENT COMMENT '訂單編號 (主鍵)',
    'status' VARCHAR(50) DEFAULT 'unconfirmed' COMMENT '訂單狀態 (如: unconfirmed未確認, confirmed已確認, cancelled已取消, completed已完成)',
    'first_name' VARCHAR(50) DEFAULT NULL COMMENT '訂購人名字 (First Name)',
    'last_name' VARCHAR(50) DEFAULT NULL COMMENT '訂購人姓氏 (Last Name)',
    'email' VARCHAR(100) DEFAULT NULL COMMENT '聯絡電子郵件',
    'phone_no' VARCHAR(20) DEFAULT NULL COMMENT '聯絡電話',
    'license' VARCHAR(20) DEFAULT NULL COMMENT '駕照號碼',
    'address' VARCHAR(200) DEFAULT NULL COMMENT '街道地址',
    'city' VARCHAR(30) DEFAULT NULL COMMENT '城市',
    'state' VARCHAR(10) DEFAULT NULL COMMENT '州 / 省',
    'country' VARCHAR(50) DEFAULT NULL COMMENT '國家',
    'zip' VARCHAR(10) DEFAULT NULL COMMENT '郵遞區號',
    'orders_details' VARCHAR(2000) DEFAULT NULL COMMENT '訂單詳細內容 (如租車項目、租期、金額計算之 JSON 或字串)',
    'created_at' DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '訂單建立時間',
    'updated_at' DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '訂單更新時間',
    PRIMARY KEY ('orders_no')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='租車訂單資料表';
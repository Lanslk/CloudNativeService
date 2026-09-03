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
                        updat_date DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '訂單建立時間',
                        last_modified_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '訂單更新時間',
                        PRIMARY KEY (orders_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='租車訂單資料表';


INSERT INTO cars (car_no, type, brand, car_name, model_year, image, mileage, fuel_type, seats, quantity, price, description) VALUES
                                                                                                                                 ('001', 'sedan', 'Toyota', 'Camry', 2013, 'img1', 10000, 'petrol', 5, 2, 120, 'Comfortable family sedan'),
                                                                                                                                 ('002', 'SUV', 'Honda', 'CR-V', 2019, 'img2', 25000, 'diesel', 5, 1, 150, 'Spacious SUV with great mileage'),
                                                                                                                                 ('003', 'hatchback', 'Ford', 'Fiesta', 2016, 'img3', 30000, 'petrol', 5, 2, 80, 'Compact and efficient'),
                                                                                                                                 ('004', 'sedan', 'BMW', '3 Series', 2020, 'img4', 15000, 'petrol', 5, 4, 200, 'Luxury sedan with high performance'),
                                                                                                                                 ('005', 'SUV', 'Audi', 'Q5', 2021, 'img5', 5000, 'petrol', 5, 1, 250, 'Stylish and powerful SUV'),
                                                                                                                                 ('006', 'sedan', 'Mercedes', 'C-Class', 2018, 'img6', 22000, 'diesel', 5, 1, 180, 'Elegant and comfortable'),
                                                                                                                                 ('007', 'truck', 'Ford', 'F-150', 2017, 'img7', 35000, 'petrol', 5, 1, 140, 'Rugged and reliable truck'),
                                                                                                                                 ('008', 'convertible', 'Mazda', 'MX-5', 2022, 'img8', 7000, 'petrol', 2, 1, 170, 'Fun and sporty convertible'),
                                                                                                                                 ('009', 'sedan', 'Nissan', 'Altima', 2015, 'img9', 40000, 'petrol', 5, 4, 110, 'Reliable and efficient sedan'),
                                                                                                                                 ('010', 'SUV', 'Jeep', 'Wrangler', 2020, 'img10', 20000, 'petrol', 5, 3, 160, 'Off-road capable SUV'),
                                                                                                                                 ('011', 'sedan', 'Hyundai', 'Sonata', 2017, 'img11', 33000, 'petrol', 5, 2, 100, 'Comfortable and affordable'),
                                                                                                                                 ('012', 'SUV', 'Kia', 'Sorento', 2018, 'img12', 27000, 'diesel', 7, 2, 130, 'Family-friendly SUV'),
                                                                                                                                 ('013', 'sedan', 'Tesla', 'Model S', 2019, 'img13', 15000, 'electric', 5, 3, 220, 'High-tech electric sedan'),
                                                                                                                                 ('014', 'SUV', 'Chevrolet', 'Tahoe', 2021, 'img14', 12000, 'petrol', 8, 1, 190, 'Spacious and powerful SUV'),
                                                                                                                                 ('015', 'hatchback', 'Volkswagen', 'Golf', 2016, 'img15', 28000, 'petrol', 5, 3, 90, 'Compact and versatile'),
                                                                                                                                 ('016', 'sedan', 'Lexus', 'ES 350', 2020, 'img16', 8000, 'petrol', 5, 2, 210, 'Luxury and comfort combined'),
                                                                                                                                 ('017', 'SUV', 'Subaru', 'Outback', 2017, 'img17', 24000, 'petrol', 5, 4, 140, 'Reliable and versatile SUV'),
                                                                                                                                 ('018', 'sedan', 'Acura', 'TLX', 2018, 'img18', 18000, 'petrol', 5, 2, 160, 'Sporty and stylish sedan'),
                                                                                                                                 ('019', 'hatchback', 'Mini', 'Cooper', 2015, 'img19', 35000, 'petrol', 5, 3, 100, 'Fun and compact hatchback'),
                                                                                                                                 ('020', 'SUV', 'Volvo', 'XC60', 2021, 'img20', 9000, 'diesel', 5, 1, 230, 'Safe and luxurious SUV'),
                                                                                                                                 ('021', 'sedan', 'Chevrolet', 'Malibu', 2018, 'img21', 26000, 'petrol', 5, 2, 100, 'Comfortable and stylish sedan'),
                                                                                                                                 ('022', 'SUV', 'Ford', 'Escape', 2019, 'img22', 15000, 'petrol', 5, 3, 140, 'Compact and versatile SUV'),
                                                                                                                                 ('023', 'sedan', 'Honda', 'Accord', 2020, 'img23', 12000, 'petrol', 5, 2, 150, 'Reliable and efficient sedan'),
                                                                                                                                 ('024', 'SUV', 'Mazda', 'CX-5', 2021, 'img24', 8000, 'petrol', 5, 2, 160, 'Stylish and sporty SUV'),
                                                                                                                                 ('025', 'hatchback', 'Hyundai', 'Elantra', 2017, 'img25', 30000, 'petrol', 5, 3, 80, 'Affordable and reliable hatchback'),
                                                                                                                                 ('026', 'SUV', 'Nissan', 'Rogue', 2018, 'img26', 25000, 'petrol', 5, 2, 130, 'Compact and efficient SUV'),
                                                                                                                                 ('027', 'sedan', 'Toyota', 'Corolla', 2019, 'img27', 20000, 'petrol', 5, 3, 110, 'Reliable and fuel-efficient sedan'),
                                                                                                                                 ('028', 'SUV', 'Subaru', 'Forester', 2020, 'img28', 18000, 'petrol', 5, 2, 150, 'Versatile and reliable SUV'),
                                                                                                                                 ('029', 'truck', 'Chevrolet', 'Silverado', 2019, 'img29', 22000, 'petrol', 5, 2, 170, 'Strong and capable truck'),
                                                                                                                                 ('030', 'sedan', 'Mercedes', 'E-Class', 2021, 'img30', 10000, 'diesel', 5, 2, 230, 'Luxury and performance in one'),
                                                                                                                                 ('031', 'SUV', 'Audi', 'Q7', 2020, 'img31', 15000, 'diesel', 7, 1, 260, 'Spacious and luxurious SUV'),
                                                                                                                                 ('032', 'hatchback', 'Ford', 'Focus', 2018, 'img32', 27000, 'petrol', 5, 3, 90, 'Compact and fuel-efficient hatchback'),
                                                                                                                                 ('033', 'sedan', 'BMW', '5 Series', 2019, 'img33', 12000, 'petrol', 5, 2, 240, 'Luxury and performance sedan'),
                                                                                                                                 ('034', 'SUV', 'Toyota', 'Highlander', 2021, 'img34', 9000, 'petrol', 7, 1, 200, 'Spacious and family-friendly SUV'),
                                                                                                                                 ('035', 'sedan', 'Audi', 'A4', 2018, 'img35', 20000, 'petrol', 5, 2, 190, 'Sporty and luxurious sedan');
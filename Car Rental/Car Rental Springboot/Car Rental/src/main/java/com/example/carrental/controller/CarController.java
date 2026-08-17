package com.example.carrental.controller;

import com.example.carrental.entity.Car;
import com.example.carrental.exception.ResourceNotFoundException;
import com.example.carrental.service.CarService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "車輛管理 API", description = "提供車輛查詢、單筆車輛細節等操作")
@RestController
@RequestMapping("/api/cars")
@CrossOrigin(origins = "*") // 允許 PHP 前端跨網域存取 (CORS)
public class CarController {

    @Autowired
    private CarService carService;

    // 1. 查詢所有車輛 或 動態條件搜尋
    // 範例：GET /api/cars?type=sedan&brand=Toyota&keyword=camry
    @Operation(summary = "取得所有車輛列表", description = "查詢系統中所有的車輛資訊")
    @GetMapping
    public ResponseEntity<List<Car>> getCars(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String keyword) {

        List<Car> cars = carService.searchCars(type, brand, keyword);
        return ResponseEntity.ok(cars);
    }

    // 2. 根據 ID 查詢單一車輛細節
    // 範例：GET /api/cars/1
    @Operation(summary = "根據車號查詢單筆車輛", description = "傳入 id 取得該車輛詳細資料，若不存在則拋出 404")
    @GetMapping("/{id}")
    public ResponseEntity<Car> getCarById(@PathVariable Integer id) {
        Car car = carService.getCarById(id);
        if (car != null) {
            return ResponseEntity.ok(car);
        } else {
            // 直接拋出例外，全局 ExceptionHandler 會自動捕捉並包裝成 JSON 回傳
            throw new ResourceNotFoundException("找不到id為: " + id + " 的車輛資訊");
        }
    }

    // 3. 取得所有車輛種類 (給 PHP 下拉選單)
    // 範例：GET /api/cars/types
    @Operation(summary = "取得所有車輛種類", description = "取得所有車輛種類 (給 PHP 下拉選單)")
    @GetMapping("/types")
    public ResponseEntity<List<String>> getTypes() {
        return ResponseEntity.ok(carService.findDistinctTypes());
    }

    // 4. 取得所有品牌 (給 PHP 下拉選單)
    // 範例：GET /api/cars/brands
    @Operation(summary = "取得所有品牌", description = "取得所有品牌 (給 PHP 下拉選單)")
    @GetMapping("/brands")
    public ResponseEntity<List<String>> getBrands() {
        return ResponseEntity.ok(carService.findDistinctBrands());
    }

    // 5. 新增車輛 (後台管理用)
    // 範例：POST /api/cars
    @PostMapping
    public ResponseEntity<Car> createCar(@RequestBody Car car) {
        Car createdCar = carService.saveCar(car);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCar); // 回傳 HTTP 201
    }

    // 6. 修改車輛資訊 (後台管理用)
    // 範例：PUT /api/cars/1
    @PutMapping("/{id}")
    public ResponseEntity<Car> updateCar(@PathVariable Integer id, @RequestBody Car car) {
        car.setId(id);
        Car updatedCar = carService.saveCar(car);
        return ResponseEntity.ok(updatedCar);
    }

    // 7. 刪除車輛 (後台管理用)
    // 範例：DELETE /api/cars/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCar(@PathVariable Integer id) {
        carService.deleteCar(id);
        return ResponseEntity.noContent().build(); // 回傳 HTTP 244
    }
}
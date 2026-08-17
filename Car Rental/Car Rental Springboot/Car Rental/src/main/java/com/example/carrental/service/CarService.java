package com.example.carrental.service;

import com.example.carrental.entity.Car;
import com.example.carrental.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarService {

    @Autowired
    private CarRepository carRepository; // 注入 Repository

    // 1. 查詢所有車輛 (給 PHP 前端展示車輛列表)
    public List<Car> getAllCars() {
        return carRepository.findAll(); // 直接呼叫 JpaRepository 內建的 findAll()
    }

    // 2. 根據 ID 查詢單一車輛
    public Car getCarById(Integer id) {
        return carRepository.findById(id).orElse(null); // 呼叫 內建的 findById()
    }

    // 3. 新增或更新車輛
    public Car saveCar(Car car) {
        return carRepository.save(car); // 呼叫 內建的 save()
    }

    // 4. 刪除車輛
    public void deleteCar(Integer id) {
        carRepository.deleteById(id); // 呼叫 內建的 delete()
    }

    // 5. 取得不重複的車型，下拉選單使用
    public List<String> findDistinctTypes() {
        return carRepository.findDistinctTypes();
    }

    // 6. 取得不重複的品牌，下拉選單使用
    public List<String> findDistinctBrands() {
        return carRepository.findDistinctBrands();
    }

    // 7. 多條件動態搜尋 (支援 Category、Brand 與關鍵字搜尋)
    public List<Car> searchCars(String type, String brand, String keyword) {
        return carRepository.searchCars(type, brand, keyword);
    }
}
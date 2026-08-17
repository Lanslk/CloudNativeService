package com.example.carrental.repository;

import com.example.carrental.entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarRepository extends JpaRepository<Car, Integer> {

    // 1. 取得不重複的車型 (Category/Type) 清單，供下拉選單使用
    @Query("SELECT DISTINCT c.type FROM Car c")
    List<String> findDistinctTypes();

    // 2. 取得不重複的品牌 (Brand) 清單，供下拉選單使用
    @Query("SELECT DISTINCT c.brand FROM Car c")
    List<String> findDistinctBrands();

    // 3. 多條件動態搜尋 (支援 Category、Brand 與關鍵字搜尋)
    @Query("SELECT c FROM Car c WHERE " +
            "(:type IS NULL OR :type = '' OR c.type = :type) AND " +
            "(:brand IS NULL OR :brand = '' OR c.brand = :brand) AND " +
            "(:keyword IS NULL OR :keyword = '' OR " +
            " LOWER(c.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            " LOWER(c.type) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            " LOWER(c.carName) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Car> searchCars(
            @Param("type") String type,
            @Param("brand") String brand,
            @Param("keyword") String keyword
    );
}
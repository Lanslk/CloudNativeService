package com.example.carrental.service;

import com.example.carrental.dto.CreateOrderRequest;
import com.example.carrental.entity.Car;
import com.example.carrental.entity.Order;
import com.example.carrental.repository.CarRepository;
import com.example.carrental.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository; // 注入 Repository

    @Autowired
    private CarRepository carRepository;

    // 1. 查詢所有訂單
    public List<Order> getAllOrders() {
        return orderRepository.findAll(); // 直接呼叫 JpaRepository 內建的 findAll()
    }

    // 2. 根據 ID 查詢單一訂單
    public Order getOrderById(Integer id) {
        return orderRepository.findById(id).orElse(null); // 呼叫 內建的 findById()
    }

    // 3. 新增訂單
    public Order createOrder(Order order) {
        // 設定預設值
        if (order.getStatus() == null) {
            order.setStatus("unconfirmed");
        }
        Date now = new Date();
        order.setCreatedDate(now);
        order.setLastModifiedDate(now);

        return orderRepository.save(order);
    }

    // 4. 更新訂單狀態
    private Order updateOrderStatus(Integer id, String status) {
        Order order = getOrderById(id);
        if (order != null) {
            order.setStatus(status);
            order.setLastModifiedDate(new Date());
            return orderRepository.save(order);
        }
        return null;
    }

    // 5. 新增或更新訂單 (後台使用)
    public Order saveOrder(Order order) {
        return orderRepository.save(order); // 呼叫 內建的 save()
    }

    // 6. 刪除訂單 (後台使用)
    public void deleteOrder(Order order) {
        orderRepository.delete(order); // 呼叫 內建的 delete()
    }

    // 7. 確認訂單與更新庫存
    @Transactional // 核心：開啟事務，保證訂單確認與庫存更新要麼同時成功，要麼同時失敗
    public Order updateCarAndConfirmOrder(CreateOrderRequest request) {
        // 1. 根據 carNo 查出車輛 Entity
        Car car = carRepository.findById(request.getCarId())
                .orElseThrow(() -> new RuntimeException("找不到該車輛：" + request.getCarId()));

        // 2. 檢查庫存是否足夠
        if (car.getQuantity() < request.getCarNumber()) {
            throw new RuntimeException("庫存不足！剩餘庫存：" + car.getQuantity());
        }

        // 3. 更新庫存數量
        int updatedQuantity = car.getQuantity() - request.getCarNumber();
        car.setQuantity(updatedQuantity);

        // 4. 儲存更新後的車輛資料（JPA 會自動觸發 UPDATE SQL）
        carRepository.save(car);

        // 5. 建立並儲存訂單
        return updateOrderStatus(request.getOrderNo(), "CONFIRMED");
    }
}

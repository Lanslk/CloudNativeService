package com.example.carrental.service;

import com.example.carrental.entity.Order;
import com.example.carrental.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository; // 注入 Repository

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
    public Order updateOrderStatus(Integer id, String status) {
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
}

package com.example.carrental.controller;

import com.example.carrental.dto.CreateOrderRequest;
import com.example.carrental.entity.Order;
import com.example.carrental.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(
        origins = "*",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS}
) // 允許 PHP 前端跨網域存取 (CORS)
public class OrderController {

    @Autowired
    private OrderService orderService;

    // 1. 建立新訂單 (PHP 前端填寫完租車基本資料後發送 POST 請求)
    // 範例：POST /api/orders
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        Order savedOrder = orderService.createOrder(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedOrder); // 回傳 HTTP 201 與建立成功的訂單物件
    }

    // 2. 查詢所有訂單 (後台管理或歷史紀錄)
    // 範例：GET /api/orders
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    // 3. 根據訂單編號 (ordersNo) 查詢單一訂單 details
    // 範例：GET /api/orders/1
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Integer id) {
        Order order = orderService.getOrderById(id);
        if (order != null) {
            return ResponseEntity.ok(order);
        } else {
            return ResponseEntity.notFound().build(); // 找不到訂單時回傳 HTTP 404
        }
    }

    // 4. 更新訂單狀態與可承租車輛數
    // 範例：PATCH /api/orders/confirmOrder
    @PatchMapping("/confirmOrder")
    public ResponseEntity<Order> updateCarAndConfirmOrder(
            @RequestBody CreateOrderRequest request) {
        Order updatedOrder = orderService.updateCarAndConfirmOrder( request);
        if (updatedOrder != null) {
            return ResponseEntity.ok(updatedOrder);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
package com.example.carrental.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateOrderRequest {

    // === 車輛與預約資訊 ===
    @NotBlank(message = "車號id不能為空")
    private Integer carId;

//    @NotBlank(message = "車號不能為空")
//    private String carNo;

    @NotNull(message = "預約車輛數量不能為空")
    @Min(value = 1, message = "預約數量至少需要 1 台")
    private Integer carNumber;

    @NotBlank(message = "單號不能為空")
    private Integer ordersNo;


    // === Getters and Setters ===
    public Integer getCarId() { return carId; }
    public void setCarId(Integer carId) { this.carId = carId; }

//    public String getCarNo() { return carNo; }
//    public void setCarNo(String carNo) { this.carNo = carNo; }

    public Integer getCarNumber() { return carNumber; }
    public void setCarNumber(Integer carNumber) { this.carNumber = carNumber; }

    public Integer getOrderNo() { return ordersNo; }
    public void setOrdersNo(Integer ordersNo) { this.ordersNo = ordersNo; }

}
package com.example.carrental.entity;

import jakarta.persistence.*; // 若為 Spring Boot 2.x 請改為 javax.persistence.*
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "cars")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "car_no")
    private String carNo;

    private String type;
    private String brand;

    @Column(name = "car_name")
    private String carName;

    @Column(name = "model_year")
    private Integer modelYear;

    private String image;
    private Integer mileage;

    @Column(name = "fuel_type")
    private String fuelType;

    private Integer seats;
    private Integer quantity;
    private Integer price;
    private String description;

    @Column(name = "created_date")
    private Date createdDate;

    @Column(name = "last_modified_date")
    private Date lastModifiedDate;
}
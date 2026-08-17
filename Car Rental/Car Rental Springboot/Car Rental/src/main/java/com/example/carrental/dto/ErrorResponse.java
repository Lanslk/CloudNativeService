package com.example.carrental.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

public class ErrorResponse {
    @Schema(description = "錯誤發生時間", example = "2026-08-17T14:30:00")
    private LocalDateTime timestamp;

    @Schema(description = "HTTP 狀態碼", example = "404")
    private int status;

    @Schema(description = "HTTP 狀態簡述", example = "Not Found")
    private String error;

    @Schema(description = "詳細錯誤訊息", example = "找不到車號為 001 的車輛資訊")
    private String message;

    @Schema(description = "請求路徑", example = "/api/cars/001")
    private String path;

    public ErrorResponse(int status, String error, String message, String path) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
    }

    // Getters and Setters
    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }
}
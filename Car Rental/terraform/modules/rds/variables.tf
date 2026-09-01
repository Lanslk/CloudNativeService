variable "environment" {
  type        = string
  description = "Environment name"
}

variable "db_subnet_ids" {
  type        = list(string)
  description = "List of private DB subnet IDs"
}

variable "rds_security_group_id" {
  type        = string
  description = "Security Group ID for RDS"
}

variable "db_name" {
  type        = string
  description = "Name of the initial database"
  default     = "car_rental_db"
}

variable "db_username" {
  type        = string
  description = "Master username for RDS"
  default     = "admin"
}

variable "db_password" {
  type        = string
  description = "Master password for RDS"
  sensitive   = true # 標記為敏感資訊，Terraform log 不會明文印出
}
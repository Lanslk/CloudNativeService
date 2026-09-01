variable "aws_region" {
  description = "The AWS region to deploy resources into"
  type        = string
  default     = "ap-northeast-1"
}

variable "environment" {
  description = "Deployment Environment"
  type        = string
  default     = "dev"
}

variable "db_password" {
  type        = string
  description = "RDS Master Password"
  sensitive   = true
}
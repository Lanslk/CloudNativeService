variable "environment" {
  type        = string
  description = "Environment name"
}

variable "vpc_id" {
  type        = string
  description = "VPC ID"
}

variable "public_subnet_ids" {
  type        = list(string)
  description = "Public Subnet IDs for ALB"
}

variable "alb_security_group_id" {
  type        = string
  description = "Security Group ID for ALB"
}
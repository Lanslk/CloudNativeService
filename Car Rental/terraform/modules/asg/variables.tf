variable "environment" {
  type        = string
  description = "Environment name"
}

variable "app_private_subnet_ids" {
  type        = list(string)
  description = "App Private Subnet IDs for ASG"
}

variable "ec2_security_group_id" {
  type        = string
  description = "Security Group ID for EC2"
}

variable "target_group_arn" {
  type        = string
  description = "ALB Target Group ARN to attach ASG"
}

variable "ami_id" {
  type        = string
  description = "AMI ID to launch EC2 instances"
  default     = "" # 若留空可搭配 user_data 或預設 Amazon Linux 2023
}

variable "db_host" {
  type        = string
  description = "RDS Endpoint Hostname"
}

variable "db_password" {
  type        = string
  description = "RDS Password"
  sensitive   = true
}
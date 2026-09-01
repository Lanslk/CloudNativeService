variable "environment" {
  type        = string
  description = "Environment name (e.g. dev, prod)"
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for the VPC"
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  type        = list(string)
  description = "CIDR blocks for public subnets (ALB & NAT GW)"
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "app_private_subnet_cidrs" {
  type        = list(string)
  description = "CIDR blocks for private app subnets (EC2)"
  default     = ["10.0.11.0/24", "10.0.12.0/24"]
}

variable "db_private_subnet_cidrs" {
  type        = list(string)
  description = "CIDR blocks for private DB subnets (RDS)"
  default     = ["10.0.21.0/24", "10.0.22.0/24"]
}

variable "availability_zones" {
  type        = list(string)
  description = "List of Availability Zones"
  default     = ["ap-northeast-1a", "ap-northeast-1c"]
}
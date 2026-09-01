variable "vpc_id" {
  type        = string
  description = "The VPC ID where security groups will be created"
}

variable "environment" {
  type        = string
  description = "Environment name (e.g. dev, prod)"
}
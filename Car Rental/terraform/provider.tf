# 設定 Terraform 要求的版本與使用的 Provider (套件)
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0" # 使用 AWS Provider 5.x 版本
    }
  }
}

# 設定 AWS Provider 的區域 (Region)
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "CarRental"
      Environment = "Dev"
      ManagedBy   = "Terraform"
    }
  }
}
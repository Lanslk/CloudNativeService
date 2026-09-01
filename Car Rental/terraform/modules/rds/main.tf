# 1. DB Subnet Group (告訴 RDS 可以在哪些 Private Subnets 做 Multi-AZ)
resource "aws_db_subnet_group" "main" {
  name       = "car-rental-db-subnet-group-${var.environment}"
  subnet_ids = var.db_subnet_ids

  tags = {
    Name = "car-rental-db-subnet-group-${var.environment}"
  }
}

# 2. RDS MySQL Instance (Multi-AZ)
resource "aws_db_instance" "main" {
  allocated_storage      = 20
  max_allocated_storage  = 50 # 允許自動擴充至 50GB
  engine                 = "mysql"
  engine_version         = "8.0"
  instance_class         = "db.t3.micro" # 適合測試/開發生態的省錢規格
  db_name                = var.db_name
  username               = var.db_username
  password               = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [var.rds_security_group_id]

  # 高可用性設定 (Multi-AZ)
  multi_az               = true
  skip_final_snapshot    = true # 測試階段：刪除時不需要強制建立 Final Snapshot，方便快速測試清理

  tags = {
    Name = "car-rental-db-${var.environment}"
  }
}
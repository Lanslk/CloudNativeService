# 1. ALB Security Group (允許外網存取 HTTP/HTTPS)
resource "aws_security_group" "alb" {
  name        = "car-rental-alb-sg-${var.environment}"
  description = "Allow inbound HTTP/HTTPS traffic to ALB"
  vpc_id      = var.vpc_id

  ingress {
    description = "HTTP from anywhere"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS from anywhere"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "car-rental-alb-sg-${var.environment}"
  }
}

# 2. EC2 Security Group (只接受來自 ALB 的流量 & SSH)
resource "aws_security_group" "ec2" {
  name        = "car-rental-ec2-sg-${var.environment}"
  description = "Allow traffic from ALB and EIC Endpoint"
  vpc_id      = var.vpc_id

  # 允許來自 ALB 的 HTTP 流量 (假設 Web App 聽 80 或 8080)
  ingress {
    description     = "HTTP from ALB"
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  # SSH 流量 (允許 VPC 內部流量，用於 EC2 Instance Connect Endpoint)
  ingress {
    description = "SSH from VPC"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  egress {
    description = "Allow all outbound traffic (for docker pull, yum/apt update via NAT)"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "car-rental-ec2-sg-${var.environment}"
  }
}

# 3. RDS Security Group (只接受來自 EC2 的 MySQL 流量)
resource "aws_security_group" "rds" {
  name        = "car-rental-rds-sg-${var.environment}"
  description = "Allow MySQL traffic from EC2 instances only"
  vpc_id      = var.vpc_id

  ingress {
    description     = "MySQL from EC2 Security Group"
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2.id]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "car-rental-rds-sg-${var.environment}"
  }
}
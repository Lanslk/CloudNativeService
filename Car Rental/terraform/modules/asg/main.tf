# 1. 如果沒有指定自訂 AMI，預設拉取最新的 Amazon Linux 2023 AMI
data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }
}

# 2. Launch Template
resource "aws_launch_template" "app" {
  name_prefix   = "car-rental-lt-${var.environment}-"
  image_id      = var.ami_id != "" ? var.ami_id : data.aws_ami.amazon_linux_2023.id
  instance_type = "t3.micro"

  network_interfaces {
    associate_public_ip_address = false # Private Subnet 中的 Instance 不需要 Public IP
    security_groups             = [var.ec2_security_group_id]
  }

  # User Data：開機自動寫入環境變數並啟動 Docker / 應用程式
  user_data = base64encode(<<-EOF
              #!/bin/bash
              # 1. 更新系統套件並安裝 Docker 與 Git
              dnf update -y
              dnf install -y docker git

              # 2. 啟動 Docker 服務並設定開機自動啟動
              systemctl start docker
              systemctl enable docker

              # 3. 將預設使用者加入 docker 群組 (可選)
              usermod -aG docker ec2-user

              # 4. (如果使用 Docker Compose) 安裝 Docker Compose Plugin
              DOCKER_CONFIG=$${HOME}/.docker
              mkdir -p $DOCKER_CONFIG/cli-plugins
              curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 -o $DOCKER_CONFIG/cli-plugins/docker-compose
              chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose

              # 5. 下載 Git 專案並啟動應用程式
              cd /home/ec2-user
              # 若為 Public Repo 直接 clone，Private Repo 可帶 Token 或先從 S3/Secrets Manager 拉取 key
              git clone https://github.com/Lanslk/CloudNativeService.git app
              cd app

              # 6. 設定環境變數並啟動 Docker 服務
              export DB_HOST="${var.db_host}"
              export DB_PASSWORD="${var.db_password}"

              # 使用 Docker Compose 啟動服務，或是直接 docker run
              docker-compose up -d --build
              EOF
  )

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "car-rental-asg-ec2-${var.environment}"
    }
  }

  lifecycle {
    create_before_destroy = true
  }
}

# 3. Auto Scaling Group
resource "aws_autoscaling_group" "app" {
  name_prefix         = "car-rental-asg-${var.environment}-"
  vpc_zone_identifier = var.app_private_subnet_ids
  target_group_arns   = [var.target_group_arn]

  min_size         = 1
  max_size         = 3
  desired_capacity = 2 # 預設開 2 台跨 AZ

  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }

  health_check_type         = "ELB" # 使用 ALB Target Group 的 Health Check 判定健康狀態
  health_check_grace_period = 300

  lifecycle {
    create_before_destroy = true
  }
}

# 4. EC2 Instance Connect Endpoint (方便 SSH 進入 Private Subnet 的 EC2)
resource "aws_ec2_instance_connect_endpoint" "eice" {
  subnet_id          = var.app_private_subnet_ids[0]
  security_group_ids = [var.ec2_security_group_id]

  tags = {
    Name = "car-rental-eice-${var.environment}"
  }
}
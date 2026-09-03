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
              # 1. 更新系統並安裝 Docker 與 Git
              dnf update -y
              dnf install -y docker git

              # 2. 啟動 Docker 服務
              systemctl start docker
              systemctl enable docker
              usermod -aG docker ec2-user

              # 3. 手動安裝最新版 Docker Buildx Plugin
              mkdir -p /usr/libexec/docker/cli-plugins
              curl -SL "https://github.com/docker/buildx/releases/download/v0.17.1/buildx-v0.17.1.linux-amd64" -o /usr/libexec/docker/cli-plugins/docker-buildx
              chmod +x /usr/libexec/docker/cli-plugins/docker-buildx

              # 4. 安裝獨立版 docker-compose
              curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
              chmod +x /usr/local/bin/docker-compose
              ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

              # 5. 解除 Git 安全目錄限制
              git config --global --add safe.directory "*"

              # 6. Clone 專案庫
              cd /home/ec2-user
              git clone https://github.com/Lanslk/CloudNativeService.git app

              # 7. 寫入環境變數至 .env 檔
              ENV_FILE="/home/ec2-user/app/Car Rental/.env"
              echo "BACKEND_PORT=8080" > "$ENV_FILE"
              echo "FRONTEND_PORT=80" >> "$ENV_FILE"
              echo "SPRING_DATASOURCE_URL=jdbc:mysql://${var.db_host}/car_rental_db?useSSL=false&allowPublicKeyRetrieval=true" >> "$ENV_FILE"
              echo "SPRING_DATASOURCE_USERNAME=admin" >> "$ENV_FILE"
              echo "SPRING_DATASOURCE_PASSWORD=${var.db_password}" >> "$ENV_FILE"
              echo "BACKEND_URL=http://localhost:8080" >> "$ENV_FILE"

              # 8. 啟動容器 (使用 -f 指定檔案路徑)
              /usr/local/bin/docker-compose -f "/home/ec2-user/app/Car Rental/docker-compose.yml" up -d --build
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
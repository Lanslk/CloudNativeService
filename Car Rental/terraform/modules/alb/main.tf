# 1. Application Load Balancer
resource "aws_lb" "main" {
  name               = "car-rental-alb-${var.environment}"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.alb_security_group_id]
  subnets            = var.public_subnet_ids

  tags = {
    Name = "car-rental-alb-${var.environment}"
  }
}

# 2. Target Group (指向 EC2 Web 服務)
resource "aws_lb_target_group" "app" {
  name        = "car-rental-tg-${var.environment}"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "instance"

  health_check {
    enabled             = true
    path                = "/" # 依據你的 Web 服務根路徑或健康檢查路徑調整
    port                = "80"
    protocol            = "HTTP"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
    matcher             = "200-399"
  }

  tags = {
    Name = "car-rental-tg-${var.environment}"
  }
}

# 3. ALB Listener (Port 80 轉發至 Target Group)
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}
# ------------------------------------------------------------------------------
# 1. 取得 Route 53 Hosted Zone 資訊
# ------------------------------------------------------------------------------
data "aws_route53_zone" "main" {
  name         = "lenidv.com"
  private_zone = false
}

# ------------------------------------------------------------------------------
# 2. ACM 憑證申請與自動 DNS 驗證
# ------------------------------------------------------------------------------
# 向 ACM 請求憑證
resource "aws_acm_certificate" "cert" {
  domain_name       = "lenidv.com"
  validation_method = "DNS"

  subject_alternative_names = [
    "*.lenidv.com"
  ]

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name        = "lenidv-ssl-certificate"
    Environment = "production"
  }
}

# 自動在 Route 53 新增 ACM 要求的驗證 CNAME 記錄
resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.main.zone_id
}

# 等待 ACM 憑證完成 DNS 驗證 (發出憑證)
resource "aws_acm_certificate_validation" "cert_validation" {
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}

# ------------------------------------------------------------------------------
# 3. ALB 安全組 (Security Group) 開放 Port 443
# ------------------------------------------------------------------------------
# 已在security_group.main.tf設定

# ------------------------------------------------------------------------------
# 4. ALB 監聽器設定 (HTTPS 443 & HTTP 80 Redirect)
# ------------------------------------------------------------------------------
# HTTPS 443 監聽器 (綁定憑證與導向 Target Group)
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.main.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = aws_acm_certificate_validation.cert_validation.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}

# HTTP 80 監聽器 (強制 301 重定向至 HTTPS 443)
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

# ------------------------------------------------------------------------------
# 5. Route 53 A 記錄 (Alias 將 lenidv.com 指向 ALB)
# ------------------------------------------------------------------------------
# 頂層網域 (lenidv.com)
resource "aws_route53_record" "apex" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "lenidv.com"
  type    = "A"
  allow_overwrite = true # 👈 讓 Terraform 可以覆蓋已存在的舊 A 記錄

  alias {
    name                   = aws_lb.main.dns_name
    zone_id                = aws_lb.main.zone_id
    evaluate_target_health = true
  }
}

# 子網域 (www.lenidv.com，可選)
resource "aws_route53_record" "www" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "www.lenidv.com"
  type    = "A"
  allow_overwrite = true

  alias {
    name                   = aws_lb.main.dns_name
    zone_id                = aws_lb.main.zone_id
    evaluate_target_health = true
  }
}
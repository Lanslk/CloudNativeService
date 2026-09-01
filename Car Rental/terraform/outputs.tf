output "alb_dns_name" {
  description = "The public DNS name of the ALB to access the website"
  value       = module.alb.alb_dns_name
}

output "rds_endpoint" {
  description = "The database connection endpoint"
  value       = module.rds.db_instance_endpoint
}
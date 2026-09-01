module "network" {
  source      = "./modules/network"
  environment = var.environment
}

module "security_group" {
  source      = "./modules/security_group"
  environment = var.environment
  vpc_id      = module.network.vpc_id # 串接 Network Module 產生的 VPC ID
}

module "rds" {
  source                = "./modules/rds"
  environment           = var.environment
  db_subnet_ids         = module.network.db_private_subnet_ids
  rds_security_group_id = module.security_group.rds_security_group_id
  db_password           = var.db_password
}

module "alb" {
  source                = "./modules/alb"
  environment           = var.environment
  vpc_id                = module.network.vpc_id
  public_subnet_ids     = module.network.public_subnet_ids
  alb_security_group_id = module.security_group.alb_security_group_id
}

module "asg" {
  source                 = "./modules/asg"
  environment            = var.environment
  app_private_subnet_ids = module.network.app_private_subnet_ids
  ec2_security_group_id  = module.security_group.ec2_security_group_id
  target_group_arn       = module.alb.target_group_arn
  db_host                = module.rds.db_instance_address
  db_password            = var.db_password
  # ami_id                = "ami-0123456789abcdef0" # 若要使用 Phase 6 打包的 AMI，可以在此填入
}
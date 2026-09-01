# 1. VPC 建立
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "car-rental-vpc-${var.environment}"
  }
}

# 2. Internet Gateway
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "car-rental-igw-${var.environment}"
  }
}

# 3. Public Subnets (跨 2 個 AZ 用於 ALB)
resource "aws_subnet" "public" {
  count                   = length(var.public_subnet_cidrs)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "car-rental-public-subnet-${count.index + 1}"
  }
}

# 4. App Private Subnets (跨 2 個 AZ 用於 EC2)
resource "aws_subnet" "app_private" {
  count             = length(var.app_private_subnet_cidrs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.app_private_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name = "car-rental-app-private-subnet-${count.index + 1}"
  }
}

# 5. DB Private Subnets (跨 2 個 AZ 用於 RDS)
resource "aws_subnet" "db_private" {
  count             = length(var.db_private_subnet_cidrs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.db_private_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name = "car-rental-db-private-subnet-${count.index + 1}"
  }
}

# 6. Elastic IP & NAT Gateway (放置於第一個 Public Subnet)
resource "aws_eip" "nat" {
  domain     = "vpc"
  depends_on = [aws_internet_gateway.gw]

  tags = {
    Name = "car-rental-nat-eip-${var.environment}"
  }
}

resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public[0].id

  tags = {
    Name = "car-rental-nat-gw-${var.environment}"
  }

  depends_on = [aws_internet_gateway.gw]
}

# 7. Route Tables
# Public Route Table (對外走 IGW)
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = {
    Name = "car-rental-public-rt"
  }
}

resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# Private Route Table (對外走 NAT GW，讓 Private EC2 可以 update 套件)
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }

  tags = {
    Name = "car-rental-private-rt"
  }
}

resource "aws_route_table_association" "app_private" {
  count          = length(aws_subnet.app_private)
  subnet_id      = aws_subnet.app_private[count.index].id
  route_table_id = aws_route_table.private.id
}

resource "aws_route_table_association" "db_private" {
  count          = length(aws_subnet.db_private)
  subnet_id      = aws_subnet.db_private[count.index].id
  route_table_id = aws_route_table.private.id
}
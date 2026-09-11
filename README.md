# 🚗 車輛租賃雲原生微服務架構與自動化 CI/CD 流水線

> 基於 **AWS** 打造的企業級、高可用性與容錯雲端基礎設施。專案透過 **Terraform** 實現基礎設施即代碼 (IaC)，並結合 **GitHub Actions**、**Amazon ECR** 與 **AWS Systems Manager (SSM)** 實現全自動化無縫部署。

---

## 📐 架構總覽

本專案展現了具備安全性、可擴展性與高可用性的生產環境 AWS 雲端架構。系統採用雙可用區 (Multi-AZ) 將應用層隔離於公有與私有子網中，並全面透過 AWS Systems Manager 進行零 SSH Port 暴露的遠端自動化維運。

![AWS 架構圖](./CarRentalService%20AWS%20architecture%20diagram-v3.jpg)

### 🌟 架構核心亮點：
- **高可用性與安全導向**：採用雙可用區 (Multi-AZ) 與公私有子網隔離設計。EC2 應用伺服器與 RDS 資料庫均隱藏於私有子網（Private Subnets），僅能透過 ALB 及 NAT Gateway 對外連線。
- **基礎設施即代碼 (IaC)**：100% 模組化 Terraform 腳本，統一管理網路 (VPC)、負載平衡 (ALB)、自動擴充 (ASG)、資料庫 (RDS) 及容器儲存庫 (ECR)。
- **零 SSH 暴露維運**：完全關閉 22 號 Port，所有維運指令與自動化部署皆透過 AWS SSM Agent 與 IAM Role 安全執行。
- **高效能部署管線**：容器化的 Spring Boot 後端直接推送到 ECR，並在數秒內自動重啟部署至 EC2 Auto Scaling 群組。

---

## 🛠️ 技術棧與工具

- **雲端平台 (Cloud)**：AWS (VPC, EC2, ASG, ALB, RDS Multi-AZ, Route 53, ACM, ECR, SSM)
- **基礎設施即代碼 (IaC)**：Terraform
- **CI/CD 與自動化**：GitHub Actions, AWS SSM
- **容器化技術**：Docker, Docker Compose
- **後端與資料庫**：Java 21, Spring Boot, Maven, MySQL

---

## 🔄 CI/CD 自動化部署流程

```text
[ 開發者 ] --( Git Push )--> [ GitHub 程式碼庫 ]
                                    │
                            ( GitHub Actions )
                                    │
         ┌──────────────────────────┴──────────────────────────┐
         ▼                                                     ▼
 1. 打包 Jar & Docker Image                             2. 觸發 SSM 指令
         │                                                     │
         ▼                                                     ▼
 [ Amazon ECR ] <─────────────────────────────────── [ AWS SSM Agent ]
                                                               │
                                                       3. Docker Pull & 重啟
                                                               │
                                                               ▼
                                                   [ 私有子網 EC2 伺服器 ]
```

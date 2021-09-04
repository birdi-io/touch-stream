terraform {
  required_providers {
    vultr = {
      source = "vultr/vultr"
      version = "2.4.1"
    }
  }
}

variable "VULTR_API_KEY" {
  sensitive = true
}

provider "vultr" {
  api_key = var.VULTR_API_KEY
  rate_limit = 700
  retry_limit = 3
}

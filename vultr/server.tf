# Vultr APIs https://www.vultr.com/api/#operation/list-os
# Instance Resource https://registry.terraform.io/providers/vultr/vultr/latest/docs/resources/instance
# Instance Resource Terrafrom Provider source code https://github.com/vultr/terraform-provider-vultr/blob/master/vultr/resource_vultr_instance.go

resource "vultr_instance" "my_instance" {
  plan = "vc2-1c-1gb"
  region = "syd"
  os_id = "477" # Debian 11
  label = "fit-touch"
  tag = "fit-touch"
  hostname = "fit-touch"
  enable_ipv6 = false
  backups = "disabled"
  ddos_protection = false
  activation_email = false
  user_data = file("cloud-init.yaml")
}

# data "cloudinit_config" "main" {
#   gzip = false
#   base64_encode = true

#   part {
#     filename     = "cloud-init.yaml"
#     content_type = "text/cloud-config"
#     content      = file("cloud-init.yaml")
#   }
# }

# Vultr APIs https://www.vultr.com/api/#operation/list-os

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
  user_data = data.cloudinit_config.main.rendered
}

data "cloudinit_config" "main" {
  gzip = false
  base64_encode = true

  part {
    filename     = "cloud-init.yaml"
    content_type = "text/cloud-config"
    content      = file("cloud-init.yaml")
  }
}

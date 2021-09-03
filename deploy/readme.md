## API Deployment (Vultr)
Running a containerised API/DB on a single instance.
*Prerequisites:* Terraform, Vultr account

```bash
cd vultr
terraform init
terraform apply
# Install Podman
# Build docker registry with self-signed
# Building and pushing docker image
docker login $server_ip:443
export VER=$(git log --pretty=format:"%h" | head -1)
docker build --build-arg NPM_TOKEN=${NPM_TOKEN} -t $server_ip:443/jtc:$VER .
docker run --rm -it -p 8000:8000 $server_ip:443/jtc:$VER ## Test run
docker push $server_ip:443/jtc:$VER
# Config setup
scp config.json $server_ip:/srv/config.json
# Systemd services
scp mongodb.unit $server_ip:/etc/systemd
scp api.unit $server_ip:/etc/systemd
# LetsEncrypt
# Run
```

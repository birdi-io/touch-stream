## API Deployment (Vultr)
Running a containerised API/DB on a single instance.
*Prerequisites:* Terraform, Vultr account

```bash
# Provision infrastructure
cd vultr
# create cloud-init file
cp cloud-init.sample.yaml cloud-init.yaml
terraform init
terraform apply
terraform show

export server_ip=xyz
# Install Docker on instance
# https://docs.docker.com/engine/install/debian/

# Move required files to server
scp -r ./deploy/* $server_ip:/home/daniel
ssh $server_ip "sudo mv /home/daniel/*.service /etc/systemd/system/"
scp config.yaml $server_ip:/srv/config.yaml
ssh $server_ip "sudo mv /home/daniel/* /srv"

# Create Docker network
sudo docker network create touch-stream

# Build and push docker image
./build.sh

# Enable Mongo systemd unit
docker volume create mongodbdata
sudo systemctl enable mongo
sudo systemctl start mongo
sudo systemctl status mongo

# Create production user
echo "Creating global user"
export MONGO_PASS=abcde1235
docker exec mongo mongosh touch-prod \
  -u prod -p prod \
  --authenticationDatabase admin \
  --eval "db.createUser({user:'prod',pwd:'$MONGO_PASS',roles:['readWrite','dbAdmin']})"

# Enable API systemd unit
sudo systemctl enable api
sudo systemctl start api
sudo systemctl status api

# LetsEncrypt + Nginx + SSL
# Ensure cloudflare.ini is filled out
./generate-cert.sh
sudo systemctl enable nginx
sudo systemctl start nginx
sudo systemctl status nginx

# TODO: Implement SSL renewals
```

#!/bin/bash

# Setup Script for MultiWork Production VM
# Usage: ./setup_vm.sh
# Tested on Ubuntu 20.04 / 22.04

set -e

echo ">>> Updating system packages..."
sudo apt-get update && sudo apt-get upgrade -y

echo ">>> Installing dependencies (Git, Curl, CA-Certificates)..."
sudo apt-get install -y git curl ca-certificates gnupg lsb-release

# Install Docker if not exists
if ! command -v docker &> /dev/null; then
    echo ">>> Installing Docker..."
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
else
    echo ">>> Docker is already installed."
fi

# Enable Docker service
sudo systemctl enable docker
sudo systemctl start docker

# Add current user to docker group (to avoid sudo for docker commands)
# You will need to re-login for this to take effect!
sudo usermod -aG docker $USER

echo ">>> Setup Complete!"
echo ">>> PLEASE RE-LOGIN (logout and ssh back in) to use docker without sudo."

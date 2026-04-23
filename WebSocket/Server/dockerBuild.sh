#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "🚀 Starting build for roymond/deathcounter-wss-server..."

# Build the image
docker build -t roymond/deathcounter-wss-server:latest .

echo "✅ Build successful! Pushing to Docker Hub..."

# Push the image
docker push roymond/deathcounter-wss-server:latest

echo "🎉 Done! Image is live."
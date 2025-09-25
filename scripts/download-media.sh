#!/bin/bash

# Download and extract media assets from GitHub releases
# This script runs during Railway build to get the actual image files

set -e

echo "🎬 Downloading media assets from GitHub releases..."

# Create assets directory if it doesn't exist
mkdir -p client/public/assets

# Get the latest release and download the media archives
REPO_URL="https://api.github.com/repos/Flufscut/FreakFest2/releases/latest"
LATEST_RELEASE=$(curl -s "$REPO_URL")

echo "📡 Fetching release info..."

# Extract download URLs for each archive
FLYERS_URL=$(echo "$LATEST_RELEASE" | grep -o '"browser_download_url": "[^"]*flyers\.tar\.gz"' | cut -d'"' -f4)
GALLERY_URL=$(echo "$LATEST_RELEASE" | grep -o '"browser_download_url": "[^"]*gallery-freakfest\.tar\.gz"' | cut -d'"' -f4)
VENUE_URL=$(echo "$LATEST_RELEASE" | grep -o '"browser_download_url": "[^"]*venue\.tar\.gz"' | cut -d'"' -f4)

echo "📥 Downloading and extracting flyers..."
if [ -n "$FLYERS_URL" ]; then
    curl -L "$FLYERS_URL" -o flyers.tar.gz
    tar -xzf flyers.tar.gz -C client/public/assets/
    rm flyers.tar.gz
    echo "✅ Flyers extracted"
else
    echo "⚠️  Flyers archive not found in latest release"
fi

echo "📥 Downloading and extracting gallery..."
if [ -n "$GALLERY_URL" ]; then
    curl -L "$GALLERY_URL" -o gallery.tar.gz
    tar -xzf gallery.tar.gz -C client/public/assets/
    rm gallery.tar.gz
    echo "✅ Gallery extracted"
else
    echo "⚠️  Gallery archive not found in latest release"
fi

echo "📥 Downloading and extracting venue..."
if [ -n "$VENUE_URL" ]; then
    curl -L "$VENUE_URL" -o venue.tar.gz
    tar -xzf venue.tar.gz -C client/public/assets/
    rm venue.tar.gz
    echo "✅ Venue extracted"
else
    echo "⚠️  Venue archive not found in latest release"
fi

echo "🎉 Media assets downloaded and extracted successfully!"
echo "📂 Available assets:"
find client/public/assets -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" -o -name "*.webp" | head -10
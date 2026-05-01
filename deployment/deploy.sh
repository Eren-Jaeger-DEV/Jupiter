#!/bin/bash

echo "🚀 Starting Deployment for Jupiter Hub..."

# 1. Update system and install PM2 if not installed
if ! command -v pm2 &> /dev/null
then
    echo "📦 Installing PM2 globally..."
    sudo npm install -g pm2
fi

# 2. Clone/Pull Jupiter
if [ -d "Jupiter" ]; then
    echo "🔄 Updating Jupiter..."
    cd Jupiter
    git pull
    npm install
    cd ..
else
    echo "📥 Cloning Jupiter..."
    git clone https://github.com/Eren-Jaeger-DEV/Jupiter.git
    cd Jupiter
    npm install
    cd ..
fi

# 3. Clone/Pull Europa
if [ -d "Europa" ]; then
    echo "🔄 Updating Europa..."
    cd Europa
    git pull
    npm install
    cd ..
else
    echo "📥 Cloning Europa..."
    git clone https://github.com/Eren-Jaeger-DEV/Europa.git
    cd Europa
    npm install
    cd ..
fi

echo ""
echo "⚠️ IMPORTANT: Please ensure .env files are created in both Jupiter/ and Europa/ directories!"
echo "Once .env files are manually added, run:"
echo "pm2 start ecosystem.config.js && pm2 save"
echo ""
echo "✅ Deployment script finished."

Write-Host "🚀 Setting up Mobile Repair Shop Project..." -ForegroundColor Cyan

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Generate Prisma client
Write-Host "🔧 Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate

# Push database schema
Write-Host "📡 Pushing database schema..." -ForegroundColor Yellow
npx prisma db push

# Seed the database
Write-Host "🌱 Seeding database..." -ForegroundColor Yellow
npx prisma db seed

# Start development server
Write-Host "🚀 Starting development server..." -ForegroundColor Green
Write-Host "👉 Open http://localhost:3000 in your browser" -ForegroundColor Green
npm run dev

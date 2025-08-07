@echo off
echo 🚀 Setting up Mobile Repair Shop Project...

echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo 🔧 Generating Prisma client...
call npx prisma generate

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to generate Prisma client
    pause
    exit /b 1
)

echo 📡 Pushing database schema...
call npx prisma db push

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to push database schema
    pause
    exit /b 1
)

echo 🌱 Seeding database...
call npx prisma db seed

if %ERRORLEVEL% NEQ 0 (
    echo ⚠️ Warning: Failed to seed database. You may need to run this manually.
)

echo 🚀 Starting development server...
echo 👉 Open http://localhost:3000 in your browser
call npm run dev

pause

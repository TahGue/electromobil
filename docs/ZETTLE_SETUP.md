# 🏪 iZettle/Zettle POS Integration Setup Guide

This guide will help you integrate your iZettle (now Zettle by PayPal) POS system with your mobile repair shop webapp.

## 📋 Prerequisites

1. **Active Zettle Account**: You need a working Zettle business account
2. **API Access**: Register for Zettle Developer access
3. **Environment Setup**: Node.js and your webapp running

## 🔧 Step 1: Register for Zettle Developer Access

1. **Visit Zettle Developer Portal**:
   - Go to [developer.zettle.com](https://developer.zettle.com)
   - Sign in with your Zettle business account

2. **Create a New Application**:
   - Click "Create App" or "New Application"
   - Fill in your app details:
     - **App Name**: "Mobile Repair Shop Integration"
     - **Description**: "POS integration for mobile repair services"
     - **Redirect URI**: `http://localhost:3000/api/zettle/callback` (for development)

3. **Get Your API Credentials**:
   - After creating the app, you'll receive:
     - **Client ID** (public identifier)
     - **Client Secret** (keep this secure!)

## 🔐 Step 2: Configure Environment Variables

1. **Copy the example environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Add your Zettle credentials to `.env`**:
   ```env
   # Zettle (iZettle) POS Integration
   ZETTLE_CLIENT_ID="your_actual_client_id_here"
   ZETTLE_CLIENT_SECRET="your_actual_client_secret_here"
   ZETTLE_API_URL="https://oauth.zettle.com"
   ZETTLE_ENVIRONMENT="sandbox"
   ```

3. **For Production** (when ready):
   ```env
   ZETTLE_ENVIRONMENT="production"
   ```

## 🚀 Step 3: Test the Integration

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Access the POS Management**:
   - Go to your admin panel: `http://localhost:3000/admin`
   - Click on **"POS-system"** in the navigation
   - You'll see the Zettle login interface

3. **Authenticate with Zettle**:
   - Enter your Zettle account credentials (email/password)
   - Click "Anslut till Zettle"
   - If successful, you'll see your POS dashboard

## 📊 Available Features

### ✅ What's Already Implemented

1. **Authentication**:
   - Secure OAuth 2.0 login with Zettle
   - Token management and refresh

2. **Product Management**:
   - View all products from your Zettle inventory
   - Sync local services with Zettle products
   - Automatic product creation and updates

3. **Transaction History**:
   - View recent transactions (last 30 days)
   - Transaction details and status
   - Revenue calculations

4. **Dashboard Analytics**:
   - Total products count
   - Recent transactions summary
   - Revenue overview
   - Last sync timestamp

### 🔄 Synchronization Features

- **One-way sync**: Local services → Zettle products
- **Automatic mapping**: Uses service ID as external reference
- **Price conversion**: Handles SEK currency conversion
- **Batch operations**: Efficient bulk updates

## 🛠️ API Endpoints

Your webapp now includes these Zettle API endpoints:

- `POST /api/zettle/auth` - Authenticate with Zettle
- `GET /api/zettle/products` - Fetch products from Zettle
- `POST /api/zettle/products` - Sync local services to Zettle
- `GET /api/zettle/transactions` - Get transaction history

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` to version control
2. **API Credentials**: Keep Client Secret secure
3. **Admin Only**: POS features are restricted to admin users
4. **Token Storage**: Tokens are handled securely in memory

## 🐛 Troubleshooting

### Common Issues:

1. **"Authentication Failed"**:
   - Check your Zettle credentials
   - Verify Client ID and Secret are correct
   - Ensure your Zettle account has API access

2. **"API Request Failed"**:
   - Check internet connection
   - Verify API URL is correct
   - Check if Zettle service is operational

3. **"Products Not Syncing"**:
   - Ensure you have active services in your webapp
   - Check that services have valid names and prices
   - Verify Zettle account has product management permissions

### Debug Steps:

1. **Check Environment Variables**:
   ```bash
   # In your terminal
   echo $ZETTLE_CLIENT_ID
   echo $ZETTLE_ENVIRONMENT
   ```

2. **Check Server Logs**:
   - Look for error messages in your development console
   - API errors are logged with detailed information

3. **Test API Endpoints**:
   - Use browser developer tools to inspect network requests
   - Check response status codes and error messages

## 📈 Next Steps & Enhancements

### Potential Future Features:

1. **Real-time Sync**:
   - Webhook integration for instant updates
   - Automatic inventory updates

2. **Advanced Reporting**:
   - Custom date range reports
   - Export functionality
   - Sales analytics

3. **Inventory Management**:
   - Stock level tracking
   - Low stock alerts
   - Automatic reordering

4. **Customer Integration**:
   - Customer data sync
   - Purchase history
   - Loyalty programs

## 📞 Support

If you encounter issues:

1. **Check Zettle Developer Documentation**: [developer.zettle.com](https://developer.zettle.com)
2. **Review API Status**: Check Zettle service status
3. **Contact Zettle Support**: For API-specific issues

## 🎯 Usage Tips

1. **Regular Syncing**: Sync products regularly to keep inventory updated
2. **Monitor Transactions**: Check transaction history for payment reconciliation
3. **Backup Data**: Keep local backups of important business data
4. **Test First**: Always test in sandbox environment before production

---

**🎉 Congratulations!** Your mobile repair shop now has professional POS integration with Zettle. You can manage products, track sales, and synchronize your services seamlessly.

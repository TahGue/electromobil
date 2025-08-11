# Google Reviews Integration Setup Guide

## 🎯 Overview
Your mobile repair shop website now has Google Reviews integration! This will display real Google Business reviews directly on your homepage to build trust and credibility.

## 📋 Setup Steps

### Step 1: Get Google Places API Key

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create or Select Project**
   - Create a new project or select existing one
   - Name it something like "Mobile Repair Shop Reviews"

3. **Enable Places API**
   - Go to "APIs & Services" → "Library"
   - Search for "Places API"
   - Click "Enable"

4. **Create API Key**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the API key (keep it secure!)

5. **Restrict API Key (Recommended)**
   - Click on your API key to edit
   - Under "API restrictions", select "Restrict key"
   - Choose "Places API"
   - Under "Website restrictions", add your domain

### Step 2: Find Your Google Business Place ID

**Method 1: Using Place ID Finder**
1. Go to: https://developers.google.com/maps/documentation/places/web-service/place-id
2. Search for your business name and location
3. Copy the Place ID (starts with something like "ChIJ...")

**Method 2: Using Google My Business**
1. Go to your Google Business Profile
2. Look at the URL - the Place ID is in there
3. Or use Google Maps, search your business, and check the URL

**Method 3: Manual Search**
1. Go to Google Maps
2. Search for your business
3. Right-click on your business marker
4. The Place ID will be shown in the context menu

### Step 3: Add Environment Variables

Add these to your `.env` file:

```bash
# Google Reviews Integration
GOOGLE_PLACES_API_KEY="your_actual_api_key_here"
GOOGLE_PLACE_ID="your_actual_place_id_here"
```

### Step 4: Deploy and Test

1. **Test Locally**
   ```bash
   npm run dev
   ```
   - Visit your homepage
   - Check if reviews load in the "Vad våra kunder säger" section

2. **Deploy to Production**
   - Add the environment variables to Vercel
   - Deploy your changes
   - Test on your live website

## 🎨 Customization Options

### Display Settings
You can customize the Google Reviews component by editing the props in `app/page.tsx`:

```tsx
<GoogleReviews 
  maxReviews={6}        // Number of reviews to show initially
  showOverallRating={true}  // Show overall rating and link to Google
  className="my-8"      // Additional CSS classes
/>
```

### Styling
The component uses Tailwind CSS and matches your site's design. You can customize:
- Colors in `components/google-reviews.tsx`
- Layout and spacing
- Review card design
- Button styles

## 🔧 Features Included

✅ **Real-time Google Reviews** - Fetches actual reviews from Google
✅ **Swedish Localization** - Time formats and UI text in Swedish
✅ **Responsive Design** - Works on mobile, tablet, and desktop
✅ **Star Ratings** - Visual star displays (★★★★☆)
✅ **Review Expansion** - "Läs mer" for long reviews
✅ **Overall Rating Display** - Shows your business rating and total reviews
✅ **Link to Google** - "Se alla recensioner" button
✅ **Caching** - Reviews cached for 1 hour for performance
✅ **Error Handling** - Graceful fallbacks if API fails

## 🚨 Important Notes

### API Limits
- Google Places API has usage limits
- Free tier: 100,000 requests per month
- Each page load = 1 API request (cached for 1 hour)

### Review Updates
- Reviews update automatically when cache expires (1 hour)
- New reviews will appear on your site within 1 hour

### Privacy & Terms
- Make sure to comply with Google's Terms of Service
- Reviews are public data from Google Business Profile

## 🎯 What Customers Will See

1. **"Vad våra kunder säger" section** on your homepage
2. **Overall rating** with stars (e.g., 4.8 ★★★★★)
3. **Number of reviews** (e.g., "127 recensioner")
4. **Individual review cards** with:
   - Customer name and photo
   - Star rating
   - Review text
   - Time posted (in Swedish)
5. **"Se alla recensioner" button** linking to your Google Business Profile

## 🔍 Troubleshooting

### Reviews Not Loading?
1. Check API key is correct in `.env`
2. Check Place ID is correct
3. Verify Places API is enabled in Google Cloud Console
4. Check browser console for error messages

### Wrong Business Showing?
- Double-check your Place ID
- Make sure it matches your exact business location

### API Quota Exceeded?
- Check your Google Cloud Console usage
- Consider upgrading if you have high traffic

## 💡 Pro Tips

1. **Encourage Reviews**: Ask satisfied customers to leave Google reviews
2. **Respond to Reviews**: Reply to reviews on Google to show engagement
3. **Monitor Performance**: Check Google Cloud Console for API usage
4. **Update Regularly**: Keep your Google Business Profile updated

---

Your Google Reviews integration is now ready! This will significantly boost trust and credibility for your mobile repair shop. 🌟

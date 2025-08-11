# Admin Image Management Guide

## Overview
This guide explains how to manage images for your mobile repair shop website through the admin panel. The system allows you to organize images by categories and manage the hero slider on your homepage.

## Accessing Image Management

1. **Login to Admin Panel**: Navigate to `/admin` and sign in with your admin credentials
2. **Go to Images Section**: Click "Bilder" in the left sidebar
3. **You'll see the Image Management Dashboard** with upload form and image gallery

## Image Categories

### Hero & Main Sections
- **Hero Slider**: Main slideshow images on homepage
- **Tjänster**: Service page images
- **Omdömen**: Testimonial section images
- **Galleri**: General gallery images
- **Bokning**: Booking page images
- **Kontakt**: Contact page images
- **Trust-bar**: Trust indicators and badges

### Core Repair Services
- **Skärmbyte**: Screen replacement images
- **Batteribyte**: Battery replacement images
- **Vattenskada**: Water damage repair images
- **Laddningsport**: Charging port repair images
- **Kamerareparation**: Camera repair images
- **Högtalarreparation**: Speaker repair images

### Device Types
- **iPhone Reparation**: iPhone-specific repair images
- **Samsung Reparation**: Samsung device repair images
- **Tablet Reparation**: Tablet repair images
- **Laptop Reparation**: Laptop repair images

### Business & Marketing
- **Erbjudanden & Kampanjer**: Sales and promotional images
- **Före & Efter**: Before and after repair comparisons
- **Certifieringar & Garanti**: Certificates and warranty badges
- **Personal & Verkstad**: Staff and workshop photos
- **Reparationsprocess**: Step-by-step repair process images

## How to Add Images

### Method 1: Upload New Image
1. **Select Image File**: Click "Välj fil" and choose your image
2. **Upload to Storage**: Click "Ladda upp till Supabase" (wait for confirmation)
3. **Fill in Details**:
   - **Alt-text**: Descriptive text for accessibility (required)
   - **Sektion**: Choose appropriate category from dropdown
   - **Fotograf/credit**: Optional photographer credit
   - **Credit URL**: Optional link to photographer's page
   - **Position**: Number for ordering (0 = first)
   - **Aktiv**: Check to make image visible on site
4. **Save**: Click "Spara" to add the image

### Method 2: Use External URL
1. **Enter URL**: Paste image URL directly in "Bild-URL" field
2. **Fill in remaining details** (same as Method 1)
3. **Save**: Click "Spara"

## Managing Hero Slider Images

### Quick Setup
1. **Use Hero Quick Actions**: Click "Lägg till Hero-bild" button (automatically sets section to HERO)
2. **Upload your hero image** following the steps above
3. **Preview Changes**: Click "Förhandsgranska Startsida" to see results

### Hero Image Best Practices
- **Dimensions**: Use landscape images (16:9 ratio recommended)
- **Size**: Minimum 1600px wide for crisp display
- **Content**: Ensure text overlay areas are not too busy
- **Alt Text**: Use descriptive text that works as headlines
- **Position**: Set position numbers (0, 1, 2, etc.) to control order

### Default Fallbacks
- If no HERO images are set, the system uses professional stock images
- Your custom images will automatically replace defaults when added
- System ensures hero slider always works, even if images fail to load

## Organizing and Filtering Images

### View by Category
1. **Use Section Filter**: Select category from "Filtrera sektion" dropdown
2. **View Specific Types**: Choose "Alla sektioner" to see everything
3. **Count Display**: See how many images are in each category

### Managing Existing Images
1. **Preview**: All images show thumbnail previews
2. **Details**: View section, position, and active status
3. **Credits**: See photographer attribution if added
4. **Delete**: Click "Ta bort" to remove unwanted images

## Image Requirements

### Technical Specifications
- **Formats**: JPG, PNG, WebP supported
- **Size**: Maximum 10MB per image
- **Dimensions**: Minimum 800px wide recommended
- **Quality**: Use high-quality images for professional appearance

### SEO Best Practices
- **Alt Text**: Always provide descriptive alt text
- **File Names**: Use descriptive file names before upload
- **Credits**: Add photographer credits for stock photos
- **Optimization**: Compress images before upload for faster loading

## Troubleshooting

### Common Issues
- **Upload Fails**: Check internet connection and file size
- **Image Not Showing**: Verify "Aktiv" checkbox is checked
- **Wrong Order**: Adjust position numbers (lower = first)
- **Hero Not Updating**: Clear browser cache and refresh

### Getting Help
- **Preview Changes**: Always use "Förhandsgranska Startsida" to test
- **Refresh Data**: Click "Uppdatera" button to reload image list
- **Check Console**: Browser developer tools may show error details

## Advanced Tips

### Seasonal Updates
- Use **Erbjudanden & Kampanjer** for holiday promotions
- Update hero images for seasonal campaigns
- Keep **Före & Efter** images current with recent work

### Professional Presentation
- Maintain consistent style across categories
- Use **Personal & Verkstad** to build trust
- Showcase **Certifieringar & Garanti** prominently
- Document **Reparationsprocess** for transparency

### Performance Optimization
- Upload appropriately sized images (don't upload 4K for web use)
- Use position numbers strategically (most important images first)
- Regularly review and remove unused images
- Keep active image count reasonable for fast loading

---

*Last updated: 2025-08-11*

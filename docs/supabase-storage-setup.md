# Supabase Storage Setup Guide

## Issue: 400 Bad Request on Image Upload

The error you're seeing indicates that the Supabase storage bucket needs to be properly configured. Here's how to fix it:

## Step 1: Create Storage Bucket

1. **Go to Supabase Dashboard**: Visit [supabase.com](https://supabase.com) and sign in
2. **Select Your Project**: Choose your mobile repair shop project
3. **Navigate to Storage**: Click "Storage" in the left sidebar
4. **Create New Bucket**:
   - Click "New bucket"
   - Name: `images`
   - Public bucket: ✅ **Check this box** (important!)
   - Click "Create bucket"

## Step 2: Configure Bucket Policies

After creating the bucket, you need to set up proper policies:

### Option A: Simple Public Policy (Recommended for development)
1. Go to **Storage > Policies**
2. Click "New Policy" for the `images` bucket
3. **Select "For full customization"**
4. Use this policy:

```sql
-- Allow public uploads
CREATE POLICY "Public uploads" ON storage.objects
FOR INSERT TO public
WITH CHECK (bucket_id = 'images');

-- Allow public downloads
CREATE POLICY "Public downloads" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'images');

-- Allow authenticated users to delete (admin only)
CREATE POLICY "Authenticated deletes" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'images');
```

### Option B: Admin-Only Upload Policy (Recommended for production)
```sql
-- Allow only authenticated users to upload
CREATE POLICY "Admin uploads only" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'images');

-- Allow public downloads
CREATE POLICY "Public downloads" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'images');

-- Allow authenticated users to delete
CREATE POLICY "Admin deletes" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'images');
```

## Step 3: Verify Environment Variables

Make sure your `.env.local` file has the correct Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_BUCKET=images
```

## Step 4: Test the Upload

1. **Restart your development server**: `npm run dev`
2. **Go to admin panel**: `/admin/images`
3. **Try uploading a small image** (< 1MB, JPG/PNG format)
4. **Check browser console** for detailed error messages

## Common Issues and Solutions

### Issue: "Bucket not found"
- **Solution**: Make sure the bucket name is exactly `images` (lowercase)
- **Check**: Verify bucket exists in Supabase dashboard

### Issue: "Insufficient permissions"
- **Solution**: Add the public upload policy (Option A above)
- **Check**: Ensure bucket is marked as "Public"

### Issue: "File too large"
- **Solution**: Supabase has upload limits, try smaller files first
- **Check**: File should be < 10MB

### Issue: "Invalid file type"
- **Solution**: Only JPG, PNG, WebP are allowed
- **Check**: File extension and MIME type

## Alternative: Use External URLs

If you continue having issues with Supabase storage, you can:

1. **Upload images elsewhere** (Cloudinary, AWS S3, etc.)
2. **Use the "Bild-URL" field** in the admin panel
3. **Paste the external URL directly**

This bypasses Supabase storage entirely and still works with the image management system.

## Debugging Steps

1. **Check browser console** for detailed error messages
2. **Verify Supabase project status** in dashboard
3. **Test with a simple 100KB JPG image** first
4. **Check network tab** for the exact HTTP response

---

*If you continue having issues, please share the exact error message from the browser console.*

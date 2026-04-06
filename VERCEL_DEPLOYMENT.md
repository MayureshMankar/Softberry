# Vercel Deployment Guide & Limitations

This project is now configured for Vercel deployment via `vercel.json`. However, please be aware of the following limitations inherent to Vercel's serverless architecture:

## 1. WebSockets
**Limitation**: Vercel's serverless functions do not support persistent WebSocket connections.
**Impact**: The administrative real-time notifications (WebSockets) will NOT work on Vercel. 
**Recommendation**: For real-time functionality, consider:
- Using a long-running process host like **Render**, **Railway**, or **Heroku**.
- Or refactor the admin system to use **Pusher**, **Ably**, or **Supabase Realtime**.

## 2. Local File Uploads
**Limitation**: Vercel's filesystem is ephemeral and read-only.
**Impact**: Files uploaded to the `client/public/uploads` directory at runtime will not persist between requests or deployments.
**Recommendation**: 
- Use a cloud storage provider like **Cloudinary**, **AWS S3**, or **Google Cloud Storage** for images.
- The project is currently set to serve files from `/uploads`, which will only work for files included at build time.

## 3. Deployment Configuration
- **Build Command**: `npm run build`
- **Output Directory**: `dist/public`
- **Environment Variables**: Ensure the following are set in the Vercel Dashboard:
    - `MONGODB_URI` (Atlas URI)
    - `SESSION_SECRET` (At least 32 chars)
    - `RAZORPAY_KEY_ID`
    - `RAZORPAY_KEY_SECRET`
    - `EMAIL_USER` / `EMAIL_PASS`
    - `NODE_ENV`: `production`
    - `VERCEL`: `1`

## 4. Alternative Hosting
If WebSockets and local file persistence are critical for your application, we strongly recommend using:
- **Render.com** (supports long-running Express processes)
- **Railway.app** (excellent for full-stack Node.js apps)
- **DigitalOcean App Platform**

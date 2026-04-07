# Render Deployment Guide

This project is optimized for deployment on **Render.com** as a **Web Service**.

## Why Render?
- **Long-running process**: Supports the persistent Express server.
- **WebSockets**: Native support for the admin real-time notification system.
- **Easy setup**: Simple "connect to GitHub" workflow.

## Deployment Steps

1. **Create a new Web Service** on Render.
2. **Connect your repository**.
3. **Configure Settings**:
    - **Runtime**: `Node`
    - **Build Command**: `npm run build`
    - **Start Command**: `npm start`
4. **Add Environment Variables**:
    - `NODE_ENV`: `production`
    - `RENDER`: `1` (This tells the server to serve static files directly)
    - `MONGODB_URI`: Your MongoDB Atlas connection string.
    - `SESSION_SECRET`: A long random string (at least 32 chars).
    - `ADMIN_SECRET`: A secret key for administrative access.
    - `ALLOWED_ORIGINS`: Your Render URL (e.g., `https://your-app.onrender.com`).
    - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: For email notifications.
    - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`: For payments.

## Database
Ensure you are using **MongoDB Atlas** or another cloud MongoDB provider. Render's free tier database is PostgreSQL, so you'll need an external MongoDB instance.

## Real-time Features
WebSockets will work automatically on Render. No extra configuration is needed.

# Decap CMS - cPanel Deployment Guide

## Overview

This setup integrates Decap CMS OAuth directly into your Astro application using API routes. Perfect for cPanel hosting - no separate servers needed!

## Setup Steps

### 1. Create GitHub OAuth App

1. Go to: https://github.com/settings/developers
2. Click **New OAuth App**
3. Fill in:
   - **Application name**: Thuongdadev CMS
   - **Homepage URL**: https://thuongda.dev
   - **Authorization callback URL**: https://thuongda.dev/api/oauth/callback
4. Click **Register application**
5. Copy your **Client ID** and generate a **Client Secret**

### 2. Add GitHub Secrets

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

- `GH_CLIENT_ID` - Your GitHub OAuth Client ID
- `GH_CLIENT_SECRET` - Your GitHub OAuth Client Secret

### 3. Deploy

The GitHub Actions workflow will automatically:
1. Build your Astro site with OAuth endpoints
2. Deploy to your cPanel hosting
3. Create a `.env` file with your credentials
4. Set up the Node.js app

### 4. Configure cPanel Node.js App

After deployment, in cPanel:

1. Go to **Setup Node.js App**
2. Configure:
   - **App Root**: `/home/yourusername/thuongda.dev`
   - **App URL**: `thuongda.dev`
   - **Application Startup File**: `app.js`
3. Click **RESTART**

### 5. Access Your CMS

Visit: https://thuongda.dev/admin

- Click "Login with GitHub"
- Authenticate
- Start managing content!

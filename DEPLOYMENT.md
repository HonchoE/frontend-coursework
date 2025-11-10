# Deployment Guide

## Prerequisites
- Node.js 14+ installed
- npm or yarn
- Backend API running

## Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure API URL**
   Update `apiBaseUrl` in `src/App.vue` to point to your backend:
   ```javascript
   const apiBaseUrl = ref('http://localhost:3000/api');
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   
   App will be available at `http://localhost:5173`

## Production Build

1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Preview Production Build**
   ```bash
   npm run preview
   ```

## Deployment Options

### Netlify
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`

### Vercel
1. Import project from Git
2. Framework preset: Vite
3. Auto-detected build settings

### Static Hosting
Upload `dist/` folder contents to any static hosting service.

## Environment Configuration

For production, update API base URL to your deployed backend URL.

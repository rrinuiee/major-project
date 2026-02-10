# Google Maps API Setup Instructions

## Problem
The app shows: "This page can't load Google Maps correctly"

## Solution

### Step 1: Get a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps JavaScript API**
   - **Geocoding API** (optional, for address search)
   - **Directions API** (optional, for turn-by-turn directions)

4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy your API key

### Step 2: Restrict Your API Key (Recommended)

1. Click on your API key to edit it
2. Under **Application restrictions**:
   - For development: Choose "None"
   - For production: Choose "HTTP referrers" and add your domain
3. Under **API restrictions**:
   - Select "Restrict key"
   - Choose the APIs you enabled above

### Step 3: Add API Key to Your Project

Open the `.env` file in the root directory and replace `YOUR_API_KEY_HERE` with your actual API key:

```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Step 4: Restart Development Server

```bash
npm run dev
```

## Important Notes

- **Free Tier**: Google Maps provides $200 free credit per month
- **Billing**: You need to enable billing on your Google Cloud account (even for free tier)
- **Security**: Never commit your API key to public repositories
- **Environment Variables**: The key is loaded via `import.meta.env.VITE_GOOGLE_MAPS_API_KEY`

## Troubleshooting

### Error: "This page can't load Google Maps correctly"
- ✅ Check if API key is set in `.env`
- ✅ Verify Maps JavaScript API is enabled
- ✅ Ensure billing is enabled on Google Cloud
- ✅ Check API key restrictions

### Error: "RefererNotAllowedMapError"
- ✅ Add your domain to HTTP referrer restrictions
- ✅ For localhost, use: `http://localhost:*`

### Map shows but no features work
- ✅ Enable additional APIs (Geocoding, Directions, Places)

## Alternative: Use Map Placeholder (No API Key Required)

If you want to test without Google Maps, you can replace the map with a static placeholder. Let me know if you need this option!

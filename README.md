# Quick Tip Calculator PWA

A lightweight Progressive Web App for calculating tips with currency support.

## Features

- 💰 Tip calculation with multiple currencies (AUD, USD, EUR, GBP)
- 🌙 Dark/light mode toggle
- 📱 PWA - installable on mobile and desktop
- 💾 Offline functionality with service worker
- 🎨 Clean, responsive UI with Tailwind CSS
- ⌨️ Keyboard shortcuts (Enter to calculate, Esc to reset)

## PWA Features

- **Manifest**: Web app manifest for installation
- **Service Worker**: Caches app files for offline use
- **Install Prompt**: Shows install button when app can be installed
- **Icons**: Multiple sizes for different devices

## Setup

### 1. Generate Icons
Open `generate-icons.html` in a browser and download the icons to the `icons/` folder.

### 2. Run the App

**Option A: Direct file**
```bash
# Double-click index.html to open in browser
```

**Option B: Local server (recommended for PWA)**
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx -y serve .

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000`

### 3. Install as PWA

- **Chrome/Edge**: Look for the install icon in the address bar
- **Mobile**: Use "Add to Home Screen" from browser menu
- **Desktop**: Install prompt will appear automatically

## File Structure

```
tip-calc/
├── index.html          # Main app
├── app.js              # JavaScript functionality
├── styles.css          # Custom styles
├── manifest.webmanifest # PWA manifest
├── sw.js              # Service worker
├── generate-icons.html # Icon generator
├── icons/             # App icons (generate these)
└── README.md          # This file
```

## Browser Support

- Chrome/Edge: Full PWA support
- Firefox: Basic PWA support
- Safari: Limited PWA support
- Mobile browsers: Varies by platform

## Development

The app uses:
- **Tailwind CSS** (via CDN) for styling
- **Vanilla JavaScript** for functionality
- **localStorage** for data persistence
- **Service Worker** for offline caching

No build tools required - just edit the files and refresh!

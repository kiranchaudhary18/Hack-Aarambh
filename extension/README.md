# ScamSniff Browser Extension

A cross-browser extension for Chrome and Firefox that allows users to crop images from web pages and analyze them for scams using AI.

## Features

- **JWT Authentication**: Login with your ScamSniff website credentials
- **API Token System**: Generate and manage API tokens from your website profile
- **Image Cropping**: Crop images from any webpage using built-in cropping tool
- **AI Analysis**: Analyze cropped images for scam detection using OCR and AI
- **History Integration**: Results automatically saved to your website history

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Backend server running on `http://localhost:3001`
- Website running on `http://localhost:5173`

### Installation

1. Install dependencies:
```bash
cd extension
npm install
```

2. Development mode:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

### Loading the Extension

#### Chrome
1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension/build/chrome-mv3-dev` folder

#### Firefox
1. Open `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select the `extension/build/firefox-mv3-dev` folder

## Usage

1. **Login**: Open the extension and login with your ScamSniff website credentials
2. **API Token**: Enter your API token (get it from your website profile page)
3. **Crop Image**: Click "Crop Image" to select an image from the current page
4. **Send**: After cropping, click "Send" to analyze the image
5. **View Results**: You'll be redirected to your website history page to view results

## Project Structure

```
extension/
├── assets/                  # Extension assets (icons, images)
├── build/                   # Build output directory
├── src/
│   ├── background/          # Background service worker
│   │   └── index.ts
│   ├── components/          # React components
│   │   ├── Input.tsx        # API token input component
│   │   ├── Scanner.tsx      # Region scanner component
│   │   └── Style.tsx        # Global styles
│   ├── contents/            # Content scripts
│   │   └── capture.tsx      # Image capture script
│   ├── lib/                 # Utilities
│   │   ├── api.ts           # API client
│   │   └── storage.ts       # Chrome storage wrapper
│   └── popup/               # Extension popup UI
│       ├── index.html       # Popup HTML
│       └── index.tsx        # Main popup component
├── package.json
├── plasmo.config.ts
├── tsconfig.json
└── README.md
```

## API Integration

The extension integrates with the following backend endpoints:

- `POST /auth/login` - User authentication
- `POST /tokens/generate` - Generate API tokens (via website)
- `GET /tokens` - List API tokens (via website)
- `DELETE /tokens/:id` - Delete API tokens (via website)
- `POST /analysis/image` - Analyze image with API token

## Notes

- API tokens have a daily limit of 50 checks per token
- Usage limits reset every 24 hours
- Images are analyzed using OCR (Tesseract.js) to extract text, then analyzed with the AI model
- Results are automatically saved to your website history

## Troubleshooting

- If the extension doesn't load, ensure the backend server is running
- Check browser console for errors
- Verify API token is valid and not expired
- Ensure CORS is configured correctly on the backend

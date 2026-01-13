# Shield Chrome Extension - Installation Guide

Shield is now a Chrome browser extension that can actually block websites and keywords to help you stay focused.

## How to Install

1. **Build the extension**
   ```bash
   npm run build
   ```

2. **Load the extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" using the toggle in the top right
   - Click "Load unpacked"
   - Select the `dist` folder from your project directory

3. **Start using Shield**
   - Click the Shield icon in your browser toolbar to open the dashboard
   - Add websites and keywords you want to block
   - Toggle protection on/off as needed
   - Track your streak and statistics

## How It Works

- **Real Blocking**: Uses Chrome's declarativeNetRequest API to actually block websites at the browser level
- **Keyword Blocking**: Blocks any URL containing your specified keywords
- **Sync Across Tabs**: Blocking works across all browser tabs automatically
- **Supabase Backend**: All your data is synced with Supabase, so your settings persist
- **Streak Tracking**: Continue building your focus streak day by day
- **Block Statistics**: See how many times Shield has protected your focus

## Features

- Block specific websites (e.g., twitter.com, reddit.com)
- Block by keyword (e.g., "gaming", "social")
- Enable/disable protection with one click
- Pause protection temporarily
- View your current streak and statistics
- See a beautiful blocked page when you try to visit a blocked site

## Updating the Extension

After making changes to the code:
1. Run `npm run build` again
2. Go to `chrome://extensions/`
3. Click the refresh icon on the Shield extension card

## Troubleshooting

If sites aren't being blocked:
- Make sure protection is enabled in the dashboard
- Check that the site is in your blocked sites list
- Try refreshing the extension at `chrome://extensions/`
- Check the browser console for any error messages

## Privacy

All your data is stored in your Supabase database. The extension only accesses:
- Your blocked sites and keywords
- Your streak and statistics data
- The URLs you visit (only to check if they should be blocked)

No data is sent to any third parties.

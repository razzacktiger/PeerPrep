#!/bin/bash
# Reset iOS Simulator network (fixes "Network request failed" bug)

echo "🔄 Resetting iOS Simulator..."

# Kill all simulators
killall "Simulator" 2>/dev/null

# Reset network
sudo killall -HUP mDNSResponder

# Clear Metro cache
rm -rf node_modules/.cache

# Clear simulator cache (optional - use if sign-in persists)
# xcrun simctl erase all

echo "✅ Reset complete! Now run: npx expo start --clear"


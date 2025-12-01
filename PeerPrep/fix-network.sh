#!/bin/bash
# Permanent fix for iOS Simulator network issues

echo "🔧 Applying iOS Simulator network fixes..."

# Fix 1: Reset network services (doesn't erase data)
sudo killall -HUP mDNSResponder
echo "✅ DNS cache cleared"

# Fix 2: Disable IPv6 on Wi-Fi (most reliable fix)
networksetup -setv6off Wi-Fi
echo "✅ IPv6 disabled on Wi-Fi"

# Fix 3: Clear Metro cache
rm -rf /tmp/metro-* 2>/dev/null
rm -rf /tmp/haste-* 2>/dev/null
echo "✅ Metro cache cleared"

echo ""
echo "🎉 Done! Now run: npx expo start --clear"
echo ""
echo "⚠️  To re-enable IPv6 later: networksetup -setv6automatic Wi-Fi"

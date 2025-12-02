import React from "react";
import { View, Image, StyleSheet, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface AvatarProps {
  avatarUrl?: string | null;
  size?: number;
  showOnlineIndicator?: boolean;
  iconColor?: string;
  iconSize?: number;
}

export default function Avatar({
  avatarUrl,
  size = 56,
  showOnlineIndicator = false,
  iconColor = "#FFFFFF",
  iconSize,
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoading, setImageLoading] = React.useState(true);
  const calculatedIconSize = iconSize || size * 0.7;
  const radius = size / 2;

  // Fix ui-avatars.com URLs to use PNG format instead of SVG
  const fixedAvatarUrl = React.useMemo(() => {
    if (!avatarUrl) return avatarUrl;
    if (avatarUrl.includes('ui-avatars.com')) {
      let url = avatarUrl;
      // Add format=png if not present
      if (!url.includes('format=')) {
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}format=png`;
      }
      // Add size parameter
      if (!url.includes('size=')) {
        url = `${url}&size=128`;
      }
      return url;
    }
    return avatarUrl;
  }, [avatarUrl]);

  const hasValidUrl = fixedAvatarUrl && fixedAvatarUrl.trim() !== '';
  const shouldShowImage = hasValidUrl && !imageError;

  React.useEffect(() => {
    // Reset states when URL changes
    setImageError(false);
    setImageLoading(true);
  }, [fixedAvatarUrl]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {shouldShowImage ? (
        <>
          <Image
            source={{ 
              uri: fixedAvatarUrl,
            }}
            style={[
              styles.image,
              {
                width: size,
                height: size,
                borderRadius: radius,
              },
            ]}
            resizeMode="cover"
            onLoad={() => {
              setImageLoading(false);
            }}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
          />
          {imageLoading && (
            <View style={[
              styles.loadingOverlay,
              {
                width: size,
                height: size,
                borderRadius: radius,
              }
            ]}>
              <ActivityIndicator size="small" color="#6366F1" />
            </View>
          )}
        </>
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              width: size,
              height: size,
              borderRadius: radius,
              backgroundColor: "#9333ea",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <MaterialCommunityIcons
            name="account-circle"
            size={calculatedIconSize}
            color={iconColor}
          />
        </View>
      )}
      {showOnlineIndicator && <View style={styles.onlineIndicator} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  image: {
    backgroundColor: "#E0E7FF",
  },
  placeholder: {
    // Styles moved inline
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    backgroundColor: "#4ade80",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
});

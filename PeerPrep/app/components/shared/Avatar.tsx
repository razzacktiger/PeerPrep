import React from "react";
import { View, Image, StyleSheet } from "react-native";
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
  iconColor = "#E5E7EB",
  iconSize,
}: AvatarProps) {
  const calculatedIconSize = iconSize || size;
  const radius = size / 2;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          style={[
            styles.image,
            {
              width: size,
              height: size,
              borderRadius: radius,
            },
          ]}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              width: size,
              height: size,
              borderRadius: radius,
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
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
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

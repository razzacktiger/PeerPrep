import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";

// Create QueryClient instance
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
        </Stack>
      </PaperProvider>
    </QueryClientProvider>
  );
}

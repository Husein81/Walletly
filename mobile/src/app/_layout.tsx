import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { StatusBar, StatusBarStyle } from "expo-status-bar";
// Local Imports
import Providers from "@/components/providers";
import { useAuthStore } from "@/store/authStore";
import { PortalHost } from "@rn-primitives/portal";
import "../../global.css";
import { useColorScheme } from "@/lib/useColorScheme";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

const MainLayout = () => {
  const { user, token } = useAuthStore();
  const isAuthenticated = Boolean(user && token);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
};

export default function RootLayout() {
  const { loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <Providers>
      <MainLayout />
      <PortalHost />
    </Providers>
  );
}

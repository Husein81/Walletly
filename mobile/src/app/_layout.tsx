import { Stack } from "expo-router";
import React, { useEffect } from "react";
import "react-native-gesture-handler";
// Local Imports
import Providers from "@/components/providers";
import { useAuthStore } from "@/store/authStore";
import { PortalHost } from "@rn-primitives/portal";
import "../../global.css";

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
        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
            headerShown: false,
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="bottom-sheet"
          options={{
            presentation: "formSheet",
            headerShown: false,
            sheetAllowedDetents: [0.45, 0.75, 0.95],
            statusBarStyle: "auto",
            sheetInitialDetentIndex: 0,
            sheetGrabberVisible: true,
            sheetCornerRadius: 24,
          }}
        />
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

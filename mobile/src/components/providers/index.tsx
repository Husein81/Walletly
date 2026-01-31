import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as schema from "@/db/schema";
import { NAV_THEME } from "@/lib/theme";
import { useColorScheme } from "@/lib/useColorScheme";
import { ThemeProvider } from "@react-navigation/native";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync, SQLiteProvider } from "expo-sqlite";
import { Suspense, useEffect, useState } from "react";
import { ActivityIndicator, StatusBar } from "react-native";
import Toast from "react-native-toast-message";
import { StatusBarStyle } from "expo-status-bar";
import { View } from "react-native";

type Props = {
  children: React.ReactNode;
};

export const DATABASE_NAME = "walletly_db";

const expoDb = openDatabaseSync(DATABASE_NAME);
export const db = drizzle(expoDb, { schema });

const Providers = ({ children }: Props) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { colorScheme } = useColorScheme();
  const queryClient = new QueryClient();

  const statusBarStyle =
    colorScheme === "dark" ? "light-content" : "dark-content";

  StatusBar.setBarStyle(
    colorScheme === "dark" ? "light-content" : "dark-content",
  );

  if (!mounted) {
    return <ActivityIndicator size={"large"} />;
  }

  return (
    <Suspense fallback={<ActivityIndicator size={"large"} />}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        options={{ enableChangeListener: true }}
      >
        <QueryClientProvider client={queryClient}>
          <ThemeProvider value={NAV_THEME[colorScheme]}>
            <SafeAreaProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <BottomSheetModalProvider>
                  {children}
                  <StatusBar barStyle={statusBarStyle} />
                </BottomSheetModalProvider>
                <Toast />
              </GestureHandlerRootView>
            </SafeAreaProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SQLiteProvider>
    </Suspense>
  );
};
export default Providers;

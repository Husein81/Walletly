import { NAV_THEME } from "@/lib/theme";
import { useColorScheme } from "@/lib/useColorScheme";
import { ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { Suspense, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { db, runMigrations, DATABASE_NAME } from "@/db/client";

type Props = {
  children: React.ReactNode;
};

// Re-export the db instance for other components to use
// although prefer using db from @/db/client directly
export { db };

const Providers = ({ children }: Props) => {
  const [mounted, setMounted] = useState(false);
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        console.log("🔄 Starting database initialization...");
        await runMigrations(db);
        console.log("✅ Database initialized successfully");
        setDbReady(true);
      } catch (error) {
        console.error("❌ Database initialization failed:", error);
        // Still set ready to true so app doesn't hang, but functionality will be broken
        setDbReady(true);
      }
    };

    init();
    setMounted(true);
  }, []);

  const { colorScheme } = useColorScheme();
  const queryClient = new QueryClient();

  if (!mounted || !dbReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Suspense fallback={<ActivityIndicator size={"large"} />}>
        <SQLiteProvider
          databaseName={DATABASE_NAME}
          options={{ enableChangeListener: true }}
          useSuspense
        >
          <QueryClientProvider client={queryClient}>
            <ThemeProvider value={NAV_THEME[colorScheme]}>
              <SafeAreaProvider>
                {children}
                <StatusBar style={"auto"} />
                <Toast />
              </SafeAreaProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </SQLiteProvider>
      </Suspense>
    </GestureHandlerRootView>
  );
};
export default Providers;

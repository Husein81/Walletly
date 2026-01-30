import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import * as schema from "@/db/schema";
import { NAV_THEME } from "@/lib/theme";
import { useColorScheme } from "@/lib/useColorScheme";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync, SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { Suspense } from "react";
import { ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";

type Props = {
  children: React.ReactNode;
};

export const DATABASE_NAME = "walletly_db";

const expoDb = openDatabaseSync(DATABASE_NAME);
export const db = drizzle(expoDb, { schema });

const Providers = ({ children }: Props) => {
  const { isDarkColorScheme, colorScheme } = useColorScheme();
  const queryClient = new QueryClient();

  return (
    <Suspense fallback={<ActivityIndicator size={"large"} />}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        options={{ enableChangeListener: true }}
      >
        <QueryClientProvider client={queryClient}>
          <ThemeProvider value={NAV_THEME[colorScheme]}>
            <SafeAreaProvider>
              <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
              <GestureHandlerRootView style={{ flex: 1 }}>
                <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
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

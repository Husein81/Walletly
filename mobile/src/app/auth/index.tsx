import { router } from "expo-router";
import { Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Local Imports
import { Text } from "@/components/ui";
import { Button } from "@/components/ui-components";

const Auth = () => {
  return (
    <SafeAreaView
      edges={["top", "left", "right", "bottom"]}
      className="flex-1 bg-background p-8"
    >
      <View className="flex items-center flex-1">
        <Text className="text-4xl text-center font-bold text-primary mt-4 mb-2">
          Welcome to My Money Tracker!
        </Text>
        <View className="flex-1 justify-center items-center">
          <Image
            source={require("../../../assets/images/homeScreen.png")}
            className="h-full w-96 mb-4"
            resizeMode="contain"
          />
        </View>
        <Text className="text-base text-muted mb-6">
          Please login to continue
        </Text>
      </View>
      <Button size={"lg"} onPress={() => router.push("/auth/phone")}>
        <Text className="text-background">Continue with Phone</Text>
      </Button>
    </SafeAreaView>
  );
};
export default Auth;

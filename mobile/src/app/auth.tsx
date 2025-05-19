import { Redirect } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Local Imports
import AuthToggle from "~/components/Auth/AuthToggle";
import LoginForm from "~/components/Auth/LoginForm";
import RegisterForm from "~/components/Auth/RegisterForm";
import { Text } from "~/components/ui";
import { useAuthStore } from "~/store/authStore";

const Auth = () => {
  const { user, token } = useAuthStore();

  const [isActive, setIsActive] = useState(false);

  if (user && token) {
    return <Redirect href={"/"} />;
  }

  return (
    <SafeAreaView edges={["top"]} className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView className="mt-12 px-8">
          <AuthToggle isActive={isActive} setIsActive={setIsActive} />
          {/* Toggle between login and register */}
          <Text className="text-5xl font-bold text-primary text-center mb-8">
            {isActive ? " Let’s Get Started!" : "Welcome Back!"}
          </Text>
          <View className="flex-row justify-center mb-4 ">
            <Image
              style={{ width: 120, height: 120 }}
              source={require("../../assets/images/wallet.png")}
              className="shadow rounded-xl cover"
            />
          </View>
          {/* Form Fields */}
          {isActive ? (
            <RegisterForm setIsActive={setIsActive} />
          ) : (
            <LoginForm setIsActive={setIsActive} />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default Auth;

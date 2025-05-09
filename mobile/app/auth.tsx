import { Redirect } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Local Imports
import AuthToggle from "~/components/Auth/AuthToggle";
import LoginForm from "~/components/Auth/LoginForm";
import RegisterForm from "~/components/Auth/RegisterForm";
import { useAuthStore } from "~/store/authStore";

const Auth = () => {
  const { user, token } = useAuthStore();

  const [isActive, setIsActive] = useState(false);

  if (user && token) {
    return <Redirect href={"/"} />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <SafeAreaView edges={["top"]}>
        <ScrollView className="mt-12 px-8">
          <View>
            {/* Toggle between login and register */}
            <AuthToggle isActive={isActive} setIsActive={setIsActive} />
            {/* Form Fields */}
            {isActive ? (
              <RegisterForm setIsActive={setIsActive} />
            ) : (
              <LoginForm setIsActive={setIsActive} />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};
export default Auth;

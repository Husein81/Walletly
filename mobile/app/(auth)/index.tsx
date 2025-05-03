import { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";

// Local Imports
import AuthToggle from "~/components/Auth/AuthToggle";
import LoginForm from "~/components/Auth/LoginForm";
import RegisterForm from "~/components/Auth/RegisterForm";

const Auth = () => {
  const [isActive, setIsActive] = useState(false);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView className="mt-12 p-10">
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
    </KeyboardAvoidingView>
  );
};
export default Auth;

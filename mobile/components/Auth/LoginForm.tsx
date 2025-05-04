import { router } from "expo-router";
import { useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";

// Local imports
import { Button, Input, Label } from "~/components/ui";
import { useLogin } from "~/hooks/auth";
import { NAV_THEME } from "~/lib/constants";
import { Icon } from "~/lib/icons/Icon";
import { useColorScheme } from "~/lib/useColorScheme";

type Props = {
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
};

const LoginForm = ({ setIsActive }: Props) => {
  const { isDarkColorScheme } = useColorScheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync, isPending, error } = useLogin(email, password);

  const handleLogin = async () => {
    try {
      await mutateAsync();
      router.replace("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <View className="flex-1">
      <Text className="text-5xl font-bold text-primary text-center mb-8">
        Welcome Back!
      </Text>
      {/* Form */}
      <View className="flex-1 gap-4">
        <View className="gap-4">
          <Label>Email</Label>
          <Input
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            className="mb-4"
            autoCapitalize="none"
          />
        </View>
        <View className="gap-4">
          <Label>Password</Label>
          <View className="relative">
            <Input
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              className="mb-4"
              autoCapitalize="none"
            />
            <Icon
              name={showPassword ? "EyeOff" : "Eye"}
              className="absolute right-3 top-3"
              onPress={() => setShowPassword(!showPassword)}
              color={
                isDarkColorScheme
                  ? NAV_THEME.dark.primary
                  : NAV_THEME.light.primary
              }
            />
          </View>
        </View>

        {/* Error */}
        {error && <Text className="text-red-500 mb-4">{error.message}</Text>}
        <Button onPress={handleLogin}>
          {isPending ? (
            <ActivityIndicator />
          ) : (
            <Text className="text-white dark:text-shark">Sign In</Text>
          )}
        </Button>

        <View className="flex-row justify-center items-center ">
          <Text className="text-center text-shuttleGray">
            Don't have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => setIsActive(true)}>
            <Text className="text-shark font-semibold dark:text-white ">
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginForm;

import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Button, Text, Input, Label } from "../ui";
import { useState } from "react";
import Icon from "~/lib/icons/Icon";
import { useTheme } from "@react-navigation/native";
import { NAV_THEME } from "~/lib/constants";
import { useRegister } from "~/hooks/auth";

type Props = {
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
};

const RegisterForm = ({ setIsActive }: Props) => {
  const theme = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync, isPending, error } = useRegister(name, email, password);
  const handleSignUp = async () => {
    try {
      await mutateAsync();
      setIsActive(false); // Switch to login form after successful registration
    } catch (err) {
      console.error("Registration error:", err);
    }
  };
  return (
    <View>
      <Text className="text-4xl font-bold text-primary text-center mb-8">
        Lets Get Started!
      </Text>

      {/* Form */}
      <View className="flex-1 gap-4">
        <View className="gap-4">
          <Label>Name</Label>
          <Input
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            className="mb-4"
            autoCapitalize="none"
          />
        </View>
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
                theme.dark ? NAV_THEME.dark.primary : NAV_THEME.light.primary
              }
            />
          </View>
        </View>
        <Button onPress={handleSignUp} className="bg-primary ">
          {isPending ? <ActivityIndicator /> : <Text>Register</Text>}
        </Button>
        <View className="flex-row justify-center items-center ">
          <Text className="text-center text-shuttleGray">
            Already have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => setIsActive(true)}>
            <Text className="text-shark font-semibold dark:text-white ">
              Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RegisterForm;

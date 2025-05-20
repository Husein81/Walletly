import { router } from "expo-router";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useColorScheme } from "~/lib/useColorScheme";

// Form & validation
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

// Local imports
import { Input, Label } from "~/components/ui";
import { useLogin } from "~/hooks/auth";
import { NAV_THEME } from "~/lib/config";
import { Icon } from "~/lib/icons/Icon";
import { FieldInfo, Button } from "../ui-components";
import Toast from "react-native-toast-message";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type Props = {
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
};

const LoginForm = ({ setIsActive }: Props) => {
  const { isDarkColorScheme } = useColorScheme();
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync, isPending, error } = useLogin();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }: { value: LoginFormValues }) => {
      try {
        await mutateAsync(value);
        router.navigate("/");
      } catch (err) {
        const errorMessage = (err as Error)?.message;
        Toast.show({
          type: "error",
          text1: "Login error:",
          text2: errorMessage,
        });
      }
    },
  });

  return (
    <View className="flex-1 gap-4">
      {/* Email Field */}
      <form.Field
        name="email"
        validators={{
          onChange: z
            .string()
            .min(1, { message: "This field has to be filled." })
            .email("This is not a valid email."),
          onChangeAsyncDebounceMs: 500,
          onChangeAsync: z.string().refine(
            async (value) => {
              return !value.includes("error");
            },
            {
              message: "No 'error' allowed in email",
            }
          ),
        }}
        children={(field) => (
          <View className="gap-2">
            <Label>Email</Label>
            <Input
              placeholder="Enter your email"
              value={field.state.value}
              onChangeText={field.handleChange}
              autoCapitalize="none"
            />
            <FieldInfo field={field} />
          </View>
        )}
      />

      {/* Password Field */}
      <form.Field
        name="password"
        validators={{
          onChange: z
            .string()
            .min(1, { message: "This field has to be filled." })
            .min(6, { message: "Password must be at least 6 characters" }),
          onChangeAsyncDebounceMs: 500,
          onChangeAsync: z.string().refine(
            async (value) => {
              return !value.includes("error");
            },
            {
              message: "No 'error' allowed in password",
            }
          ),
        }}
        children={(field) => (
          <View className="gap-2">
            <Label>Password</Label>
            <View className="relative">
              <Input
                placeholder="Enter your password"
                value={field.state.value}
                onChangeText={field.handleChange}
                secureTextEntry={!showPassword}
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
            <FieldInfo field={field} />
          </View>
        )}
      />

      {/* Submit */}
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <Button
            className="w-full mt-4"
            onPress={form.handleSubmit}
            disabled={!canSubmit || isSubmitting}
            isSubmitting={isPending || isSubmitting}
            text="Sign in"
            textColor={
              isDarkColorScheme
                ? NAV_THEME.dark.background
                : NAV_THEME.light.background
            }
          />
        )}
      />

      {/* Switch to Signup */}
      <View className="flex-row justify-center items-center">
        <Text className="text-shuttleGray">Don't have an account? </Text>
        <TouchableOpacity onPress={() => setIsActive(true)}>
          <Text className="text-primary font-semibold">Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginForm;

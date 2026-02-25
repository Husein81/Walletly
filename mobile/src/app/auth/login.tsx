import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

// local imports
import { Icon, Input, Label } from "@/components/ui";
import { Button, FieldInfo, InputField } from "@/components/ui-components";
import { useLogin, useRegister } from "@/hooks/auth";
import { authApi } from "@/api/auth";

const Login = () => {
  const [step, setStep] = useState<"username" | "password">("username");
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const { mutateAsync: login } = useLogin();
  const { mutateAsync: register } = useRegister();

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        if (step === "username") {
          setCheckingUsername(true);
          const { exists } = await authApi.checkUsername(value.username);
          setUserExists(exists);
          setStep("password");
        } else {
          if (userExists) {
            await login(value);
          } else {
            await register(value);
          }
        }
      } catch (error) {
        console.error("Error during authentication:", error);
      } finally {
        setCheckingUsername(false);
      }
    },
  });

  return (
    <SafeAreaView edges={["top"]} className="bg-background flex-1 px-6 py-8">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center gap-4 mb-6">
            {step === "password" && (
              <TouchableOpacity
                onPress={() => setStep("username")}
                className="bg-muted p-2 rounded-full"
              >
                <Icon name="ArrowLeft" size={20} color="#666" />
              </TouchableOpacity>
            )}
            <View>
              <Text className="text-4xl font-bold text-primary">
                {step === "username"
                  ? "Welcome"
                  : userExists
                    ? "Login"
                    : "Join Us"}
              </Text>
            </View>
          </View>

          <Text className="text-muted-foreground mb-8 text-lg">
            {step === "username"
              ? "Enter your username to continue."
              : userExists
                ? `Welcome back, ${form.state.values.username}! Enter your password.`
                : `Username "${form.state.values.username}" is available! Create a password to register.`}
          </Text>

          <View className="gap-6">
            {step === "username" && (
              <View className="gap-2">
                <form.Field
                  name="username"
                  validators={{
                    onChange: z
                      .string()
                      .min(3, "Username must be at least 3 characters"),
                  }}
                >
                  {(field) => (
                    <InputField
                      label="Username"
                      placeholder="Enter your username"
                      field={field}
                      autoCapitalize="none"
                    />
                  )}
                </form.Field>
              </View>
            )}

            {step === "password" && (
              <View className="gap-2">
                <form.Field
                  name="password"
                  validators={{
                    onChange: z
                      .string()
                      .min(6, "Password must be at least 6 characters"),
                  }}
                >
                  {(field) => (
                    <InputField
                      label="Password"
                      type="password"
                      placeholder={
                        userExists ? "Enter your password" : "Create a password"
                      }
                      field={field}
                      autoFocus
                    />
                  )}
                </form.Field>
              </View>
            )}
          </View>
        </ScrollView>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              size={"lg"}
              onPress={() => form.handleSubmit()}
              isSubmitting={isSubmitting || checkingUsername}
              className="bg-primary h-14 rounded-2xl"
              disabled={step === "username" && !form.state.values.username}
            >
              <Text className="text-background text-lg font-bold">
                {step === "username"
                  ? "Continue"
                  : userExists
                    ? "Login"
                    : "Register"}
              </Text>
            </Button>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

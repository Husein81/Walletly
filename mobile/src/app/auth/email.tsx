import { useForm } from "@tanstack/react-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

// local imports
import { Button, InputField } from "@/components/ui-components";
import { useLogin } from "@/hooks/auth";

const Login = () => {
  const { mutateAsync } = useLogin();

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        await mutateAsync(values.value);
      } catch (error) {
        console.error("Error during authentication:", error);
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
          <Text className="text-4xl font-bold mb-4 text-primary">
            Welcome Back
          </Text>
          <Text className="text-muted-foreground mb-8 text-lg">
            Sign in or create a new account with your username and password.
          </Text>

          <View className="gap-6">
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
                    placeholder="Enter your password"
                    field={field}
                  />
                )}
              </form.Field>
            </View>
          </View>
        </ScrollView>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              size={"lg"}
              onPress={() => form.handleSubmit()}
              isSubmitting={isSubmitting}
              className="bg-primary h-14 rounded-2xl"
            >
              <Text className="text-background text-lg font-bold">
                Login / Register
              </Text>
            </Button>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

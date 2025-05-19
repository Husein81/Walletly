import { useForm } from "@tanstack/react-form";
import { Image, TouchableOpacity, View } from "react-native";
import { z } from "zod";

// Local imports
import { useState } from "react";
import { useRegister } from "~/hooks/auth";
import { NAV_THEME } from "~/lib/config";
import { Icon } from "~/lib/icons/Icon";
import { useColorScheme } from "~/lib/useColorScheme";
import { Input, Label, Text } from "../ui";
import { Button, FieldInfo } from "../ui-components";

type Props = {
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
};

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const RegisterForm = ({ setIsActive }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const { isDarkColorScheme } = useColorScheme();
  const { mutateAsync, isPending, error } = useRegister();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await mutateAsync(value);
        setIsActive(false);
      } catch (err) {
        console.error("Registration error:", err);
      }
    },
  });

  return (
    <View className="gap-4">
      <form.Field
        name="name"
        validators={{ onChange: () => registerSchema.shape.name }}
      >
        {(field) => (
          <View className="gap-2">
            <Label>Name</Label>
            <Input
              placeholder="Enter your name"
              value={field.state.value}
              onChangeText={field.handleChange}
            />
            <FieldInfo field={field} />
          </View>
        )}
      </form.Field>

      <form.Field
        name="email"
        validators={{ onChange: () => registerSchema.shape.email }}
      >
        {(field) => (
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
      </form.Field>

      <form.Field
        name="password"
        validators={{ onChange: () => registerSchema.shape.password }}
      >
        {(field) => (
          <View className="gap-2 relative">
            <Label>Password</Label>
            <View>
              <Input
                placeholder="Enter your password"
                value={field.state.value}
                onChangeText={field.handleChange}
                secureTextEntry
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
      </form.Field>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            disabled={!canSubmit}
            onPress={() => form.handleSubmit()}
            isSubmitting={isSubmitting}
            text="Register"
            textColor={
              isDarkColorScheme
                ? NAV_THEME.dark.background
                : NAV_THEME.light.background
            }
          />
        )}
      </form.Subscribe>

      <View className="flex-row justify-center items-center mt-4">
        <Text className="text-center text-shuttleGray">
          Already have an account?{" "}
        </Text>
        <TouchableOpacity onPress={() => setIsActive(false)}>
          <Text className="text-primary font-semibold ">Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterForm;

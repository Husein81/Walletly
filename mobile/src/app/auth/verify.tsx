import { useForm } from "@tanstack/react-form";
import { useLocalSearchParams } from "expo-router";
import { useRef } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input } from "~/components/ui";
import { Button } from "~/components/ui-components";
import { useVerifyOtp } from "~/hooks/auth";

const Verify = () => {
  const { code, phone } = useLocalSearchParams<{
    code: string;
    phone: string;
  }>();

  const inputRef = useRef<(TextInput | null)[]>([]);

  const handleChange = (value: string, index: number, field: any) => {
    const newOtp = field.state.value.split("");
    newOtp[index] = value;
    const otp = newOtp.join("");
    field.handleChange(otp);

    if (value && index < 5) {
      inputRef.current[index + 1]?.focus();
    }
  };

  const { mutateAsync } = useVerifyOtp();

  const form = useForm({
    defaultValues: {
      code: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const { code } = value;
        await mutateAsync({
          code,
          phone,
        });
      } catch (error) {
        console.error("Error verifying OTP:", error);
      }
    },
  });
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background p-8">
      <KeyboardAvoidingView className="flex-1">
        <ScrollView
          className="flex-1 gap-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-text text-2xl font-semibold mb-4">
            Verify Phone Number
          </Text>
          <Text className="text-text text-lg mb-8">
            Enter the verification code sent to {phone}
          </Text>
          <form.Field
            name="code"
            children={(field) => (
              <View className="flex-row justify-between mb-4">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <Input
                    key={i}
                    ref={(ref) => {
                      inputRef.current[i] = ref;
                    }}
                    keyboardType="number-pad"
                    maxLength={1}
                    className="border border-border rounded-md p-2 text-center text-xl w-12"
                    value={field.state.value[i] || ""}
                    onChangeText={(val) => handleChange(val, i, field)}
                  />
                ))}
              </View>
            )}
          />
          {code && <Text className="text-text text-lg">DevOtp: {code}</Text>}
        </ScrollView>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
            size={"lg"}
              onPress={() => form.handleSubmit()}
              isSubmitting={isSubmitting}
              disabled={!canSubmit || isSubmitting}
              className="bg-primary p-4 rounded-md"
            >
              <Text className="text-background text-lg">Verify</Text>
            </Button>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Verify;

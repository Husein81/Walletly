import { useForm } from "@tanstack/react-form";
import * as Localization from "expo-localization";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import CountryPicker from "react-native-country-picker-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

// local imports
import { Input, Label } from "~/components/ui";
import { Button, FieldInfo } from "~/components/ui-components";
import { useSendOtp } from "~/hooks/auth";
import { countryCallingCodes, NAV_THEME } from "~/lib/config";
import { useColorScheme } from "~/lib/useColorScheme";

const Phone = () => {
  const { mutateAsync } = useSendOtp();
  const { isDarkColorScheme } = useColorScheme();
  const [country, setCountry] = useState("IQ");

  const region = Localization.getLocales()[1]?.regionCode;

  useEffect(() => {
    if (region) {
      setCountry(region);
    }
  }, []);

  const form = useForm({
    defaultValues: {
      countryCode: countryCallingCodes[country],
      phone: "",
    },
    onSubmit: async (values) => {
      try {
        const { countryCode, phone } = values.value;
        const phoneNumber = countryCode + phone;
        const code = await mutateAsync(phoneNumber);
        router.replace({
          pathname: "/auth/verify",
          params: { code, phone: phoneNumber },
        });
      } catch (error) {
        console.error("Error sending OTP:", error);
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
          <Text className="text-4xl font-bold mb-4 text-text">
            Enter your phone number
          </Text>

          <View className="">
            <Label>Phone</Label>
            <View className="flex-1 gap-4 flex-row items-start">
              <form.Field
                name="countryCode"
                children={(field) => (
                  <View className="h-12 px-2 text-text items-center border border-border  rounded-xl flex-row ">
                    <CountryPicker
                      theme={
                        isDarkColorScheme
                          ? {
                              backgroundColor: NAV_THEME.dark.background,
                              onBackgroundTextColor: NAV_THEME.dark.text,
                              fontSize: 16,
                            }
                          : {
                              backgroundColor: NAV_THEME.light.background,
                              onBackgroundTextColor: NAV_THEME.light.text,
                              fontSize: 16,
                            }
                      }
                      countryCode={country as any}
                      withFilter
                      withFlag
                      withCallingCodeButton
                      withCallingCode
                      onSelect={(selected) => {
                        setCountry(selected.cca2);
                        field.handleChange("+" + selected.callingCode[0]);
                      }}
                    />
                  </View>
                )}
              />
              <form.Field
                name="phone"
                validators={{
                  onChange: ({ value }) =>
                    z.string().min(6).regex(/^\d+$/).safeParse(value).success
                      ? ""
                      : "Phone number must be greater than 6 digits and contain only numbers.",
                }}
                children={(field) => (
                  <View className="flex-1 gap-2">
                    <Input
                      className="rounded-xl border border-border "
                      value={field.state.value}
                      placeholder="Enter your phone number"
                      keyboardType="phone-pad"
                      onChangeText={field.handleChange}
                    />
                    <FieldInfo field={field} />
                  </View>
                )}
              />
            </View>
          </View>
        </ScrollView>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              size="lg"
              disabled={!canSubmit || isSubmitting}
              onPress={form.handleSubmit}
              className="text-text "
            >
              <Text className="text-background font-semibold">Send Otp</Text>
            </Button>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Phone;

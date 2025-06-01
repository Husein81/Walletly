import { useForm } from "@tanstack/react-form";
import { Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

// Local Imports
import { useState } from "react";
import { useCreateAccount, useUpdateAccount } from "~/hooks/accounts";
import { useColorScheme } from "~/lib/useColorScheme";
import { Account } from "~/types";
import { Input, Label } from "../ui";
import { Button, FieldInfo, IconSelector } from "../ui-components";

// Store Imports
import { useAuthStore, useModalStore } from "~/store";

type Props = {
  account?: Account;
};

const accountSchema = z.object({
  name: z.string().min(1, "Name is required"),
  balance: z.number().or(z.string()),
});

const AccountForm = ({ account }: Props) => {
  const { onClose } = useModalStore();
  const { user } = useAuthStore();

  const { isDarkColorScheme } = useColorScheme();

  const [selectedIcon, setSelectedIcon] = useState(account?.imageUrl || "pc");

  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();

  const form = useForm({
    defaultValues: {
      name: account?.name || "",
      balance: account?.balance || "0",
    },
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        imageUrl: selectedIcon,
        userId: user?.id || "",
        balance: parseFloat(value.balance.toString()),
      };
      try {
        if (account) {
          await updateAccount.mutateAsync({ ...payload, id: account.id });
        } else {
          await createAccount.mutateAsync(payload);
        }
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Account error:",
          text2: (error as Error)?.message,
        });
      }
      onClose();
    },
  });

  return (
    <View className="gap-8 flex">
      <form.Field
        name="name"
        validators={{ onChange: accountSchema.shape.name }}
        children={(field) => (
          <View className="gap-2">
            <Label>Name</Label>
            <Input
              value={field.state.value}
              onChangeText={field.handleChange}
              placeholder="Account name"
              autoCapitalize="none"
            />
            <FieldInfo field={field} />
          </View>
        )}
      />

      <form.Field
        name="balance"
        validators={{ onChange: accountSchema.shape.balance }}
        children={(field) => (
          <View className="gap-2">
            <Label>Balance</Label>
            <Input
              placeholder="Enter balance"
              keyboardType="numeric"
              value={field.state.value?.toString() ?? ""}
              onChangeText={(text) => {
                // Accept negative, positive, and decimals
                const numericValue = parseFloat(text);
                if (
                  !isNaN(numericValue) ||
                  text.includes("") ||
                  text.includes("-") ||
                  text.includes(".")
                ) {
                  // Allow empty string or negative sign
                  field.handleChange(
                    text.includes("") ||
                      text.includes("-") ||
                      text.includes(".")
                      ? text
                      : numericValue
                  );
                }
              }}
            />
            <FieldInfo field={field} />
          </View>
        )}
      />
      <View className="gap-2 ">
        <Label>Icon</Label>
        <IconSelector
          selectedIcon={selectedIcon}
          setSelectedIcon={setSelectedIcon}
        />
      </View>

      <View className="flex-row gap-4">
        <Button
          variant={"outline"}
          className="border-primary border"
          onPress={onClose}
        >
          <Text className="text-primary">Cancel</Text>
        </Button>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              disabled={!canSubmit}
              onPress={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              isSubmitting={isSubmitting}
            >
              <Text className="text-secondary font-semibold">Save</Text>
            </Button>
          )}
        />
      </View>
    </View>
  );
};

export default AccountForm;

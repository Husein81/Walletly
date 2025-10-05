import { useForm } from "@tanstack/react-form";
import { Pressable, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

// Local Imports
import {
  useCreateAccount,
  useDeleteAccount,
  useUpdateAccount,
} from "@/hooks/accounts";
import { useColorScheme } from "@/lib/useColorScheme";
import { Account } from "@/types";
import { useState } from "react";
import { Label } from "../ui";
import { Button, IconSelector, InputField } from "../ui-components";

// Store Imports
import { useAuthStore, useModalStore } from "@/store";
import { Icon } from "@/lib/icons/Icon";

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
  const deleteAccount = useDeleteAccount(account?.id ?? "");

  const handleDelete = async () => await deleteAccount.mutateAsync();

  const form = useForm({
    defaultValues: {
      name: account?.name || "",
      balance: account?.balance || "",
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
    <View className="gap-4 flex">
      <form.Field
        name="name"
        validators={{ onChange: accountSchema.shape.name }}
        children={(field) => (
          <InputField
            label="Name"
            type="text"
            field={field}
            placeholder="Name"
          />
        )}
      />

      <form.Field
        name="balance"
        validators={{ onChange: accountSchema.shape.balance }}
        children={(field) => (
          <InputField
            label="Balance"
            field={field}
            type="number"
            placeholder="0.00"
            keyboardType="numeric"
          />
        )}
      />
      <View className="gap-2 mb-4">
        <Label>Icon</Label>
        <IconSelector
          selectedIcon={selectedIcon}
          setSelectedIcon={setSelectedIcon}
        />
        <Text className="text-muted-foreground text-xs">
          Select an icon that represents this category
        </Text>
      </View>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <View className="gap-4 ">
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
            {account && (
              <Pressable onPress={handleDelete} className="active:scale-95">
                <View className="bg-destructive/10 rounded-2xl py-4 border border-destructive/30 flex-row items-center justify-center gap-2">
                  <Icon name="Trash2" size={20} color="#ef4444" />
                  <Text className="text-destructive text-base font-semibold">
                    Delete Category
                  </Text>
                </View>
              </Pressable>
            )}
          </View>
        )}
      </form.Subscribe>
    </View>
  );
};

export default AccountForm;

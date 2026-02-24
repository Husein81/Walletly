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
import { Account } from "@/types";
import { useState } from "react";
import { Label } from "../ui";
import {
  AlertDialog,
  Button,
  IconSelector,
  InputField,
} from "../ui-components";

// Store Imports
import { Icon } from "@/components/ui";
import { useAuthStore, useModalStore } from "@/store";

type Props = {
  account?: Account;
};

const accountSchema = z.object({
  name: z.string().min(1, "Name is required"),
  balance: z
    .union([z.number(), z.string()])
    .pipe(z.coerce.number().positive("Balance must be positive")),
});

const AccountForm = ({ account }: Props) => {
  const { onClose } = useModalStore();
  const { user } = useAuthStore();

  const [selectedIcon, setSelectedIcon] = useState(account?.imageUrl || "pc");

  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const deleteAccount = useDeleteAccount();

  const handleDelete = async () => {
    try {
      await deleteAccount.mutateAsync(account?.id!);
      onClose();
    } catch (error) {}
  };

  const form = useForm({
    defaultValues: {
      name: account?.name || "",
      balance: account?.balance || 0,
    },
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        imageUrl: selectedIcon,
        userId: user?.id || "",
        balance: Number(value.balance),
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
          <View className="gap-1 ">
            <Button
              className="bg-primary"
              disabled={!canSubmit}
              onPress={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              isSubmitting={isSubmitting}
            >
              <Text className="text-white font-semibold">
                {account ? "Update" : "Save"}
              </Text>
            </Button>
            {account && (
              <AlertDialog
                title="Delete Account?"
                description="Are you sure you want to delete this account? This action cannot be undone."
                action="Delete"
                icon="Trash2"
                iconColor="#f87171"
                onPress={handleDelete}
              />
            )}
          </View>
        )}
      </form.Subscribe>
    </View>
  );
};

export default AccountForm;

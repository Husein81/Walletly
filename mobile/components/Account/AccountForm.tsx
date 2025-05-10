import { useForm } from "@tanstack/react-form";
import { ActivityIndicator, Text, View } from "react-native";
import { z } from "zod";

// Local Imports
import { useCreateAccount, useUpdateAccount } from "~/hooks/accounts";
import { useAuthStore } from "~/store/authStore";
import { Account } from "~/types";
import { Button, Input, Label } from "../ui";
import { FieldInfo } from "../ui-components";
import useModalStore from "~/store/modalStore";

type Props = {
  account?: Account;
};

const accountSchema = z.object({
  name: z.string().min(1, "Name is required"),
  balance: z
    .number({ invalid_type_error: "Balance must be a number" })
    .nonnegative("Balance must be 0 or more"),
});

const AccountForm = ({ account }: Props) => {
  const { onClose } = useModalStore();
  const { user } = useAuthStore();

  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();

  const form = useForm({
    defaultValues: {
      name: account?.name || "",
      balance: account?.balance || 0,
    },
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        imageUrl: "",
        userId: user?.id || "",
      };
      console.log("Payload:", payload);
      if (account) {
        await updateAccount.mutateAsync({ ...payload, id: account.id });
      } else {
        await createAccount.mutateAsync(payload);
      }
      onClose();
    },
  });

  return (
    <View>
      <form.Field
        name="name"
        validators={{ onChange: accountSchema.shape.name }}
        children={(field) => (
          <View>
            <Label>Name</Label>
            <Input
              value={field.state.value}
              onChangeText={field.handleChange}
              placeholder="Account name"
              className="mb-4"
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
          <View>
            <Label>Balance</Label>
            <Input
              value={field.state.value.toString()}
              onChangeText={(text) => field.handleChange(parseFloat(text) || 0)}
              keyboardType="numeric"
              className="mb-4"
            />
            <FieldInfo field={field} />
          </View>
        )}
      />

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
            >
              {isSubmitting ? (
                <ActivityIndicator />
              ) : (
                <Text className="text-secondary font-semibold">Save</Text>
              )}
            </Button>
          )}
        />
      </View>
    </View>
  );
};

export default AccountForm;

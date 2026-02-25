import { Account } from "@/types";
import { GridSelector } from "./GridSelector";
import { useAuthStore } from "@/store";

type Props = {
  title: string;
  data: Account[];
  selectedAccount?: Account;
  selectedToAccount?: Account;
  target?: "from" | "to";
  onSelect: (item: Account) => void;
};

export default function AccountSelection({
  title,
  data,
  selectedAccount,
  selectedToAccount,
  target,
  onSelect,
}: Props) {
  const { user } = useAuthStore();
  const selectedId =
    target === "to" ? selectedToAccount?.id : selectedAccount?.id;

  return (
    <GridSelector<Account>
      title={title}
      data={data}
      numColumns={1}
      selectedId={selectedId}
      onSelect={onSelect}
      renderSubtitle={(acc) =>
        acc.balance !== undefined
          ? `${user?.currency?.symbol || "$"}${Number(acc.balance).toFixed(2)}`
          : null
      }
    />
  );
}

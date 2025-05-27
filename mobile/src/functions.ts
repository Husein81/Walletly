import { COLOR_PALETTE } from "~/lib/config";

const formattedBalance = (balance: number, currency = "$") =>
  balance >= 0
    ? `${currency}${Number(balance ?? 0).toFixed(2)}`
    : `-${currency}${Math.abs(balance).toFixed(2)}`;

const getColorByIndex = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLOR_PALETTE.length;
  return COLOR_PALETTE[index];
};

export { formattedBalance, getColorByIndex };

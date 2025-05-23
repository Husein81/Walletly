const formattedBalance = (balance: number) =>
  balance >= 0
    ? `$${Number(balance ?? 0).toFixed(2)}`
    : `-$${Math.abs(balance).toFixed(2)}`;

export { formattedBalance };

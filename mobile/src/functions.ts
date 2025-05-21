const formattedBalance = (balance: number) =>
  balance >= 0
    ? `$${Number(balance ?? 0).toFixed(2)}`
    : `-$${Math.abs(balance).toFixed(2)}`;

const formatDateToMMMddDay = (dateInput: string | Date): string => {
  const date = new Date(dateInput);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    weekday: "long",
  }).format(date); // e.g., "May 21, Tuesday"
};

export { formattedBalance, formatDateToMMMddDay };

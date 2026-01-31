import { ToggleOption } from "../ui-components/toggle-group";

export enum ExpenseState {
  ExpenseOverview = "EXPENSE_OVERVIEW",
  IncomeOverview = "INCOME_OVERVIEW",
  ExpenseFlow = "EXPENSE_FLOW",
  IncomeFlow = "INCOME_FLOW",
  AccountAnalysis = "ACCOUNT_ANALYSIS",
}

export const EXPENSE_STATES: ToggleOption[] = [
  {
    label: "Expense Overview",
    value: ExpenseState.ExpenseOverview,
    className: "rounded-3xl border border-border px-2",
  },
  {
    label: "Income Overview",
    value: ExpenseState.IncomeOverview,
    className: "rounded-3xl border border-border",
  },
  {
    label: "Expense Flow",
    value: ExpenseState.ExpenseFlow,
    className: "rounded-3xl border border-border px-2",
  },
  {
    label: "Income Flow",
    value: ExpenseState.IncomeFlow,
    className: "rounded-3xl border border-border px-2",
  },
  {
    label: "Account Analysis",
    value: ExpenseState.AccountAnalysis,
    className: "rounded-3xl border border-border px-2",
  },
];

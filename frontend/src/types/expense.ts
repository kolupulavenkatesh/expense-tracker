export type Category =
  | 'FOOD'
  | 'TRANSPORT'
  | 'SHOPPING'
  | 'BILLS'
  | 'ENTERTAINMENT'
  | 'HEALTH'
  | 'EDUCATION'
  | 'OTHER';

export const CATEGORIES: Category[] = [
  'FOOD',
  'TRANSPORT',
  'SHOPPING',
  'BILLS',
  'ENTERTAINMENT',
  'HEALTH',
  'EDUCATION',
  'OTHER',
];

export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: Category;
  expenseDate: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseRequest {
  title: string;
  amount: number;
  category: Category;
  expenseDate: string;
  description?: string;
}

export interface SummaryResponse {
  totalAmount: number;
  expenseCount: number;
  currentMonthTotal: number;
  categoryBreakdown: Record<string, number>;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  fieldErrors?: Record<string, string>;
}

export interface FilterParams {
  search?: string;
  category?: Category | '';
  from?: string;
  to?: string;
}

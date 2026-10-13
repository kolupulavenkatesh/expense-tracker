import api from './api';
import {
  Expense,
  ExpenseRequest,
  SummaryResponse,
  Category,
  FilterParams,
} from '../types/expense';

export const expenseService = {
  async getExpenses(params?: FilterParams): Promise<Expense[]> {
    const cleanParams: Record<string, string> = {};
    if (params?.search?.trim()) {
      cleanParams.search = params.search.trim();
    }
    if (params?.category) {
      cleanParams.category = params.category;
    }
    if (params?.from) {
      cleanParams.from = params.from;
    }
    if (params?.to) {
      cleanParams.to = params.to;
    }

    const response = await api.get<Expense[]>('/expenses', {
      params: cleanParams,
    });
    return response.data;
  },

  async getExpenseById(id: number): Promise<Expense> {
    const response = await api.get<Expense>(`/expenses/${id}`);
    return response.data;
  },

  async createExpense(data: ExpenseRequest): Promise<Expense> {
    const response = await api.post<Expense>('/expenses', data);
    return response.data;
  },

  async updateExpense(id: number, data: ExpenseRequest): Promise<Expense> {
    const response = await api.put<Expense>(`/expenses/${id}`, data);
    return response.data;
  },

  async deleteExpense(id: number): Promise<void> {
    await api.delete(`/expenses/${id}`);
  },

  async getSummary(from?: string, to?: string): Promise<SummaryResponse> {
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;

    const response = await api.get<SummaryResponse>('/expenses/summary', {
      params,
    });
    return response.data;
  },

  async getCategories(): Promise<Category[]> {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },
};

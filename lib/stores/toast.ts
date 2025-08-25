import { create } from "zustand";

export type Toast = {
  id: string;
  type: "error" | "info" | "success" | "promo" | "scrap";
  title: string;
  description?: string;
};

export type ToastStore = {
  toasts: Toast[];
  add: (toast: Toast) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useToastStore = create<ToastStore>()((set) => ({
  toasts: [],
  add: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, toast],
    })),
  remove: (id) =>
    set((state) => {
      return { toasts: state.toasts.filter((t: Toast) => t.id !== id) };
    }),
  clear: () =>
    set((state) => {
      return { toasts: [] };
    }),
}));

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type CursorState = {
  cursor: number;
  setCursor: (cursor: number) => void;
  updateCursor: (updater: (prev: number) => number) => void;
};

export const useCursorStore = create<CursorState>()(
  persist(
    (set) => ({
      cursor: 0,
      setCursor: (cursor) => set({ cursor }),
      updateCursor: (updater) =>
        set((state) => ({
          cursor: updater(state.cursor),
        })),
    }),
    {
      name: "cursor",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

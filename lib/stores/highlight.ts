import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getTodayString = () => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
};

type highlightStore = {
  lastVisit: string;
  setLastVisitNow: () => void;
  isVisited: () => boolean;
};

export const initialHighlight = {
  lastVisit: "",
};

export const useHighlightStore = create<highlightStore>()(
  persist(
    (set, get) => ({
      ...initialHighlight,
      setLastVisitNow: () =>
        set((state) => {
          state.lastVisit = getTodayString();
          return state;
        }),
      isVisited: () => {
        return get().lastVisit === getTodayString();
      },
    }),
    {
      name: "news5min",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type NewsGuideState = {
  viewed: boolean;
  setViewed: () => void;
};

export const useNewsGuideStore = create<NewsGuideState>()(
  persist(
    (set) => ({
      viewed: false,
      setViewed: () => set({ viewed: true }),
    }),
    {
      name: "news-guide",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

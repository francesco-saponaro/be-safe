import { create } from "zustand";
import { Auth } from "@/types/auth";

const useAuthStore = create<Auth>((set) => ({
  user: null,
  setUser: (user: any) => set({ user }),
}));

export default useAuthStore;

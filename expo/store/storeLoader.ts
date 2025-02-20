import { create } from "zustand";
import { Loader } from "../types";

const useLoaderStore = create<Loader>((set) => ({
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
}));

export default useLoaderStore;

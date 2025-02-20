import { create } from "zustand";
import { collection, getDocs, DocumentData } from "firebase/firestore";
import { auth, db } from "@/utils/firebaseConfig";

const useUserStore = create<DocumentData>((set, get) => ({
  users: [],
  setUsers: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const users = querySnapshot.docs.map((doc) => doc.data());
      set({ users });
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },
}));

export default useUserStore;

import * as TaskManager from "expo-task-manager";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/utils/firebaseConfig";

const LOCATION_TASK_NAME = "background-location-task";

TaskManager.defineTask(
  LOCATION_TASK_NAME,
  async ({
    data,
    error,
  }: {
    data?: { locations: any[] };
    error?: TaskManager.TaskManagerError | null;
  }) => {
    if (error) {
      console.error("Background location task error:", error);
      return;
    }

    if (data) {
      const { locations } = data;
      const location = locations[0]; // Use the latest location
      if (location) {
        const { latitude, longitude } = location.coords;

        // Update the backend with the new location
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userDocRef = doc(db, "users", currentUser.uid);
          await updateDoc(userDocRef, {
            location: { latitude, longitude },
          });
        }
      }
    }
  }
);

export { LOCATION_TASK_NAME };

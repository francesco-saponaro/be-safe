import { doc, setDoc } from "firebase/firestore";
import Toast from "react-native-toast-message";

const updateUserCoords = async (
  db: any,
  userId: string,
  latitude: number,
  longitude: number
) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { latitude, longitude }, { merge: true });
  } catch (error) {
    console.error("Error updating user location:", error);
    Toast.show({
      type: "error",
      text1: "Error updating user location.",
      text2: "",
    });
  }
};

export default updateUserCoords;

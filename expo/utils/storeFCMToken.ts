import { doc, setDoc } from "firebase/firestore";
import Toast from "react-native-toast-message";

const storeFCMToken = async (db: any, userId: string, fcmToken: string) => {
  try {
    // const token = await messaging().getToken();
    const userRef = doc(db, "users", userId);
    await setDoc(
      userRef,
      { fcmToken }, // Add or update the FCM fcmToken
      { merge: true }
    );
    console.log("FCM fcmToken stored successfully:", fcmToken);
  } catch (error) {
    console.error("Error storing FCM token:", error);
    Toast.show({
      type: "error",
      text1: "Error storing FCM token.",
      text2: "",
    });
  }
};

export default storeFCMToken;

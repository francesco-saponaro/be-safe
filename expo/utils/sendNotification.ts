import { doc, getDoc } from "firebase/firestore";
import Toast from "react-native-toast-message";

const sendNotification = async (
  db: any,
  recipientId: string,
  type: string,
  data: any = {}
) => {
  try {
    // Fetch recipient's FCM token from Firestore
    const recipientDoc = await getDoc(doc(db, "users", recipientId));
    if (!recipientDoc.exists()) {
      console.warn("Recipient does not exist.");
      Toast.show({
        type: "error",
        text1: "Recipient does not exist.",
        text2: "",
      });
      return;
    }

    const { fcmToken } = recipientDoc.data();
    if (!fcmToken) {
      console.warn("Recipient FCM token is missing.");
      Toast.show({
        type: "error",
        text1: "Recipient FCM token is missing.",
        text2: "",
      });
      return;
    }

    // Payload for Firebase Cloud Messaging
    const payload = {
      notification: {
        title:
          type === "location"
            ? "Location Shared"
            : type === "chat"
            ? "New Chat Request"
            : "Incoming Video Call",
        body:
          type === "location"
            ? "A user has shared their location with you."
            : type === "chat"
            ? "A user wants to chat with you."
            : "A user is requesting a video call.",
      },
      data: {
        type,
        ...data,
      },
    };

    // Send notification via FCM
    const response = await fetch("https://your-backend-url/send-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fcmToken, ...payload }),
    });

    if (response.ok) {
      console.log("Notification sent successfully.");
    } else {
      console.error("Failed to send notification:", await response.text());
      Toast.show({
        type: "error",
        text1: "Failed to send notification",
        text2: "",
      });
    }
  } catch (error) {
    console.error("Error sending notification:", error);
    Toast.show({
      type: "error",
      text1: "Error sending notification",
      text2: "",
    });
  }
};

export default sendNotification;

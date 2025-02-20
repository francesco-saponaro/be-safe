import { useEffect } from "react";
// import messaging from "@react-native-firebase/messaging"; // Firebase library for handling push notifications.
import Toast from "react-native-toast-message"; // Library for displaying toast notifications in the app.
import { useRouter } from "expo-router"; // Router for navigation.
import ROUTES from "@/constants/Routes"; // Application routes/constants.
import * as Notifications from "expo-notifications";

const useNotifications = () => {
  const router = useRouter();

  useEffect(() => {
    // Request notification permissions
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: "error",
          text1: "Permission Denied",
          text2: "Please enable notifications for this app in your settings.",
        });
      }
    };

    // Configure notification handling
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Handle notification interactions
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const { data } = response.notification.request.content;

        if (data?.type === "chat") {
          router.push({
            pathname: ROUTES.CHAT,
            params: { senderId: String(data.senderId) },
          });
        } else if (data?.type === "video") {
          router.push({
            pathname: ROUTES.VIDEOCHAT,
            params: { senderId: String(data.senderId) },
          });
        } else if (data?.type === "location") {
          router.push({
            pathname: ROUTES.CHAT,
            params: {
              senderId: String(data.senderId),
              location: JSON.stringify(data.location),
            },
          });
        }
      }
    );

    // Request permissions on mount
    requestPermissions();

    // Cleanup
    return () => {
      subscription.remove();
    };
  }, [router]);
};

export default useNotifications;

// // Request Notification Permissions
// const requestNotificationPermission = async () => {
//   const authStatus = await messaging().requestPermission();

//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//   if (!enabled) {
//     Toast.show({
//       type: "error",
//       text1: "Permission Denied",
//       text2: "Please enable notifications for this app in your settings.",
//     });
//   }
// };

// // Get FCM Token
// const getToken = async () => {
//   try {
//     const token = await messaging().getToken();
//     console.log("FCM Token:", token);
//     // Send this token to your backend to associate with the user.
//   } catch (error) {
//     console.error("Error fetching FCM token:", error);
//   }
// };

// // Handle Notification Interaction Logic
// const handleNotificationInteraction = (remoteMessage: any) => {
//   const { data } = remoteMessage;

//   if (data?.type === "chat") {
//     console.log("Open Chat:", data.senderId);
//     router.push({
//       pathname: ROUTES.CHAT,
//       params: { senderId: String(data.senderId) },
//     });
//   } else if (data?.type === "video") {
//     console.log("Incoming Video Call:", data.senderId);
//     router.push({
//       pathname: ROUTES.VIDEOCHAT,
//       params: { senderId: String(data.senderId) },
//     });
//   } else if (data?.type === "location") {
//     console.log("Location Shared:", data.location);
//     router.push({
//       pathname: ROUTES.CHAT,
//       params: {
//         senderId: String(data.senderId),
//         location: JSON.stringify(data.location),
//       },
//     });
//   }
// };

// // Handle Notifications in Foreground
// const unsubscribeForeground = messaging().onMessage(
//   async (remoteMessage) => {
//     if (!remoteMessage.notification) return null; // Skip if no notification payload.

//     console.log("Notification received in foreground:", remoteMessage);

//     Toast.show({
//       type: "info",
//       text1: remoteMessage.notification.title,
//       text2: remoteMessage.notification.body,
//     });

//     handleNotificationInteraction(remoteMessage); // Handle notification data if needed.
//   }
// );

// // Handle Notifications When App is Opened from Background
// const unsubscribeBackground = messaging().onNotificationOpenedApp(
//   (remoteMessage) => {
//     if (!remoteMessage.notification) return null;

//     console.log(
//       "Notification caused app to open from background:",
//       remoteMessage
//     );

//     Toast.show({
//       type: "info",
//       text1: remoteMessage.notification.title,
//       text2: remoteMessage.notification.body,
//     });

//     handleNotificationInteraction(remoteMessage); // Handle navigation or other logic.
//   }
// );

// // Handle Notifications When App is Opened from a Closed State
// messaging()
//   .getInitialNotification()
//   .then((remoteMessage) => {
//     if (!remoteMessage || !remoteMessage.notification) return null;

//     console.log(
//       "Notification caused app to open from closed state:",
//       remoteMessage
//     );

//     Toast.show({
//       type: "info",
//       text1: remoteMessage.notification.title,
//       text2: remoteMessage.notification.body,
//     });

//     handleNotificationInteraction(remoteMessage); // Handle navigation or other logic.
//   });

// // Request permissions and fetch token on initialization
// requestNotificationPermission();
// getToken();

// // Cleanup subscriptions
// return () => {
//   unsubscribeForeground();
//   unsubscribeBackground();
// };

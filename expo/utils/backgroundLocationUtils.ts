import * as Location from "expo-location";
import { LOCATION_TASK_NAME } from "./backgroundLocationTask";
import Toast from "react-native-toast-message";

export const startBackgroundLocationTracking = async () => {
  const { status } = await Location.requestBackgroundPermissionsAsync();
  if (status === "granted") {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.High,
      distanceInterval: 50, // Update every 50 meters
      foregroundService: {
        notificationTitle: "App is tracking your location",
        notificationBody: "Location tracking is active.",
      },
    });
  } else {
    console.warn("Background location permission not granted");
    Toast.show({
      type: "error",
      text1: "Permission Denied",
      text2: "Background location permission not granted",
    });
  }
};

export const stopBackgroundLocationTracking = async () => {
  await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
};

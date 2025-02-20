import { Tabs } from "expo-router";
import { Platform, Dimensions, View } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import { Ionicons } from "@expo/vector-icons";
import TabBarBackground from "@/components/ui/TabBarBackground";
import useNotifications from "@/hooks/useNotifications";
import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/utils/firebaseConfig";
import ROUTES from "@/constants/Routes";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import storeFCMToken from "@/utils/storeFCMToken";
import { AppState } from "react-native";
import {
  startBackgroundLocationTracking,
  stopBackgroundLocationTracking,
} from "@/utils/backgroundLocationUtils";
import {
  startForegroundLocationTracking,
  stopForegroundLocationTracking,
} from "@/utils/foregroundLocationUtils";
import useLoaderStore from "@/store/storeLoader";
import GlobalLoader from "@/components/GlobalLoader";
const isSmallScreen = Dimensions.get("window").width < 600;

export default function TabsLayout() {
  const { setLoading } = useLoaderStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Initialize location, notification token and auth listeners on app start
  useEffect(() => {
    setLoading(true);
    let tokenListenerSubscription: any = null;
    let appStateSubscription: any = null;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userId = user.uid;

        // Get the FCM token and update Firestore
        const getFCMToken = async () => {
          const token = await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig?.extra?.eas.projectId,
          });
          return token.data;
        };
        const fcmToken = await getFCMToken();
        if (fcmToken) await storeFCMToken(db, userId, fcmToken);

        // Update the FCM token in Firestore when it changes
        tokenListenerSubscription = Notifications.addPushTokenListener(
          async (newToken) => {
            console.log("FCM Token refreshed globally:", newToken.data);
            await storeFCMToken(db, userId, newToken.data);
          }
        );

        // Start background and foreground location permissions and tracking when the app is opened
        appStateSubscription = AppState.addEventListener(
          "change",
          (nextAppState) => {
            if (nextAppState === "active") {
              startBackgroundLocationTracking();
              startForegroundLocationTracking();
            } else {
              stopBackgroundLocationTracking();
              stopForegroundLocationTracking();
            }
          }
        );

        setIsAuthenticated(true);
      } else {
        // Clean up listeners and stop location tracking when the user logs out
        tokenListenerSubscription?.remove();
        tokenListenerSubscription = null;
        appStateSubscription?.remove();
        appStateSubscription = null;
        stopBackgroundLocationTracking();
        stopForegroundLocationTracking();
        setIsAuthenticated(false);
      }
      setAuthChecked(true);
      setLoading(false);
    });

    return () => {
      // Clean up listeners on component unmount
      unsubscribe();
      tokenListenerSubscription?.remove();
      appStateSubscription?.remove();
    };
  }, []);

  // Initialize notifications
  useNotifications();

  // Redirect based on authentication
  if (!isAuthenticated && authChecked) {
    console.log("isAuthenticated", isAuthenticated);
    return <Redirect href={ROUTES.SIGN_IN} />;
  }

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: !isSmallScreen,
          tabBarActiveTintColor: "#ec4899",
          tabBarInactiveTintColor: "#9ca3af",
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: {
            backgroundColor: "#ffffff",
            borderRadius: 28,
            marginHorizontal: 16,
            marginBottom: 16,
            paddingVertical: 8,
            height: 64,
            ...Platform.select({
              ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
              },
              android: {
                elevation: 4,
              },
            }),
          },
          tabBarItemStyle: {
            paddingVertical: 8,
          },
          tabBarIconStyle: {
            marginBottom: 4,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "500",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <TabIcon name="home-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="chatScreen"
          options={{
            title: "Chat",
            tabBarIcon: ({ color, size }) => (
              <TabIcon name="chatbubble-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="videoCallScreen"
          options={{
            title: "Video",
            tabBarIcon: ({ color, size }) => (
              <TabIcon name="videocam-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="accountScreen"
          options={{
            title: "Account",
            tabBarIcon: ({ color, size }) => (
              <TabIcon name="person-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="emergencyNumbersScreen"
          options={{
            title: "Emergency",
            tabBarIcon: ({ color, size }) => (
              <TabIcon name="call-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            href: null,
          }}
        />
      </Tabs>
      <GlobalLoader />
    </>
  );
}

const TabIcon = ({
  name,
  color,
  size,
}: {
  name: any;
  color: string;
  size: number;
}) => (
  <View
    style={{
      backgroundColor: color === "#ec4899" ? "#fdf2f8" : "transparent",
      borderRadius: 12,
      padding: 6,
    }}
  >
    <Ionicons name={name} size={size} color={color} />
  </View>
);

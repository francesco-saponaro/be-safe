import { Tabs, Redirect } from "expo-router";
import { Platform, View } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import ROUTES from "@/constants/Routes";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/utils/firebaseConfig";

export default function TabLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setAuthChecked(true);
    });
    return unsubscribe;
  }, []);

  if (authChecked && isAuthenticated) {
    return <Redirect href={ROUTES.HOME} />;
  }

  return (
    <Tabs
      screenOptions={{
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
          title: "Sign In",
          tabBarIcon: ({ color, size }) => (
            <View
              style={{
                backgroundColor:
                  color === "#ec4899" ? "#fdf2f8" : "transparent",
                borderRadius: 12,
                padding: 6,
              }}
            >
              <Ionicons name="log-in-outline" size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="sign-up"
        options={{
          title: "Sign Up",
          tabBarIcon: ({ color, size }) => (
            <View
              style={{
                backgroundColor:
                  color === "#ec4899" ? "#fdf2f8" : "transparent",
                borderRadius: 12,
                padding: 6,
              }}
            >
              <Ionicons name="person-add-outline" size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="forgot-password"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

import "dotenv/config";

export default {
  expo: {
    name: "be-safe",
    slug: "be-safe",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    extra: {
      FIREBASE_KEY: process.env.FIREBASE_KEY,
      eas: {
        projectId: "3e1f820b-9645-45a5-8389-b3c44ee2ae3c",
      },
    },
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSLocationAlwaysAndWhenInUseUsageDescription:
          "Your description for location access always and when in use.",
        NSLocationWhenInUseUsageDescription:
          "Your description for location access when in use.",
        NSLocationAlwaysUsageDescription:
          "Your description for always location access.",
        UIBackgroundModes: ["location"],
        ITSAppUsesNonExemptEncryption: false,
      },
      bundleIdentifier: "com.yourcompany.yourapp",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION",
      ],
      package: "com.yourcompany.yourapp",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      [
        "expo-camera",
        {
          cameraPermission: "Allow $(PRODUCT_NAME) to access your camera.",
          microphonePermission:
            "Allow $(PRODUCT_NAME) to access your microphone.",
        },
      ],
      [
        "expo-notifications",
        // {
        //   "icon": "./assets/notification-icon.png", // Optional: Custom notification icon
        //   "color": "#ffffff", // Optional: Notification color
        //   "sounds": ["./assets/notification-sound.wav"] // Optional: Custom notification sound
        // }
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
  },
};

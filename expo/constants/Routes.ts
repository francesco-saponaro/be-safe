const ROUTES = {
  HOME: "/(tabs)",
  SIGN_IN: "/auth",
  SIGN_UP: "/auth/(tabs)/sign-up",
  FORGOT_PASSWORD: "/auth/(tabs)/forgot-password",
  CHAT: "/(tabs)/chatScreen",
  VIDEOCHAT: "/(tabs)/videoCallScreen",
} as const;

export default ROUTES;

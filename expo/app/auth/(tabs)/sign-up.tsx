import React from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Formik } from "formik";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
// import messaging from "@react-native-firebase/messaging";
import {
  INITIAL_VALUES_SIGNUP,
  VALIDATION_SCHEMA_SIGNUP,
} from "@/constants/Formik";
import ROUTES from "@/constants/Routes";
import useLoaderStore from "@/store/storeLoader";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import * as Location from "expo-location";
import Toast from "react-native-toast-message";
import { auth, db } from "@/utils/firebaseConfig";

const SignUpScreen = () => {
  const router = useRouter();
  const { setLoading } = useLoaderStore();

  const handleSignUp = async (values: {
    email: string;
    password: string;
    name: string;
    reachable: boolean;
  }) => {
    setLoading(true);
    const { email, password, name, reachable } = values;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Get FCM Token
      const getFCMToken = async () => {
        const token = await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas.projectId, // Replace with your Expo project ID
        });
        return token.data; // This is the FCM token
      };

      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: "error",
          text1: "Permission Denied",
          text2: "Background location permission not granted",
        });
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Save user data in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        reachable,
        latitude,
        longitude,
        fcmToken: await getFCMToken(),
      });

      // Navigate to the Home screen
      router.push(ROUTES.HOME);
    } catch (error) {
      console.error("Error signing up: ", error);
      Toast.show({
        type: "error",
        text1: "Error signing up.",
        text2: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.page}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Formik
          initialValues={INITIAL_VALUES_SIGNUP}
          validationSchema={VALIDATION_SCHEMA_SIGNUP}
          onSubmit={handleSignUp}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            isSubmitting,
          }) => (
            <View style={styles.container}>
              <View style={styles.card}>
                <Text style={styles.header}>Create Account</Text>
                <Text style={styles.subHeader}>Join our community today</Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.error}>{errors.email}</Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Create a password"
                    secureTextEntry
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    autoCapitalize="none"
                  />
                  {touched.password && errors.password && (
                    <Text style={styles.error}>{errors.password}</Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    value={values.name}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                  />
                  {touched.name && errors.name && (
                    <Text style={styles.error}>{errors.name}</Text>
                  )}
                </View>

                <View style={styles.switchContainer}>
                  <View style={styles.switchLabel}>
                    <Text style={styles.label}>Be Reachable</Text>
                    <Text style={styles.switchDescription}>
                      Allow others to contact you
                    </Text>
                  </View>
                  <Switch
                    value={values.reachable}
                    onValueChange={(value) => {
                      setFieldValue("reachable", value).catch((err) =>
                        console.error(err)
                      );
                    }}
                    trackColor={{ false: "#e5e7eb", true: "#fecdd3" }}
                    thumbColor={values.reachable ? "#ec4899" : "#9ca3af"}
                    ios_backgroundColor="#e5e7eb"
                  />
                </View>

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => handleSubmit()}
                  disabled={isSubmitting}
                >
                  <Text style={styles.primaryButtonText}>Create Account</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => router.push(ROUTES.SIGN_IN)}
                >
                  <Text style={styles.secondaryButtonText}>
                    Already have an account? Sign in
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fdf2f8",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    padding: 20,
    width: "100%",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
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
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    height: 48,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1f2937",
  },
  error: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingVertical: 8,
  },
  switchLabel: {
    flex: 1,
  },
  switchDescription: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  primaryButton: {
    height: 48,
    backgroundColor: "#ec4899",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  secondaryButtonText: {
    color: "#ec4899",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default SignUpScreen;

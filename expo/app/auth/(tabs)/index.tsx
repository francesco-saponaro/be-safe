import React from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Formik } from "formik";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  INITIAL_VALUES_LOGIN,
  VALIDATION_SCHEMA_LOGIN,
} from "@/constants/Formik";
import useLoaderStore from "@/store/storeLoader";
import Toast from "react-native-toast-message";
import { auth } from "@/utils/firebaseConfig";
import ROUTES from "@/constants/Routes";

const SignInScreen = () => {
  const router = useRouter();
  const { setLoading } = useLoaderStore();

  const handleSignIn = (values: { email: string; password: string }) => {
    setLoading(true);
    const { email, password } = values;
    signInWithEmailAndPassword(auth, email, password)
      .catch((error) => {
        console.error("Error signing in: ", error);
        Toast.show({
          type: "error",
          text1: "Error signing in.",
          text2: "",
        });
      })
      .finally(() => setLoading(false));
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
          initialValues={INITIAL_VALUES_LOGIN}
          validationSchema={VALIDATION_SCHEMA_LOGIN}
          onSubmit={handleSignIn}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <View style={styles.container}>
              <View style={styles.card}>
                <Text style={styles.header}>Welcome Back</Text>
                <Text style={styles.subHeader}>
                  Sign in to continue learning
                </Text>

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
                    placeholder="Enter your password"
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

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => handleSubmit()}
                  disabled={isSubmitting}
                >
                  <Text style={styles.primaryButtonText}>Sign In</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => router.push(ROUTES.FORGOT_PASSWORD)}
                >
                  <Text style={styles.secondaryButtonText}>
                    Forgot Password?
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
    backgroundColor: "#fdf2f8", // Lighter pink background
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
  primaryButton: {
    height: 48,
    backgroundColor: "#ec4899", // Pink color matching the screenshot
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

export default SignInScreen;

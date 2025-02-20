import React from "react";
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
import { useRouter } from "expo-router";
import { Formik, FormikHelpers } from "formik";
import { sendPasswordResetEmail } from "firebase/auth";
import {
  INITIAL_VALUES_FORGOT,
  VALIDATION_SCHEMA_FORGOT,
} from "@/constants/Formik";
import ROUTES from "@/constants/Routes";
import { auth } from "@/utils/firebaseConfig";

const ForgotPasswordScreen = () => {
  const router = useRouter();

  const handlePasswordReset = async (
    values: { email: string },
    { setSubmitting, setStatus }: FormikHelpers<{ email: string }>
  ) => {
    const { email } = values;

    try {
      await sendPasswordResetEmail(auth, email);
      setStatus("Password reset email sent. Check your inbox.");
    } catch (error) {
      console.error("Error resetting password: ", error);
      setStatus("Failed to send password reset email. Please try again.");
    } finally {
      setSubmitting(false);
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
          initialValues={INITIAL_VALUES_FORGOT}
          validationSchema={VALIDATION_SCHEMA_FORGOT}
          onSubmit={handlePasswordReset}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            status,
          }) => (
            <View style={styles.container}>
              <View style={styles.card}>
                <Text style={styles.header}>Forgot Password</Text>
                <Text style={styles.subHeader}>
                  Enter your email to reset your password
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

                {status && <Text style={styles.message}>{status}</Text>}

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => handleSubmit()}
                  disabled={isSubmitting}
                >
                  <Text style={styles.primaryButtonText}>
                    {isSubmitting ? "Sending..." : "Send Reset Email"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => router.push(ROUTES.SIGN_IN)}
                >
                  <Text style={styles.secondaryButtonText}>
                    Back to Sign In
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
  message: {
    textAlign: "center",
    color: "#10b981",
    marginBottom: 16,
    fontSize: 14,
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

export default ForgotPasswordScreen;

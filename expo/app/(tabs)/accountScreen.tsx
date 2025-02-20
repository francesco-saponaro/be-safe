import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
} from "react-native";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "@/utils/firebaseConfig";
import Toast from "react-native-toast-message";

const Account = () => {
  const user = auth.currentUser;
  const [reachable, setReachable] = useState(false);

  // Fetch user details from Firestore
  useEffect(() => {
    if (user) {
      const docRef = doc(db, "users", user.uid);
      getDoc(docRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setReachable(data.reachable);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [user]);

  // Update the reachability setting in Firestore
  const updateReachability = async (newReachable: boolean) => {
    if (user) {
      try {
        await updateDoc(doc(db, "users", user.uid), {
          reachable: newReachable,
        });
        setReachable(newReachable);
        Toast.show({
          type: "success",
          text1: "Reachability updated",
        });
      } catch (err) {
        console.error("Error updating reachability:", err);
        Toast.show({
          type: "error",
          text1: "Error updating reachability",
        });
      }
    }
  };

  // Delete the user's account (and optionally remove the Firestore doc)
  const deleteAccount = async () => {
    if (user) {
      try {
        // Optionally, delete the user document from Firestore
        await deleteDoc(doc(db, "users", user.uid));
        // Delete the Firebase auth user
        await user.delete();
        Toast.show({
          type: "success",
          text1: "Account deleted",
        });
      } catch (err) {
        console.error("Error deleting account:", err);
        Toast.show({
          type: "error",
          text1: "Error deleting account",
        });
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.header}>Account</Text>

          <View style={styles.card}>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.infoText}>{user?.displayName || "N/A"}</Text>
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.infoText}>{user?.email || "N/A"}</Text>
            </View>

            <View style={styles.switchContainer}>
              <Text style={styles.label}>Be Reachable</Text>
              <Switch
                value={reachable}
                onValueChange={(value) => updateReachability(value)}
                trackColor={{ false: "#e5e7eb", true: "#fecdd3" }}
                thumbColor={reachable ? "#ec4899" : "#9ca3af"}
                ios_backgroundColor="#e5e7eb"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.deleteButton} onPress={deleteAccount}>
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fdf2f8",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    padding: 20,
    maxWidth: 500,
    width: "100%",
    alignSelf: "center",
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
    color: "#1f2937",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
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
  infoContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
    fontWeight: "500",
  },
  infoText: {
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "600",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Account;

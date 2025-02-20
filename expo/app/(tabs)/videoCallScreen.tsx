import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Platform,
  SafeAreaView,
} from "react-native";
import { WebView } from "react-native-webview"; // For native platforms
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import Toast from "react-native-toast-message";
import ROUTES from "@/constants/Routes";
import sendNotification from "@/utils/sendNotification";
import { auth, db } from "@/utils/firebaseConfig";

const VideoCallScreen: React.FC = () => {
  const { senderId } = useLocalSearchParams();
  const router = useRouter();

  const currentUser = auth.currentUser;

  const [senderName, setSenderName] = useState<string | null>(null);
  const [senderLeft, setSenderLeft] = useState(false);

  useEffect(() => {
    if (!senderId || !db) {
      Toast.show({
        type: "error",
        text1: "No sender ID provided.",
      });
      router.push(ROUTES.HOME);
      return;
    }

    updateCallStatus("joined");

    const unsubscribe = onSnapshot(
      doc(db, "calls", senderId as string),
      (docSnapshot) => {
        const data = docSnapshot.data();
        if (data) {
          setSenderName(data.senderName);
          if (data.status === "left") {
            setSenderLeft(true);
          }
        }
      }
    );

    return () => {
      unsubscribe();
      updateCallStatus("left");
    };
  }, [senderId]);

  const updateCallStatus = async (status: string) => {
    if (senderId) {
      await setDoc(
        doc(db, "calls", senderId as string),
        { status, senderName: currentUser?.displayName || "Anonymous" },
        { merge: true }
      );
    }
  };

  // Construct the Daily.co call URL using the senderId as the room name.
  // Replace `your-domain` with your actual Daily.co domain.
  const roomName = senderId as string;
  const dailyCallUrl = `https://your-domain.daily.co/embed/${roomName}`;

  return (
    <SafeAreaView style={styles.container}>
      {senderLeft ? (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>
            {senderName || "The sender"} has left the room.
          </Text>
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => {
              sendNotification(db, senderId as string, "chat", {
                senderId: auth.currentUser?.uid,
              });
            }}
          >
            <Text style={styles.buttonText}>Chat with {senderName}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {Platform.OS === "web" ? (
            <iframe
              src={dailyCallUrl}
              style={styles.iframe}
              allow="camera; microphone; fullscreen; speaker"
              title="Daily.co Call"
            />
          ) : (
            <WebView
              source={{ uri: dailyCallUrl }}
              style={styles.videoContainer}
            />
          )}
        </>
      )}

      <TouchableOpacity
        style={styles.endCallButton}
        onPress={() => {
          updateCallStatus("left");
          router.push(ROUTES.HOME);
        }}
      >
        <Text style={styles.endCallText}>End Call</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdf2f8", // Lighter pink background
  },
  videoContainer: {
    flex: 1,
    backgroundColor: "#000000", // Black background for video
  },
  iframe: {
    flex: 1,
    borderWidth: 0,
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fdf2f8",
    padding: 20,
  },
  messageText: {
    color: "#1f2937", // Dark gray text for better readability
    fontSize: 18,
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "500",
  },
  chatButton: {
    backgroundColor: "#ec4899", // Pink button matching our theme
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
  endCallButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#ef4444", // Red color for end call
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  endCallText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default VideoCallScreen;

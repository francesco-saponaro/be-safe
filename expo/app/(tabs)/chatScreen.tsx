import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  DocumentData,
  Timestamp,
} from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import sendNotification from "@/utils/sendNotification";
import Toast from "react-native-toast-message";
import { Message } from "@/types/message";
import { auth, db } from "@/utils/firebaseConfig";
import ROUTES from "@/constants/Routes";

const ChatScreen = () => {
  const { senderId, location } = useLocalSearchParams();
  const [messages, setMessages] = useState<DocumentData[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const router = useRouter();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!senderId) {
      console.warn("No senderId provided");
      router.push(ROUTES.HOME);
      return;
    }

    const messagesRef = collection(db, "chats", senderId as string, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(loadedMessages);
    });

    return unsubscribe;
  }, [senderId]);

  useEffect(() => {
    if (location && senderId && currentUser) {
      const message = {
        text: `Shared location: ${JSON.parse(location as string)}`,
        senderId: currentUser?.uid,
        receiverId: senderId as string,
        timestamp: Timestamp.fromDate(new Date()),
        isLocation: true,
      };
      addMessage(message);
    }
  }, [location]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !senderId || !currentUser) return;

    const message = {
      text: newMessage,
      senderId: currentUser.uid,
      receiverId: senderId as string,
      timestamp: Timestamp.fromDate(new Date()),
      isLocation: false,
    };

    await addMessage(message);
    setNewMessage("");

    await sendNotification(db, senderId as string, "chat", {
      senderId: currentUser?.uid,
      message: newMessage,
    });
  };

  const addMessage = async (message: Message) => {
    try {
      const messagesRef = collection(
        db,
        "chats",
        senderId as string,
        "messages"
      );
      await addDoc(messagesRef, message);
    } catch (error) {
      console.error("Error sending message:", error);
      Toast.show({
        type: "error",
        text1: "Error Sending Message",
        text2: "Please try again later.",
      });
    }
  };

  const renderMessage = ({ item }: DocumentData) => (
    <View
      style={[
        styles.messageContainer,
        item.senderId === currentUser?.uid
          ? styles.sentMessage
          : styles.receivedMessage,
      ]}
    >
      <Text style={styles.messageText}>
        {item.isLocation ? (
          <Text style={styles.locationText}>{item.text}</Text>
        ) : (
          item.text
        )}
      </Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp.seconds * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chat with User</Text>
        </View>
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          inverted
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fdf2f8",
  },
  container: {
    flex: 1,
    backgroundColor: "#fdf2f8",
  },
  header: {
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3e8ff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    marginVertical: 4,
    padding: 12,
    borderRadius: 20,
    maxWidth: "80%",
  },
  sentMessage: {
    backgroundColor: "#ec4899",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  receivedMessage: {
    backgroundColor: "#ffffff",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: "#ffffff",
  },
  locationText: {
    color: "#fdf2f8",
    textDecorationLine: "underline",
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: "flex-end",
    color: "rgba(255, 255, 255, 0.7)",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f3e8ff",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    fontSize: 16,
    backgroundColor: "#f9fafb",
    color: "#1f2937",
  },
  sendButton: {
    backgroundColor: "#ec4899",
    borderRadius: 24,
    padding: 10,
  },
});

export default ChatScreen;

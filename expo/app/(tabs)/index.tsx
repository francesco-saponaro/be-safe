import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useRouter } from "expo-router";
import { DocumentData, doc, getDoc } from "firebase/firestore";
import useUserStore from "@/store/storeUsers";
import { LocationObjectCoords } from "expo-location";
import Toast from "react-native-toast-message";
import ROUTES from "@/constants/Routes";
import sendNotification from "@/utils/sendNotification";
import useLoaderStore from "@/store/storeLoader";
import { auth, db } from "@/utils/firebaseConfig";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const HomeScreen = () => {
  const { users, setUsers } = useUserStore();
  const { loading, setLoading } = useLoaderStore();
  const router = useRouter();
  const [userLocation, setUserLocation] =
    useState<LocationObjectCoords | null>();
  const [selectedUser, setSelectedUser] = useState<DocumentData | null>(null);

  // Fetch current user's location from Firestore and set location state with it
  useEffect(() => {
    const fetchUserLocation = async () => {
      setLoading(true);
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.warn("No logged-in user found.");
          router.push(ROUTES.SIGN_IN);
          return;
        }

        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const { location } = userDoc.data();
          await setUsers();
          setUserLocation(location);
        } else {
          console.warn("User document does not exist.");
          Toast.show({
            type: "error",
            text1: "User Not Found",
            text2: "Please log in again.",
          });
          router.push(ROUTES.SIGN_IN);
        }
      } catch (error: Error | any) {
        console.error("Error fetching user location:", error);
        Toast.show({
          type: "error",
          text1: error.message,
          text2: "Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserLocation();
  }, [auth, db]);

  // Render Map
  const renderMap = () => null;
  <MapView
    style={styles.map}
    region={{
      latitude: userLocation?.latitude || 37.78825,
      longitude: userLocation?.longitude || -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }}
  >
    {users.map((user: DocumentData, index: number) => (
      <Marker
        key={index}
        coordinate={{ latitude: user.latitude, longitude: user.longitude }}
        title={user.name}
        onPress={() => setSelectedUser(user)}
      />
    ))}
  </MapView>;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Women Safety App</Text>
      {userLocation && users ? (
        renderMap()
      ) : (
        <Text style={styles.loadingText}>Loading Map...</Text>
      )}
      {selectedUser && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={!!selectedUser}
          onRequestClose={() => setSelectedUser(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedUser.name}</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  sendNotification(db, selectedUser.id, "location", {
                    senderId: auth.currentUser?.uid,
                    location: userLocation,
                  });
                  setSelectedUser(null);
                }}
              >
                <Ionicons name="location-outline" size={24} color="#ffffff" />
                <Text style={styles.buttonText}>Share Location</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  sendNotification(db, selectedUser.id, "chat", {
                    senderId: auth.currentUser?.uid,
                  });
                  setSelectedUser(null);
                }}
              >
                <Ionicons name="chatbubble-outline" size={24} color="#ffffff" />
                <Text style={styles.buttonText}>Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  sendNotification(db, selectedUser.id, "video", {
                    senderId: auth.currentUser?.uid,
                  });
                  setSelectedUser(null);
                  router.push({
                    pathname: ROUTES.VIDEOCHAT,
                    params: { senderId: auth.currentUser?.uid },
                  });
                }}
              >
                <Ionicons name="videocam-outline" size={24} color="#ffffff" />
                <Text style={styles.buttonText}>Video Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.closeButton]}
                onPress={() => setSelectedUser(null)}
              >
                <Ionicons name="close-outline" size={24} color="#ffffff" />
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdf2f8",
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "center",
    marginVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
  map: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 16,
    width: "80%",
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#ec4899",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  closeButton: {
    backgroundColor: "#ef4444",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default HomeScreen;

// import { Image, StyleSheet, Platform } from 'react-native';

// import { HelloWave } from '@/components/HelloWave';
// import ParallaxScrollView from '@/components/ParallaxScrollView';
// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';

// export default function HomeScreen() {
//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
//       headerImage={
//         <Image
//           source={require('@/assets/images/partial-react-logo.png')}
//           style={styles.reactLogo}
//         />
//       }>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//         <HelloWave />
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 1: Try it</ThemedText>
//         <ThemedText>
//           Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
//           Press{' '}
//           <ThemedText type="defaultSemiBold">
//             {Platform.select({
//               ios: 'cmd + d',
//               android: 'cmd + m',
//               web: 'F12'
//             })}
//           </ThemedText>{' '}
//           to open developer tools.
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 2: Explore</ThemedText>
//         <ThemedText>
//           Tap the Explore tab to learn more about what's included in this starter app.
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
//         <ThemedText>
//           When you're ready, run{' '}
//           <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
//           <ThemedText type="defaultSemiBold">app-example</ThemedText>.
//         </ThemedText>
//       </ThemedView>
//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
// });

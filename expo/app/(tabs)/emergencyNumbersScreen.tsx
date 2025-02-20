import React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  Platform,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const EmergencyNumbersScreen = () => {
  const emergencyNumbers = [
    { key: "Police", number: "911", icon: "shield-outline" as const },
    { key: "Firefighters", number: "112", icon: "flame-outline" as const },
    { key: "Ambulance", number: "113", icon: "medical-outline" as const },
  ];

  const callNumber = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Emergency Numbers</Text>
        <FlatList
          data={emergencyNumbers}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => callNumber(item.number)}
            >
              <View style={styles.buttonContent}>
                <Ionicons name={item.icon} size={24} color="#ffffff" />
                <Text style={styles.callButtonText}>Call {item.key}</Text>
              </View>
              <Text style={styles.numberText}>{item.number}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
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
  listContainer: {
    paddingHorizontal: 16,
  },
  callButton: {
    backgroundColor: "#ec4899",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  callButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
  },
  numberText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default EmergencyNumbersScreen;

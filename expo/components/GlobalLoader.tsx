// components/GlobalLoader.js
import React from "react";
import { Modal, View, ActivityIndicator, StyleSheet } from "react-native";
import useLoaderStore from "@/store/storeLoader";

const GlobalLoader = () => {
  const { loading } = useLoaderStore();

  return (
    <Modal transparent visible={loading}>
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
});

export default GlobalLoader;

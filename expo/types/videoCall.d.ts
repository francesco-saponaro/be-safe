export type VideoCallScreenProps = {
  route: {
    params: {
      senderId: string; // Ensure the senderId is always a string
    };
  };
};

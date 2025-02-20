export type Notification = {
  userId: string;
  type: "chat" | "video" | "location"; // Specific types for better safety
  payload: {
    message?: string; // Optional since not all types might have it
    senderId: string;
    location?: string; // Optional for location type
  };
};

import { Timestamp } from "firebase/firestore";

export type Message = {
  text: string;
  senderId: string;
  receiverId: string;
  timestamp: Timestamp;
  isLocation?: boolean;
};

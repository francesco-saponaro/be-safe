declare module "react-native-jitsi-meet" {
  export interface JitsiMeetOptions {
    room: string;
    userInfo?: {
      displayName?: string;
      email?: string;
      avatar?: string; // URL to the avatar image
    };
    audioMuted?: boolean;
    videoMuted?: boolean;
  }

  export function call(url: string, options?: JitsiMeetOptions): void;
  export function audioCall(url: string, options?: JitsiMeetOptions): void;
  export function videoCall(url: string, options?: JitsiMeetOptions): void;
  export function endCall(): void;

  export const JitsiMeetView: React.ComponentType<{
    style?: object;
    onConferenceTerminated?: (event: any) => void;
    onConferenceJoined?: (event: any) => void;
    onConferenceWillJoin?: (event: any) => void;
  }>;
}

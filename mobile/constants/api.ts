import { Platform } from "react-native";

export const API_URL =
  Platform.OS === "ios" ? "http://localhost:3000" : "http://10.0.2.2:3000";

//     import { Platform } from "react-native";

// const LOCAL_IP = "192.168.0.105"; // <-- твій IP з ipconfig / ifconfig

// export const API_URL =
//   Platform.OS === "android"
//     ? `http://${LOCAL_IP}:3000`
//     : `http://${LOCAL_IP}:3000`;

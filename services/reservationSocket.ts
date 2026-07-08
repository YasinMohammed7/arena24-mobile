import { io, Socket } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ServerReservation } from "@/types/serverReservation";

const SOCKET_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "";

let socket: Socket | null = null;

export const connectReservationsSocket = (
  onReservations: (reservations: ServerReservation[]) => void,
  onReservationUpdated: (reservation: ServerReservation) => void
): Socket => {
  if (socket?.connected) {
    socket.emit("getReservationByUser");
    return socket;
  }

  AsyncStorage.getItem("accessToken").then((token) => {
    if (!token) return;

    socket = io(`${SOCKET_URL}/reservations`, {
      auth: { token },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Socket connected to reservations");
      socket?.emit("getReservationByUser");
    });

    socket.on("reservations", (reservations: ServerReservation[]) => {
      onReservations(reservations);
    });

    socket.on("reservationUpdated", (reservation: ServerReservation) => {
      onReservationUpdated(reservation);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected from reservations");
    });
  });

  return socket!;
};

export const disconnectReservationsSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

import { Server, Socket } from "socket.io";
import { registerGameHandlers } from "./gameHandlers";
import { registerLobbyHandlers } from "./lobbyHandlers";

export const setupSockets = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`Connection established: ${socket.id}`);

    // Register the refactored game handlers
    registerGameHandlers(io, socket);
    
    // Register lobby/chat handlers if applicable
    registerLobbyHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
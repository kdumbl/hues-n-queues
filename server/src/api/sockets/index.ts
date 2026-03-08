import { Server, Socket } from "socket.io";
//import { socketAuthMiddleware } from "../middleware/socketAuthMiddleware";
import { registerGameHandlers } from "./gameHandlers";
import { registerLobbyHandlers } from "./lobbyHandlers";
import type {GameState, Player} from "../types"

function initSockets(io: Server) {
  //also will allow us to connect a user to a socket connection
  //io.use(socketAuthMiddleware); Authentication stuff later

  io.on("connection", (socket: Socket) => {
    console.log(`User Connected: ${socket.id}`);

    //send an initial emit to set up the client with current info
    //later this will be connected to the database and pull info from there
    const initialState: GameState = {
      self: {
        name: socket.id,
        score: 0,
        piece: {
          x : null,
          y: null
        }

      },
      //for now we wont be able to pull players who have already connected as that needs db connection
      otherPlayers: null
    };
    io.emit("init", initialState)

    registerGameHandlers(io, socket);
    registerLobbyHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}

export { initSockets };

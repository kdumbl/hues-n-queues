//Things we wanna do everytime a socket is opened
//authenitcate user, store user name into socket
import { Socket, Server } from "socket.io";
import type { ClientGameState } from "../types";
import { gameController } from "../controllers/gameController";

//current game cause we dont have lobby functionality yet.
const GAME_ID = "69addc260263ad653bdd46f7";

//for now lets just assign connections one of the random users we have in db
// will change with login page
export function setupSocket(io: Server, socket: Socket): void {
  //send an initial emit to set up the client with current info
  //later this will be connected to the database and pull info from there

  const initialState: ClientGameState = {
    self: {
      name: "",
      socketId: socket.id,
      score: 0,
      piece: {
        x: null,
        y: null,
      },
    },
    //for now we wont be able to pull players who have already connected as that needs db connection
    otherPlayers: null,
  };
  io.emit("init", initialState);
}

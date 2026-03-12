import { Server, Socket } from "socket.io";
import { gameController } from "../controllers/gameController";

let usersConnected = 0;
let master_images = Array(480).fill(null);

//this is where all the emit and on functionality for the live game will live
export function registerGameHandlers(io: Server, socket: Socket) {

  //piece updater
  socket.on('all_submitted', (images) => {
    console.log(`all piece have been submitted to socket ${socket.id}`);
    io.emit('all_submitted2', images);

  });

  socket.on('player_submitted', (num_submitted) => {
    console.log(`Before, ${num_submitted} had submitted. Now, ${num_submitted + 1} have submitted: ${socket.id}`);
    io.emit('player_submitted2', num_submitted + 1);
  });

  socket.on('player_unsubmitted', (num_submitted) => {
    console.log(`Before, ${num_submitted} had submitted. Now, ${num_submitted - 1} have submitted: ${socket.id}`);
    io.emit('player_unsubmitted2', num_submitted - 1);
  });

  socket.once('board_view_opened', () => {
    console.log(`usersConnected is ${usersConnected}`);
    usersConnected += 1;
    console.log(`After being increased, it is ${usersConnected}`);
    io.emit('piece_color_assigned', usersConnected);
  });

  socket.on('piece_placed', (i, last_placed, piece) => {
    if (last_placed != null){
      master_images[last_placed] = null;
    }
    master_images[i] = piece;
    io.emit('piece_placed2', master_images);
  })

  //receive info from a client
  socket.on("game_update", async (data: any) => {
    //game controller processes move( uses game repository to getgame then save game)
    const payload = await gameController.processMove(data);

    io.to(data.gameId).emit("game_update", payload); //we will use controllers for this?
  });
}

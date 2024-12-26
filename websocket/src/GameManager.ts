import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages";
import { Game } from "./Game";

//BUG: if the pending user again sent the INIT_GAME message, the game will start with the same user

export class GameManager {
  private games: Game[];
  private pendingUser: WebSocket | null;
  private users: WebSocket[];

  constructor() {
    this.games = [];
    this.pendingUser = null;
    this.users = [];
  }
  addUserToGame(socket: WebSocket) {
    this.users.push(socket);
    this.addHandler(socket);
  }

  removeUserFromGame(socket: WebSocket) {
    this.users = this.users.filter((user) => user !== socket);
    //stop the game bcoz user left
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      console.log("message received", message);
      if (message.type === INIT_GAME) {
        if (this.pendingUser) {
          //start game
          const game = new Game(this.pendingUser, socket);
          this.games.push(game);
          this.pendingUser = null;
        } else {
          this.pendingUser = socket;
        }
      }

      if (message.type === MOVE) {
        const game = this.games.find((game) => game.hasPlayer(socket));
        if (game) {
          console.log("makeMove fun called", message.move);
          game.makeMove(socket, message.move);
        }
      }
    });
  }
}

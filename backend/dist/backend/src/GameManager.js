"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const constants_1 = require("../../shared/constants");
const Game_1 = require("./Game");
//BUG: if the pending user again sent the INIT_GAME message, the game will start with the same user
class GameManager {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUserToGame(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUserFromGame(socket) {
        this.users = this.users.filter((user) => user !== socket);
        //stop the game bcoz user left
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            console.log("message received", message);
            if (message.type === constants_1.INIT_GAME) {
                if (this.pendingUser) {
                    //start game
                    const game = new Game_1.Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = socket;
                }
            }
            if (message.type === constants_1.MOVE) {
                const game = this.games.find((game) => game.hasPlayer(socket));
                if (game) {
                    console.log("makeMove fun called", message.move);
                    game.makeMove(socket, message.move);
                }
            }
        });
    }
}
exports.GameManager = GameManager;

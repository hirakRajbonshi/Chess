"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messeges_1 = require("./messeges");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        console.log("game started inside constructor");
        this.player1.send(JSON.stringify({
            type: messeges_1.INIT_GAME,
            playload: {
                color: "white",
            },
        }));
        this.player2.send(JSON.stringify({
            type: messeges_1.INIT_GAME,
            playload: {
                color: "black",
            },
        }));
    }
    hasPlayer(player) {
        return this.player1 === player || this.player2 === player;
    }
    makeMove(player, move) {
        //check if it is player's turn
        if (this.board.turn() === "w" && player === this.player2) {
            return;
        }
        if (this.board.turn() === "b" && player === this.player1) {
            return;
        }
        //check if move is valid
        //update the board and push the move
        try {
            console.log("move made inside makeMove under try", move);
            this.board.move(move);
        }
        catch (error) {
            console.log(error);
            return;
        }
        console.log("move made inside makeMove under try catch");
        //check if game is over
        if (this.board.isGameOver()) {
            // TODO : type of draw
            let result;
            let winner;
            if (this.board.isCheckmate()) {
                result = "checkmate";
                winner = this.board.turn() === "w" ? "black" : "white";
            }
            else {
                result = "draw";
                winner = null;
            }
            this.player1.send(JSON.stringify({
                type: messeges_1.GAME_OVER,
                playload: {
                    result: result,
                    winner: winner,
                },
            }));
            this.player2.send(JSON.stringify({
                type: messeges_1.GAME_OVER,
                playload: {
                    result: result,
                    winner: winner,
                },
            }));
        }
        //send the updated board to both players
        this.player1.send(JSON.stringify({
            type: messeges_1.MOVE,
            playload: {
                board: this.board.board(),
                // chess: this.board,
                turn: this.board.turn() === "w" ? "white" : "black",
            },
        }));
        this.player2.send(JSON.stringify({
            type: messeges_1.MOVE,
            playload: {
                board: this.board.board(),
                // chess: this.board,
                turn: this.board.turn() === "w" ? "white" : "black",
            },
        }));
        console.log("move made inside makeMove at the end");
        // if(this.board.turn() === "w") {
        //     this.player1.send(JSON.stringify({
        //         type: MOVE,
        //         playload: {
        //             board: this.board.fen(),
        //             turn: "white"
        //         }
        //     }));
        // } else {
        //     this.player2.send(JSON.stringify({
        //         type: MOVE,
        //         playload: {
        //             board: this.board.fen(),
        //             turn: "black"
        //         }
        //     }));
        // }
    }
}
exports.Game = Game;

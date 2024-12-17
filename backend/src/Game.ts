import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "../../shared/constants";
export class Game {
  //player 1 is white and player 2 is black
  private player1: WebSocket;
  private player2: WebSocket;
  private board: Chess;
  private startTime: Date;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.startTime = new Date();
    console.log("game started inside constructor");
    this.player1.send(
      JSON.stringify({
        type: INIT_GAME,
        playload: {
          color: "white",
        },
      })
    );
    this.player2.send(
      JSON.stringify({
        type: INIT_GAME,
        playload: {
          color: "black",
        },
      })
    );
  }

  hasPlayer(player: WebSocket) {
    return this.player1 === player || this.player2 === player;
  }

  makeMove(
    player: WebSocket,
    move: {
      from: string;
      to: string;
    }
  ) {
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
    } catch (error) {
      console.log(error);
      return;
    }
    console.log("move made inside makeMove under try catch");
    //check if game is over
    if (this.board.isGameOver()) {
      // TODO : type of draw
      let result: string;
      let winner: string | null;
      if (this.board.isCheckmate()) {
        result = "checkmate";
        winner = this.board.turn() === "w" ? "black" : "white";
      } else {
        result = "draw";
        winner = null;
      }

      this.player1.send(
        JSON.stringify({
          type: GAME_OVER,
          playload: {
            result: result,
            winner: winner,
          },
        })
      );
      this.player2.send(
        JSON.stringify({
          type: GAME_OVER,
          playload: {
            result: result,
            winner: winner,
          },
        })
      );
    }
    //send the updated board to both players
    this.player1.send(
      JSON.stringify({
        type: MOVE,
        playload: {
          board: this.board.board(),
          // chess: this.board,
          turn: this.board.turn() === "w" ? "white" : "black",
        },
      })
    );
    this.player2.send(
      JSON.stringify({
        type: MOVE,
        playload: {
          board: this.board.board(),
          // chess: this.board,
          turn: this.board.turn() === "w" ? "white" : "black",
        },
      })
    );
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

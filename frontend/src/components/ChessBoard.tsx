"use client";
import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { getChessSquare } from "@/lib";
import { ChessPiece } from "./ChessPiece";
import { get } from "http";

const INIT_GAME = "init_game";
const MOVE = "move";
const GAME_OVER = "game_over";

export const ChessBoard = ({
  board,
  socket,
  playerColor,
}: {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
  playerColor: "white" | "black";
}) => {
  const [from, setFrom] = useState<string | null>(null);
  let Board = playerColor === "black" ? [...board].reverse() : board;
  if (playerColor === "black") {
    Board = Board.map((row) => [...row].reverse());
  }
  return (
    <div className="text-white-200">
      {Board.map((row, i) => {
        return (
          <div key={i} className="flex">
            {row.map((square, j) => {
              const squareId = getChessSquare(i, j, playerColor);
              return (
                <div
                  key={j}
                  className={`flex justify-center items-center w-16 h-16 ${
                    (i + j) & 1 ? "bg-slate-600" : "bg-gray-200"
                  }`}
                  onClick={() => {
                    if (!from && square) {
                      setFrom(squareId);
                    } else if (from) {
                      const to = squareId;
                      socket.send(
                        JSON.stringify({
                          type: MOVE,
                          move: { from, to },
                        })
                      );
                      setFrom(null);
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const fromSquare = e.dataTransfer.getData("from");
                    const toSquare = squareId;

                    if (fromSquare && toSquare) {
                      socket.send(
                        JSON.stringify({
                          type: MOVE,
                          move: { from: fromSquare, to: toSquare },
                        })
                      );
                      setFrom(null);
                    }
                  }}
                >
                  {square && (
                    <div
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("from", squareId);
                        setFrom(squareId);
                      }}
                    >
                      <ChessPiece piece={square.type} color={square.color} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

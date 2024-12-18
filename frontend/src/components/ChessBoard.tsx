"use client";
import { BLACK, Chess, Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { getChessSquare } from "@/lib";
import { ChessPiece } from "./ChessPiece";

const INIT_GAME = "init_game";
const MOVE = "move";
const GAME_OVER = "game_over";

export const ChessBoard = ({
  chess,
  board,
  socket,
  playerColor,
  onMove,
}: {
  chess: Chess;
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
  playerColor: Color;
  onMove: (from: string, to: string) => void;
}) => {
  const [from, setFrom] = useState<string>("");
  const [attack, setAttack] = useState<Square[] | null>(null);

  let Board = playerColor === BLACK ? [...board].reverse() : board;
  if (playerColor === BLACK) {
    Board = Board.map((row) => [...row].reverse());
  }
  const handleMove = (fromSquare: string, toSquare: string) => {
    onMove(fromSquare, toSquare);
    setAttack(null);
    setFrom("");
  };

  const getAttackSquares = (from: Square) => {
    const moves = chess.moves({ square: from, verbose: true });
    const squares = moves.map((move) => move.to);
    setAttack(squares);
  };

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
                  className={`flex justify-center items-center w-[4.5rem] h-[4.5rem] ${
                    (i + j) & 1 ? "bg-slate-600" : "bg-gray-200"
                  }`}
                  onClick={() => {
                    if (square && square.color === playerColor) {
                      getAttackSquares(square.square);
                    }
                    if (!from && square) {
                      setFrom(squareId);
                    } else if (from) {
                      const to = squareId;
                      handleMove(from, to);
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const fromSquare = e.dataTransfer.getData("from");
                    const toSquare = squareId;

                    if (fromSquare && toSquare) {
                      handleMove(fromSquare, toSquare);
                    }
                  }}
                >
                  {attack?.includes(squareId) && (
                    <div className="absolute bg-red-500 bg-opacity-50 w-10 h-10 rounded-full"></div>
                  )}
                  {square && (
                    <div
                      draggable
                      onDragStart={(e) => {
                        getAttackSquares(square.square);
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

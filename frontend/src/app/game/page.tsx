"use client";
import { Button } from "@/components/Button";
import { Connecting } from "@/components/Connecting";
import GameAnalytics from "@/components/GameAnalytics";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { ChessBoard } from "@/components/ChessBoard";
import { MOVE, INIT_GAME, GAME_OVER } from "@/constants/messages";

export default function Page() {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [playerColor, setPlayerColor] = useState<"white" | "black">("white");
  const [turn, setTurn] = useState<"white" | "black">("white");
  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case INIT_GAME:
          setPlayerColor(message.playload.color);
          setChess(new Chess());
          setBoard(chess.board());
          break;
        case MOVE:
          setTurn(message.playload.turn);
          setBoard(message.playload.board);
          break;
        case GAME_OVER:
          console.log("game over");
          break;
      }
    };
  }, [socket]);

  if (!socket) return <Connecting />;
  return (
    <main className="h-screen w-screen flex">
      <div className="w-[60%] flex justify-end items-center p-10">
        <div>
          <ChessBoard board={board} socket={socket} playerColor={playerColor} />
        </div>
      </div>
      <div className="w-[40%]">
        <Button
          onClick={() =>
            socket.send(
              JSON.stringify({
                type: INIT_GAME,
              })
            )
          }
        >
          Play
        </Button>
        Turn : {turn}
        <GameAnalytics />
      </div>
    </main>
  );
}

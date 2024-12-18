"use client";
import { Button } from "@/components/Button";
import { Connecting } from "@/components/Connecting";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useState } from "react";
import { Chess, Color, WHITE } from "chess.js";
import { ChessBoard } from "@/components/ChessBoard";
import { MOVE, INIT_GAME, GAME_OVER } from "@/constants/messages";
import { MatchFormat } from "@/components/MatchFormat";
import { MovesList } from "@/components/MovesList";
import { PlayerTime } from "@/components/PlayerTime";

export default function Page() {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [playerColor, setPlayerColor] = useState<Color>(WHITE);
  const [turn, setTurn] = useState<Color>(WHITE);

  //TODO: may be fetch from backend it's hard to get this from chess.js :(
  const [moves, setMoves] = useState<string[]>([]);

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
          let newChess = new Chess(message.playload.fen);
          setChess(newChess);
          setBoard(newChess.board());
          setTurn(newChess.turn() as Color);

          break;
        case GAME_OVER:
          console.log("game over");
          break;
      }
    };
  }, [socket]);

  //TODO: Connecting component
  if (!socket) return <Connecting />;

  const startGame = () => {
    socket.send(
      JSON.stringify({
        type: INIT_GAME,
      })
    );
  };

  const handleMove = (from: string, to: string) => {
    socket.send(
      JSON.stringify({
        type: MOVE,
        move: {
          from,
          to,
        },
      })
    );
  };

  return (
    <main className="h-screen w-screen flex">
      <div className="w-[30%] flex flex-col items-center pt-20 gap-10">
        <MatchFormat />
        <MovesList moves={moves} />
      </div>
      <div className="w-[40%] flex justify-center items-center bg-gray-400">
        <ChessBoard
          chess={chess}
          board={board}
          socket={socket}
          playerColor={playerColor}
          onMove={handleMove}
        />
      </div>
      <div className="w-[30%] flex flex-col justify-center items-center pt-20 gap-10">
        {turn}
        <PlayerTime />
        <Button onClick={startGame}>Play</Button>
        <PlayerTime />
      </div>
    </main>
  );
}

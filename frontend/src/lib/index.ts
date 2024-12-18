import { BLACK, Color, Square, SQUARES } from "chess.js";

export function getChessSquare(
  i: number,
  j: number,
  playerColor: Color
): Square {
  if (playerColor === BLACK) {
    i = 7 - i;
    j = 7 - j;
  }
  return SQUARES[i * 8 + j];
}

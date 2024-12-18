export function getChessSquare(
  i: number,
  j: number,
  playerColor: string
): string {
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];
  if (playerColor === "black") {
    i = 7 - i;
    j = 7 - j;
  }
  if (i < 0 || i > 7 || j < 0 || j > 7) {
    return "";
  }

  return files[j] + ranks[i];
}

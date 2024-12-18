import { Color, PieceSymbol } from "chess.js";
import Image from "next/image";

interface ChessPieceProps {
  piece: PieceSymbol;
  color: Color;
}

export const ChessPiece: React.FC<ChessPieceProps> = ({ piece, color }) => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <Image
        src={`assets/pieces/${color}${piece}.svg`}
        width={50}
        height={50}
        alt={piece + color}
      />
    </div>
  );
};

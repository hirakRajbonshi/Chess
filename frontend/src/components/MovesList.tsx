// const moves = [
//   "e4",
//   "e5",
//   "Nf3",
//   "Nc6",
//   "Bb5",
//   "a6",
//   "Ba4",
//   "Nf6",
//   "O-O",
//   "Be7",
//   "Re1",
//   "b5",
//   "Bb3",
//   "d6",
//   "c3",
//   "O-O",
//   "d4",
//   "Bg4",
//   "h3",
//   "Bh5",
//   "c3",
//   "dxc3",
//   "Nxc3",
//   "Na5",
//   "d5",
//   "Bc2",
//   "Bxf3",
//   "Qxf3",
//   "c5",
//   "dxc5",
//   "Bxc5",
//   "Bd2",
//   "Nc4",
//   "Bb4",
//   "Nxd2",
//   "Qd3",
//   "Nxb1",
//   "Qxh7#",
// ];

interface MovesListProps {
  moves: string[];
}

export const MovesList = ({ moves }: MovesListProps) => {
  const groupedMoves = [];
  for (let i = 0; i < moves.length; i += 2) {
    groupedMoves.push({
      whiteMove: moves[i],
      blackMove: moves[i + 1] || "",
    });
  }

  return (
    <div className="flex w-[80%] h-[25rem] bg-slate-200">
      <div className="w-full h-full overflow-y-scroll">
        {groupedMoves.map((move, index) => (
          <div key={index} className="flex gap-2 px-2">
            <span className="mr-2">{index + 1}.</span>
            <span className="flex w-full gap-2">
              <span className="w-[50%]">{move.whiteMove}</span>
              <span className="w-[50%]">{move.blackMove}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

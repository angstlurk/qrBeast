import treasereMap from "@/assets/treasureMap.jpeg";
import cross from "@/assets/cross.png";
import doneImg from "@/assets/done.png";
import { useState } from "react";

type FragmentQuest = {
  position: string;
  done: boolean;
};

const fragmentQuest = [
  { position: "top-1/2 left-1/2" },
  { position: "top-1/4 left-1/4" },
  { position: "top-3/4 left-3/4" },
  { position: "top-3/4 left-1/4" },
  { position: "top-1/4 left-3/4" },
].map((x) => ({ ...x, done: false }));

export const ThirdTreasure = () => {
  const [fragmentsState, setFragmentState] =
    useState<FragmentQuest[]>(fragmentQuest);

  return (
    <div className="w-full, h-full flex items-center justify-center relative">
      <img src={treasereMap} alt="treasure map" />
      {fragmentsState.map(({ position, done }) => (
        <img
          key={position}
          className={`w-6 h-6 absolute ${position}`}
          onClick={() => {
            setFragmentState((state) =>
              state.map((x) =>
                x.position === position ? { ...x, done: true } : x,
              ),
            );
          }}
          src={done ? doneImg : cross}
          alt="choose this message"
        />
      ))}
    </div>
  );
};

export default ThirdTreasure;

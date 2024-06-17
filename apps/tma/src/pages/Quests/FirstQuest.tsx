import { useQRBeastState } from "@/store/store";
import React, { useState } from "react";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";
import leaf from "@/assets/leaf.png";

interface Debris {
  id: number;
  left: number;
  top: number;
  rotate: number;
  removed: boolean;
}

const generateDebris = (count: number): Debris[] => {
  const debrisArray: Debris[] = [];
  for (let i = 0; i < count; i++) {
    debrisArray.push({
      id: i,
      left: Math.random() * 120 - 20,
      top: Math.random() * 120 - 20,
      rotate: Math.random() * 180,
      removed: false,
    });
  }
  return debrisArray;
};

const markFirstRemoved = (debris: Debris[]) => {
  for (let i = 0; i < debris.length; i++) {
    if (!debris[i].removed) {
      return [
        ...debris.slice(0, i),
        { ...debris[i], removed: true },
        ...debris.slice(i + 1),
      ];
    }
  }
  return debris;
};
let treasureLink =
  "https://t.me/qrBeastBot/start?startapp=treasure-05VNWk2psfdEjKRzagv6";

const ImageWithDebris: React.FC = () => {
  const [treasureOpened, setTreasureOpened] = useState(false);

  const [debris, setDebris] = useState<Debris[]>(generateDebris(20));
  const changeLink = useQRBeastState((state) => state.changeLink);
  const navigate = useNavigate();

  const handleImageClick = () => {
    if (debris.every(({ removed }) => removed)) {
      setTreasureOpened(true);
      changeLink(treasureLink);

      navigate("/");
    }

    setDebris((debris) => markFirstRemoved(debris));
  };

  return !treasureOpened ? (
    <div
      className="w-full h-full flex flex-col justify-center items-center"
      onClick={handleImageClick}
    >
      <div className="relative">
        <QRCode
          fgColor="#3EB489"
          bgColor="#000000"
          value={treasureLink}
        ></QRCode>
        {debris.map((item) => (
          <img
            src={leaf}
            key={item.id}
            className={`absolute w-24 h-24 transition-opacity duration-500 ${
              item.removed ? "opacity-0" : ""
            } `}
            style={{
              left: `${item.left}%`,
              top: `${item.top}%`,
              rotate: `${item.rotate}deg`,
            }}
          />
        ))}
      </div>

      <div
        className={`${
          debris.every(({ removed }) => removed) ? "" : "opacity-0"
        }`}
      >
        Click or scan
      </div>
    </div>
  ) : (
    <div>cheest is opened</div>
  );
};

export const TreasureQuest = () => {
  return <ImageWithDebris />;
};

export default TreasureQuest;

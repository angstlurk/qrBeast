import { useInitData, useUtils } from "@tma.js/sdk-react";
import QRCode from "react-qr-code";

const Squads = () => {
  const data = useInitData();
  const utils = useUtils();

  if (data === undefined || data.user === undefined) {
    return <div>Please use in telegram</div>;
  }

  const referalUrl = `https://t.me/qrBeastBot/start?startapp=kentId${data.user.id}`;

  return (
    <div className="w-full h-full flex flex-col align-center justify-center items-center gap-4">
      <span className="font-semibold">
        Click on the qr code to share the game with friends and get a reward
      </span>
      <QRCode
        bgColor="#374151"
        onClick={() => {
          utils.shareURL(referalUrl, "Go to the app to get your reward.");
        }}
        value={referalUrl}
      />
      <span className="font-semibold">
        Share this link to invite your friends and earn rewards together!
      </span>
      <span>{referalUrl}</span>
    </div>
  );
};

export default Squads;

import { useInitData } from "@tma.js/sdk-react";
import { Button } from "konsta/react";
import QRCode from "react-qr-code";

const Squads = () => {
  const data = useInitData();

  if (data === undefined || data.user === undefined) {
    return <div>Please use in telegram</div>;
  }

  const referalUrl = `https://t.me/qrBeastBot/start?startapp=kentId${data.user.id}`;

  return (
    <div className="w-full h-full flex flex-col align-center justify-center items-center gap-4 p-10">
      <span className="text-white text-lg text-center">
        Invite your friends with this this qr link or share app by button
      </span>
      <a>
        <QRCode bgColor="#4b5563" value={referalUrl} />
      </a>

      <a
        href={`https://t.me/share/url?url=${referalUrl}&text=Play with me and get jettons`}
      >
        <Button className="px-18">Invite friends</Button>
      </a>
    </div>
  );
};

export default Squads;

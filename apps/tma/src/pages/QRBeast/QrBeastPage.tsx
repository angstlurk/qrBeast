import { initQRScanner } from "@tma.js/sdk";
// import monster from "./monster.png";
import logo from "@/assets/logo.png";
import { useInitData } from "@tma.js/sdk-react";
import { Button } from "konsta/react";
import { CoinStatus } from "./CoinStatus";
import { useQRBeastState } from "@/store/store";

const QRBeastPage = () => {
  const qrScanner = initQRScanner();
  const data = useInitData();
  const setLink = useQRBeastState((state) => state.changeLink);
  const executing = useQRBeastState((state) => state.executing);

  if (data === undefined || data.user === undefined) {
    return <div>Please use in telegram</div>;
  }
  const userId = data.user.id.toString();

  const onClick = async () => {
    qrScanner
      .open()
      .then(async (content) => {
        setLink(content);
      })
      .catch(() => {});
  };

  return (
    <div className="h-full flex flex-col items-center">
      <CoinStatus userId={userId} />

      <div
        className={`flex-auto flex items-center justify-items-center ${
          executing ? "animate-shake" : "animate-fly"
        }`}
      >
        <img className="h-64" src={logo} />
      </div>

      <div className="p-3 w-full">
        <Button large onClick={onClick}>
          Scan QR data
        </Button>
      </div>
    </div>
  );
};

export default QRBeastPage;

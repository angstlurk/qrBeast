import { useMiniApp, useUtils } from "@tma.js/sdk-react";
import { Button } from "konsta/react";

export const SecondQuest = () => {
  const utils = useUtils();
  const miniApp = useMiniApp();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
      <span className="text-white w-1/2 text-center">
        Go to another telegram mini application to get a reward
      </span>

      <div>
        <Button
          onClick={() => {
            utils.openTelegramLink("https://t.me/qrMonster_bot/start");

            setTimeout(() => {
              miniApp.close();
            }, 1000);
          }}
          className="px-20"
        >
          Let's go
        </Button>
      </div>
    </div>
  );
};

export default SecondQuest;

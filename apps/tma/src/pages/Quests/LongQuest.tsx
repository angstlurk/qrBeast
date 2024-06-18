import { useMiniApp } from "@tma.js/sdk-react";

export const SecondQuest = () => {
  const miniApp = useMiniApp();

  return (
    <div className="w-full h-full flex items-center justify-center">
      <a
        className="text-white w-1/2 text-center"
        onClick={() => {
          setTimeout(() => {
            miniApp.close();
          }, 1000);
        }}
        href="https://t.me/qrMonster_bot/start"
      >
        Go to another telegram mini application to get a reward
      </a>
    </div>
  );
};

export default SecondQuest;

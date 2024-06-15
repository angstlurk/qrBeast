import { useMiniApp } from "@tma.js/sdk-react";

export const SecondQuest = () => {
  const miniApp = useMiniApp();

  return (
    <div>
      <a
        onClick={() => {
          setTimeout(() => {
            miniApp.close();
          }, 1000);
        }}
        href="https://t.me/qrMonster_bot/start"
      >
        Redirect to other App
      </a>
    </div>
  );
};

export default SecondQuest;

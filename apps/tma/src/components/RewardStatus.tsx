import { useQRBeastState } from "@/store/store";
import { Sheet, Toolbar, Block, Link, Button } from "konsta/react";

export const RewardStatus = () => {
  const reward = useQRBeastState((state) => state.reward);
  const setReward = useQRBeastState((state) => state.setReward);

  const closeSheet = () => {
    setReward({ showReward: false, reward: null });
  };

  return (
    <Sheet
      className="pb-safe"
      opened={reward.showReward}
      onBackdropClick={closeSheet}
    >
      <Toolbar top>
        <div className="left" />
        <div className="right">
          <Link toolbar onClick={closeSheet}>
            Close
          </Link>
        </div>
      </Toolbar>
      <Block>
        <p>
          {reward.showReward &&
            reward.reward.success === true &&
            reward.reward.status === "reward" && (
              <span>You have reward {reward.reward.dailyReward} coins</span>
            )}
          {reward.showReward &&
            reward.reward.success === true &&
            reward.reward.status === "reset" && (
              <span>
                You reset your log row you reward is {reward.reward.dailyReward}
                coins
              </span>
            )}
          {reward.showReward &&
            reward.reward.success === true &&
            reward.reward.status === "created" &&
            reward.reward.dailyReward > 0 && (
              <span>
                You have created a new account with refferal link and received
                {reward.reward.dailyReward} coins
              </span>
            )}
        </p>
        <div className="mt-4">
          <Button onClick={closeSheet}>Good</Button>
        </div>
      </Block>
    </Sheet>
  );
};

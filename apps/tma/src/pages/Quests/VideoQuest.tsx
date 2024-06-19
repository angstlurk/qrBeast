import { useUtils } from "@tma.js/sdk-react";
import { Button } from "konsta/react";

const youtubeUrl = "https://www.youtube.com/watch?v=K_xdHM_SvJs";

export const VideoQuest = () => {
  const utils = useUtils();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
      <span className="text-lg">
        Open and scan all QRs from the video and get the reward
      </span>
      <span className="text text-white">{youtubeUrl}</span>
      <Button
        className="w-auto px-4 "
        onClick={() => {
          utils.openLink("https://www.youtube.com/watch?v=K_xdHM_SvJs");
        }}
      >
        Open youtube video
      </Button>
      <a
        className="mt-12"
        href={`https://t.me/share/url?url=${youtubeUrl}&text=Scan all QRs from the youtbe video`}
      >
        <Button className="">Share the link yotube video</Button>
      </a>
    </div>
  );
};

export default VideoQuest;

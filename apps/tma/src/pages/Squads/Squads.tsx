import { useInitData } from "@tma.js/sdk-react";

const Squads = () => {
  const data = useInitData();

  if (data === undefined || data.user === undefined) {
    return <div>Please use in telegram</div>;
  }

  return (
    <div className="w-full h-full flex align-center justify-center items-center">
      <h1>Coming soon...</h1>
    </div>
  );
};

export default Squads;

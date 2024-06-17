import loadIndicator from "@/assets/loadIndicator.svg";

export const LoadIndicator = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
    <img className="animate-spin " src={loadIndicator} />
  </div>
);

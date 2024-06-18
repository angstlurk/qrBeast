import loadIndicator from "@/assets/logo.svg";

export const LoadIndicator = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
    <img className="animate-fly" src={loadIndicator} />
  </div>
);

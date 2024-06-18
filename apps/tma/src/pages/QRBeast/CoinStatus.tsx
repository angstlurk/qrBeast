import { db } from "@/store/firebase";
import { doc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";

export const CoinStatus = ({ userId }: { userId: string }) => {
  const [value, loading, error] = useDocument(doc(db, "users", userId), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  if (error) {
    return <div>Error: {JSON.stringify(error)}</div>;
  }

  if (loading || !value) {
    return (
      <div className="bg-gray-300 animate-pulse rounded">
        <span className="text-transparent">100000 coins</span>
      </div>
    );
  }

  return (
    <span className="text-white">
      {JSON.stringify(value.data()?.coins)} coins
    </span>
  );
};

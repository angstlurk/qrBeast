import { app } from "@/store/firebase.ts";
import { useHttpsCallable } from "react-firebase-hooks/functions";
import { getFunctions } from "firebase/functions";
import { useEffect, useState } from "react";
import { useInitData } from "@tma.js/sdk-react";
import { Toast } from "konsta/react";
import { parseQr } from "@/components/utils";
import { useQRBeastState } from "@/store/store";

type Result = {
  status: string;
  message: string;
};

export const LinkProcessor = () => {
  const [toast, setToastState] = useState({ show: false, content: "" });
  const link = useQRBeastState((state) => state.processedLink);
  const setExecuting = useQRBeastState((state) => state.setExecuting);
  const data = useInitData();

  const handleResult = async (result: { data: Result } | undefined) => {
    if (result === undefined) {
      return;
    }
    const message = result.data.message;
    setToastState({ show: true, content: message });

    setTimeout(() => {
      setToastState({ show: false, content: "" });
    }, 5000);
  };

  const [processQr, qrExecuting] = useHttpsCallable<
    {
      qr: string;
      userId: string;
    },
    Result
  >(getFunctions(app), "processQr");
  const [processTreasure, treasureExecuting] = useHttpsCallable<
    {
      treasure: string;
      userId: string;
    },
    Result
  >(getFunctions(app), "processTreasure");
  const [processFragment, fragmentExecuting] = useHttpsCallable<
    {
      fragmentRootId: string;
      fragmentId: string;
      userId: string;
    },
    Result
  >(getFunctions(app), "processFragment");

  const userId = data?.user?.id.toString();

  useEffect(() => {
    async function process() {
      if (link === null) return;

      const parsed = parseQr(link);

      switch (parsed.type) {
        case "treasure": {
          const result = await processTreasure({
            treasure: parsed.id,
            userId: userId ?? "",
          });
          handleResult(result);
          break;
        }
        case "fragment": {
          const result = await processFragment({
            fragmentRootId: parsed.fragmentRootId,
            fragmentId: parsed.fragmentId,
            userId: userId ?? "",
          });
          handleResult(result);
          break;
        }
        default: {
          const result = await processQr({
            qr: link,
            userId: userId ?? "",
          });
          handleResult(result);
        }
      }
    }
    process();
  }, [link, processFragment, processQr, processTreasure, userId]);

  const executing = qrExecuting || treasureExecuting || fragmentExecuting;

  useEffect(() => {
    setExecuting(executing);
  }, [executing, setExecuting]);

  if (data === undefined || data.user === undefined) {
    return <div>Please use in telegram</div>;
  }

  return <Toast opened={toast.show}>{toast.content}</Toast>;
};

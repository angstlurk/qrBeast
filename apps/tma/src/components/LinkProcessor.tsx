import { app } from "@/store/firebase.ts";
import useHttpsCallable from "@/store/useHttpsCallable.ts";
import {
  ProcessQRRequst,
  ProcessTreasureRequst,
  ProcessFragmentRequst,
} from "functions/src/index";
import { getFunctions } from "firebase/functions";
import { useEffect, useState } from "react";
import { useInitData, useHapticFeedback } from "@tma.js/sdk-react";
import { Toast } from "konsta/react";
import { parseQr } from "@/components/utils";
import { useQRBeastState } from "@/store/store";

type Result = {
  status: string;
  message: string;
};

export const LinkProcessor = () => {
  const haptic = useHapticFeedback();
  const [toast, setToastState] = useState({ show: false, content: "" });
  const link = useQRBeastState((state) => state.processedLink);
  const changeLink = useQRBeastState((state) => state.changeLink);
  const setExecuting = useQRBeastState((state) => state.setExecuting);
  const data = useInitData();

  const handleResult = async (result: { data: Result } | undefined) => {
    if (result === undefined) {
      return;
    }
    const message = result.data.message;
    setToastState({ show: true, content: message });
    haptic.notificationOccurred("success");

    setTimeout(() => {
      changeLink(null);
      setToastState({ show: false, content: "" });
    }, 5000);
  };

  const [processQr, qrExecuting] = useHttpsCallable<ProcessQRRequst, Result>(
    getFunctions(app),
    "processQR"
  );
  const [processTreasure, treasureExecuting] = useHttpsCallable<
    ProcessTreasureRequst,
    Result
  >(getFunctions(app), "processTreasure");
  const [processFragment, fragmentExecuting] = useHttpsCallable<
    ProcessFragmentRequst,
    Result
  >(getFunctions(app), "processFragment");

  useEffect(() => {
    async function process() {
      if (link === null) return;

      const parsed = parseQr(link);

      switch (parsed.type) {
        case "treasure": {
          const result = await processTreasure({
            treasure: parsed.id,
          });
          handleResult(result);
          break;
        }
        case "fragment": {
          const result = await processFragment({
            fragmentRootId: parsed.fragmentRootId,
            fragmentId: parsed.fragmentId,
          });
          handleResult(result);
          break;
        }
        default: {
          const result = await processQr({
            qr: parsed.text,
          });
          handleResult(result);
        }
      }
    }
    process();
  }, [link, processFragment, processQr, processTreasure]);

  const executing = qrExecuting || treasureExecuting || fragmentExecuting;

  useEffect(() => {
    setExecuting(executing);
  }, [executing, setExecuting]);

  if (data === undefined || data.user === undefined) {
    return <div>Please use in telegram</div>;
  }

  return <Toast opened={toast.show}>{toast.content}</Toast>;
};

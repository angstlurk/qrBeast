import { app } from "@/store/firebase";
import { useInitData } from "@tma.js/sdk-react";
import { getFunctions } from "firebase/functions";
import { PropsWithChildren, useEffect } from "react";
import { useHttpsCallable } from "react-firebase-hooks/functions";
import { extractKentIdNumber } from "./utils";
import { useQRBeastState } from "@/store/store";

export const InitUser = ({ children }: PropsWithChildren) => {
  const initData = useInitData();
  const setLink = useQRBeastState((state) => state.changeLink);

  const [executeCallable, executing] = useHttpsCallable<
    {
      inviterId: string;
      userId: string;
    },
    { points: number }
  >(getFunctions(app), "initUser");

  useEffect(() => {
    if (initData === undefined) {
      return;
    }
    const userId = initData.user?.id;
    const kentId = extractKentIdNumber(initData.startParam);

    if (!userId) {
      return;
    }

    executeCallable({
      userId: userId.toString(),
      inviterId: kentId ? kentId.toString() : "",
    });
  }, [initData, executeCallable]);

  useEffect(() => {
    if (!initData || !initData.startParam) return;

    setLink(initData.startParam);
  }, [initData, setLink]);

  if (executing) {
    return null;
  }

  return children;
};

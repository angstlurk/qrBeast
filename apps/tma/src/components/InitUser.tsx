import { app } from "@/store/firebase";
import { useInitData, useViewport } from "@tma.js/sdk-react";
import { getFunctions } from "firebase/functions";
import { InitUserRequest } from "functions/src/index";
import { PropsWithChildren, useEffect } from "react";
import useHttpsCallable from "@/store/useHttpsCallable";
import { extractKentIdNumber } from "./utils";
import { useQRBeastState } from "@/store/store";

export const InitUser = ({ children }: PropsWithChildren) => {
  const initData = useInitData();
  const viewport = useViewport();
  const setLink = useQRBeastState((state) => state.changeLink);

  const [executeCallable, executing] = useHttpsCallable<
    InitUserRequest,
    { points: number }
  >(getFunctions(app), "initUser");

  useEffect(() => {
    if (viewport) {
      !viewport.isExpanded && viewport.expand();
    }
    if (initData === undefined) {
      return;
    }
    const kentId = extractKentIdNumber(initData.startParam);

    executeCallable({
      inviterId: kentId ? kentId.toString() : "",
    });
  }, [initData, executeCallable, viewport]);

  useEffect(() => {
    if (!initData || !initData.startParam) return;

    setLink(initData.startParam);
  }, [initData, setLink]);

  if (executing) {
    return null;
  }

  return children;
};

import { app } from "@/store/firebase";
import { useInitData, useViewport } from "@tma.js/sdk-react";
import { getFunctions } from "firebase/functions";
import {
  type InitUserRequest,
  type InitUserResponse,
} from "functions/src/index";
import { PropsWithChildren, useEffect } from "react";
import useHttpsCallable from "@/store/useHttpsCallable";
import { extractKentIdNumber } from "./utils";
import { useQRBeastState } from "@/store/store";

export const InitUser = ({ children }: PropsWithChildren) => {
  const initData = useInitData();
  const viewport = useViewport();
  const setLink = useQRBeastState((state) => state.changeLink);
  const setReward = useQRBeastState((state) => state.setReward);

  const [executeCallable, executing] = useHttpsCallable<
    InitUserRequest,
    InitUserResponse
  >(getFunctions(app), "initUser");

  useEffect(() => {
    if (viewport) {
      !viewport.isExpanded && viewport.expand();
    }
    if (initData === undefined) {
      return;
    }
    const kentId = extractKentIdNumber(initData.startParam);

    if (!kentId && initData.startParam) {
      setLink(initData.startParam);
    }

    async function execute() {
      const result = await executeCallable({
        inviterId: kentId ? kentId.toString() : "",
      });
      if (!result) {
        return;
      }
      if (result.data.success) {
        if (result.data.status === "reward" || result.data.status === "reset") {
          setReward({ showReward: true, reward: result.data });
        }
      } else {
      }
    }
    execute();
  }, [initData, executeCallable, viewport]);

  if (executing) {
    return null;
  }

  return children;
};

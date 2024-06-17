import { lazy, FC, Suspense } from "react";
import { InitUser } from "./InitUser";
import { LoadIndicator } from "./LoadIndicator";

const Inner = lazy(() => import("./Inner"));

export const App: FC = () => {
  return (
    <InitUser>
      <Suspense fallback={<LoadIndicator />}>
        <Inner />
      </Suspense>
    </InitUser>
  );
};

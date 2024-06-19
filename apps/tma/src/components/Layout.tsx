import { Toolbar, Link as UILink } from "konsta/react";
import { Suspense } from "react";
import {
  Link,
  Outlet,
  // useLocation,
} from "react-router-dom";
import { routes } from "@/navigation/routes.tsx";
import { useMiniApp } from "@tma.js/sdk-react";
import { LinkProcessor } from "./LinkProcessor";
import { LoadIndicator } from "./LoadIndicator";
import { RewardStatus } from "./RewardStatus";

export const Layout = () => {
  // const location = useLocation();
  const miniApp = useMiniApp();
  miniApp.setHeaderColor("#0f172a");

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-600">
      <div className="flex-grow overflow-y-auto">
        <Suspense fallback={<LoadIndicator />}>
          <Outlet />
        </Suspense>

        <LinkProcessor />
        <RewardStatus />
      </div>
      <Toolbar
        className="w-full bottom-0 px-4 py-2 bg-gray-900"
        bgClassName="bg-gray-900"
        colors={{ bgIos: "", bgMaterial: "" }}
      >
        {routes
          .filter(({ nav }) => nav)
          .map((route) =>
            route.icon ? (
              <UILink navbar iconOnly className="text-white mb-2">
                <Link key={route.path} to={route.path}>
                  <img className="w-10 h-16" src={route.icon} />
                </Link>
              </UILink>
            ) : (
              <UILink
                key={route.path}
                toolbar
                // tabbarActive={route.path === location.pathname}
              >
                <Link key={route.path} to={route.path}>
                  {route.title}
                </Link>
              </UILink>
            )
          )}
      </Toolbar>
    </div>
  );
};

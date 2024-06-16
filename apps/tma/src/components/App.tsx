import { useIntegration } from "@tma.js/react-router-integration";
import {
  bindMiniAppCSSVars,
  bindThemeParamsCSSVars,
  bindViewportCSSVars,
  initNavigator,
  useMiniApp,
  useThemeParams,
  useViewport,
} from "@tma.js/sdk-react";
import { App as KonstaApp, Toolbar, Link as UILink } from "konsta/react";
import { type FC, useEffect, useMemo, Suspense } from "react";
import { isAndroid } from "react-device-detect";
import {
  Link,
  Navigate,
  Outlet,
  Route,
  Router,
  Routes,
  // useLocation,
} from "react-router-dom";
import loadIndicator from "@/assets/loadIndicator.svg";

import { routes } from "@/navigation/routes.tsx";
import { InitUser } from "./InitUser";
import { LinkProcessor } from "./LinkProcessor";

const Layout = () => {
  // const location = useLocation();
  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="flex-1">
        <Suspense
          fallback={
            <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
              <img className="animate-spin " src={loadIndicator} />
            </div>
          }
        >
          <Outlet />
        </Suspense>

        <LinkProcessor />
      </div>
      <Toolbar className="w-full bottom-0 px-4">
        {routes
          .filter(({ nav }) => nav)
          .map((route) => (
            <UILink
              key={route.path}
              toolbar
              // tabbarActive={route.path === location.pathname}
            >
              <Link key={route.path} to={route.path}>
                {route.title}
              </Link>
            </UILink>
          ))}
      </Toolbar>
    </div>
  );
};

export const App: FC = () => {
  const miniApp = useMiniApp();
  const themeParams = useThemeParams();
  const viewport = useViewport();

  useEffect(() => {
    return bindMiniAppCSSVars(miniApp, themeParams);
  }, [miniApp, themeParams]);

  useEffect(() => {
    return bindThemeParamsCSSVars(themeParams);
  }, [themeParams]);

  useEffect(() => {
    return viewport && bindViewportCSSVars(viewport);
  }, [viewport]);

  // Create new application navigator and attach it to the browser history, so it could modify
  // it and listen to its changes.
  const navigator = useMemo(() => initNavigator("app-navigation-state"), []);
  const [location, reactNavigator] = useIntegration(navigator);

  // Don't forget to attach the navigator to allow it to control the BackButton state as well
  // as browser history.
  useEffect(() => {
    navigator.attach();
    return () => navigator.detach();
  }, [navigator]);

  const theme = isAndroid ? "material" : "ios";

  return (
    <InitUser>
      <KonstaApp theme={theme} safeAreas={false}>
        <Router location={location} navigator={reactNavigator}>
          <Routes>
            <Route path="/" element={<Layout />}>
              {routes.map((route) => (
                <Route key={route.path} {...route} />
              ))}
              <Route path="*" element={<Navigate to="/main" />} />
            </Route>
          </Routes>
        </Router>
      </KonstaApp>
    </InitUser>
  );
};
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
import { App as KonstaApp } from "konsta/react";
import { useEffect, useMemo } from "react";
import { isAndroid } from "react-device-detect";
import { Navigate, Route, Router, Routes } from "react-router-dom";
import { routes } from "@/navigation/routes.tsx";
import { Layout } from "./Layout";

const Inner = () => {
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
  );
};

export default Inner;

import React from "react";
import ReactDOM from "react-dom/client";
import "./mockEnv.ts";
import "./index.css";
import { Root } from "./components/Root.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);

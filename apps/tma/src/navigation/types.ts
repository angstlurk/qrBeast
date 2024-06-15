import { type ComponentType, type JSX } from "react";

export interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
  nav?: boolean;
}

import { type ComponentType } from "react";

export interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: string;
  nav?: boolean;
}

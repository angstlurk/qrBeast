import { questList } from "@/pages/Quests/questList";
import { Route } from "./types";
import { QrBeastPage, QuestsPage, SquadsPage } from "./LazyComponents";

export const routes: Route[] = [
  { path: "/", Component: QrBeastPage, title: "QR Beast", nav: true },
  { path: "/quests", Component: QuestsPage, title: "Quests", nav: true },
  ...questList.map(({ to, component }) => ({
    path: to,
    Component: component,
    nav: false,
  })),
  { path: "/squads", Component: SquadsPage, title: "Squads", nav: true },
];

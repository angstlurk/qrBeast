import { questList } from "@/pages/Quests/questList";
import { Route } from "./types";
import { QrBeastPage, QuestsPage, SquadsPage } from "./LazyComponents";
import squads from "@/assets/squads.svg";
import logo from "@/assets/logo.svg";
import map from "@/assets/map.svg";

export const routes: Route[] = [
  {
    path: "/",
    Component: QrBeastPage,
    title: "QR Beast",
    nav: true,
    icon: logo,
  },
  {
    path: "/quests",
    Component: QuestsPage,
    title: "Quests",
    nav: true,
    icon: map,
  },
  ...questList.map(({ to, component }) => ({
    path: to,
    Component: component,
    nav: false,
  })),
  {
    path: "/squads",
    Component: SquadsPage,
    title: "Squads",
    icon: squads,
    nav: true,
  },
];

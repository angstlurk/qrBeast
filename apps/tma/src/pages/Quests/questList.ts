import treasure from "@/assets/treasure.png";
import { lazy } from "react";

const TreasureQuest = lazy(() => import("@/pages/Quests/FirstQuest"));
const AppQuest = lazy(() => import("@/pages/Quests/LongQuest"));
const LongQuest = lazy(() => import("@/pages/Quests/AppQuest"));
const VideoQuest = lazy(() => import("@/pages/Quests/VideoQuest"));
const SurveyQuest = lazy(() => import("@/pages/Quests/SurveyQuest"));

export const questList = [
  {
    to: "/quests/first",
    title: "Get first treasure",
    text: "Simple quest to get first treasure",
    media: treasure,
    component: TreasureQuest,
  },
  {
    to: "/quests/treasureMap",
    title: "Complete all tasks for grab treasure",
    text: "Long quest",
    media: treasure,
    component: LongQuest,
  },
  {
    to: "/quests/survey",
    title: "Complete survey for treasure",
    text: "Survey quest",
    media: treasure,
    component: SurveyQuest,
  },
  {
    to: "/quests/otherApp",
    title: "Get treasure from other app",
    text: "Grab treasure from other app",
    media: treasure,
    component: AppQuest,
  },
  {
    to: "/quests/youtube",
    title: "Find all fragments from video",
    text: "Video quest",
    media: treasure,
    component: VideoQuest,
  },
];

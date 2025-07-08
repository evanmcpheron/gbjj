/*imports*/
import { Routes } from "@/services/routes/routes.types";
import { lazy } from "react";

const Members = lazy(() => import("./members.view"));

export const membersRoutes: Routes[] = [
  {
    path: "/members",
    title: "Members",
    element: <Members />,
    navigationId: "accounts",
  },
];

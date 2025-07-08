/*imports*/
import { Routes } from "@/services/routes/routes.types";
import { lazy } from "react";

const NewMember = lazy(() => import("./new.members.view"));

export const newMemberRoutes: Routes[] = [
  {
    path: "/new-member",
    title: "NewMember",
    element: <NewMember />,
    navigationId: "accounts",
  },
];

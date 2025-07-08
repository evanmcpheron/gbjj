/*imports*/
import { Routes } from "@/services/routes/routes.types";
import { lazy } from "react";

const CheckIn = lazy(() => import("./checkin.view"));

export const checkInRoutes: Routes[] = [
  {
    path: "/check-in",
    title: "CheckIn",
    element: <CheckIn />,
    navigationId: "accounts",
  },
];

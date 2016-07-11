import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./components/app";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Chat } from "./components/chat";
import { Root } from "./components/root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/app",
    element: <App />,
    children: [
      {
        path: "/app/",
        element: <Navigate to="/app/chat" replace={true} />,
      },
      {
        path: "/app/forum",
        element: "",
      },
      {
        path: "/app/chat",
        element: <Chat />,
      },
      {
        path: "/app/matches",
        element: "",
      },
      {
        path: "/app/members",
        element: "",
      },
      {
        path: "/app/contributors",
        element: "",
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

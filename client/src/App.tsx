import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Login from "./auth/login";
import RootLayout from "./RootLayout";
import PostsN from "./PostsN";
import Register from "./auth/register";
import AuthLayout from "./auth/AuthLayout";
import ErrorPage from "./ErrorPage";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./query/client";
import User from "./components/User";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        Component: PostsN,
      },
      {
        path: "u/:userId",
        Component: User,
      },

      {
        path: "auth",
        Component: AuthLayout,
        children: [
          {
            path: "login",
            Component: Login,
          },
          {
            path: "register",
            Component: Register,
          },
        ],
      },

      // {
      //   Component: ProtectedRoute,
      //   children: [{ path: "profile", Component: Profile }],
      // },
    ],
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

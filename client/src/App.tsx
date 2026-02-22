import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Index from ".";
import Login from "./components/login";
import RootLayout from "./RootLayout";
import Posts from "./Posts";
import Register from "./components/register";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Posts,
        loader: async () => {
          const response = await fetch("http://localhost:3000/posts");
          const posts = await response.json();
          return { posts };
        },
      },
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
]);

export default function App() {
  return <RouterProvider router={router} />;
}

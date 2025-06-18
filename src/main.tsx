import { createRoot } from "react-dom/client";
import "./index.css";
import  App  from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "./components/custom/layout.tsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <App />,
      },
    ],
  },
]);

const root = document.getElementById("root") as HTMLElement;

createRoot(root).render(
    <RouterProvider router={router} />
);

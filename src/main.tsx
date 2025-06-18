import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "./components/layout/layout.tsx";
import {
  HomePageWrapper,
  ProductsPageWrapper,
  CategoryPageWrapper,
  ProductPageWrapper,
} from "./components/layout/PageWrappers.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePageWrapper />,
      },
      {
        path: "productos",
        element: <ProductsPageWrapper />,
      },
      {
        path: "producto/:id",
        element: <ProductPageWrapper />,
      },
      {
        path: "categoria/:categoria",
        element: <CategoryPageWrapper />,
      },
      // Ruta de fallback para App (compatibilidad)
      {
        path: "app",
        element: <App />,
      },
    ],
  },
]);

const root = document.getElementById("root") as HTMLElement;

createRoot(root).render(<RouterProvider router={router} />);

import "./styles/global.css";
import AddStock from "./pages/AddStock/AddStock.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Sales from "./pages/Sales/Sales.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/home.jsx";
import PageNotFound from "./pages/PageNotFound/PageNotFound.jsx";
import Display from "./components/Display.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      element: <Display />,
      children: [
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/add-stock",
          element: <AddStock />,
        },
        {
          path: "/sales",
          element: <Sales />,
        },
      ],
    },
    {
      path: "*",
      element: <PageNotFound />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;

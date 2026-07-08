import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "./layouts/RootLayout";
import Home from "./routes/Home";
import Contact from "./routes/Contact";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "contact-us", element: <Contact /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

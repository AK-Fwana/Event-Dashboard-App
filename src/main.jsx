// import { ChakraProvider } from "@chakra-ui/react";
// import React from "react";
// import ReactDOM from "react-dom/client";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { EventsPage } from "./pages/EventsPage";
// import { EventPage } from "./pages/EventPage";
// import { Root } from "./components/Root";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Root />,
//     children: [
//       {
//         path: "/",
//         element: <EventsPage />, 
//       },
//       {
//         path: "/event/:eventId",
//         element: <EventPage />,
//       },
//     ],
//   },
// ]);

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <ChakraProvider>
//       <RouterProvider router={router} /> 
//     </ChakraProvider>
//   </React.StrictMode>
// );

import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { EventsPage } from "./pages/EventsPage";
import { EventPage } from "./pages/EventPage";
import { Root } from "./components/Root";

// Define a simple ErrorBoundary component
const ErrorBoundary = ({ error }) => {
  console.error("Error caught by ErrorBoundary:", error); // Log the error for debugging
  return (
    <div>
      <h1>Oops! Something went wrong.</h1>
      <p>An error occurred while loading the page. Please check the console for details.</p>
    </div>
  );
};

// Add basename to your router to handle subdirectory deployment
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        element: <EventsPage />,
      },
      {
        path: "/event/:eventId",
        element: <EventPage />,
      },
    ],
  },
], {
  basename: "/Event-Dashboard-App",  // <-- Add basename here
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);

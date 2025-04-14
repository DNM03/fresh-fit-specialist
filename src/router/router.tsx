import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense } from "react";
import LoginPage from "../pages/login";
import React from "react";
import MainLayout from "@/components/layout/main-layout";

// const withSuspense = (
//   Component: React.LazyExoticComponent<React.ComponentType<any>>
// ) => (
//   <Suspense
//     fallback={
//       <div className="w-full h-full flex justify-center items-center">
//         <OverlayLoading />
//       </div>
//     }
//   >
//     <Component />
//   </Suspense>
// );

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};

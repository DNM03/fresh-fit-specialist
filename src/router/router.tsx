import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "../pages/login";
import MainLayout from "@/components/layout/main-layout";
import Dashboard from "@/pages/dashboard";
import Appointment from "@/pages/appointment";
import Availability from "@/pages/availability";
import RecordsPage from "@/pages/records";
import CommunityPage from "@/pages/community";
import SettingsPage from "@/pages/settings";
import VideoCallPage from "@/pages/appointment/meeting";
import AddAvailabilityPage from "@/pages/availability/add";

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
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/appointments",
        // element: <Appointment />,
        children: [
          {
            index: true,
            element: <Appointment />,
          },
          {
            path: "/appointments/meeting",
            element: <VideoCallPage />,
          },
        ],
      },
      {
        path: "/availability",
        // element: <Availability />,
        children: [
          {
            index: true,
            element: <Availability />,
          },
          {
            path: "/availability/add",
            element: <AddAvailabilityPage />,
          },
        ],
      },
      {
        path: "/records",
        element: <RecordsPage />,
      },
      {
        path: "/community",
        element: <CommunityPage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};

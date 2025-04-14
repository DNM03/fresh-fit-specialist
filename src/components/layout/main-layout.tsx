import LeftSidebar from "@/features/main/left-sidebar";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="flex flex-row">
      <LeftSidebar />
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;

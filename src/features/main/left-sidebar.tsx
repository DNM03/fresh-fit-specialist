import {
  CalendarCheck2,
  FileText,
  Handshake,
  History,
  House,
  Settings,
} from "lucide-react";
import app_logo from "@/assets/images/freshfit_logo.png";

import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function LeftSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarItems = [
    {
      label: "Dashboard",
      icon: <House size={20} />,
      path: "/",
    },
    {
      label: "Appointments",
      icon: <CalendarCheck2 size={20} />,
      path: "/appointments",
    },
    {
      label: "Availability",
      icon: <History size={20} />,
      path: "/availability",
    },
    {
      label: "Records",
      icon: <FileText size={20} />,
      path: "/records",
    },
    {
      label: "Community",
      icon: <Handshake size={20} />,
      path: "/community",
    },
    {
      label: "Settings",
      icon: <Settings size={20} />,
      path: "/settings",
    },
  ];
  return (
    <div className="w-64 min-w-64 border-r h-screen flex flex-col items-center py-4 gap-y-4 sticky top-0">
      <img src={app_logo} alt="App logo" className="w-24" />

      {sidebarItems.map((item, index) => (
        <div key={index} className="w-full flex flex-row items-center gap-x-1">
          <div
            className="w-[6px] h-full rounded-r-sm"
            style={{
              backgroundColor:
                (location.pathname === item.path && item.path === "/") ||
                (location.pathname.includes(item.path) && item.path !== "/")
                  ? "#176219"
                  : "",
            }}
          ></div>
          <div
            className="flex flex-row items-center w-full gap-x-2 hover:bg-green-50 p-2 rounded-lg cursor-default mr-2 px-4"
            style={{
              backgroundColor:
                (location.pathname === item.path && item.path === "/") ||
                (location.pathname.includes(item.path) && item.path !== "/")
                  ? "#dcfce7"
                  : "",
            }}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <p className="font-semibold">{item.label}</p>
          </div>
        </div>
      ))}
      {/* <button
        className="mt-auto mb-4 flex flex-row items-center gap-x-2 bg-red-600 w-48 justify-center mx-4 text-white p-[6px] rounded-md hover:bg-red-500"
        onClick={() => navigate("/login")}
      >
        <LogOut size={18} />
        Log out
      </button> */}
      <div className="mt-auto flex flex-row items-center gap-x-4 w-full px-4 border-t pt-4">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-bold text-sm">Dr. John Doe</p>
          <p className="text-sm">Heart</p>
        </div>
      </div>
    </div>
  );
}

export default LeftSidebar;

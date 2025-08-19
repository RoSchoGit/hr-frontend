import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Outlet, useParams, useLocation } from "react-router-dom";
import { useProcessStore } from "@/process/useProcessStore";

const AppLayout = () => {
  return (
    <div className="flex flex-col h-screen bg-indigo-100">
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default AppLayout;

import BottomNav from "@/components/BottomNav";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="flex flex-col h-screen bg-indigo-100">
      {/* main nicht selber scrollen, child regelt das */}
      <main className="flex-1 min-h-0">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default AppLayout;

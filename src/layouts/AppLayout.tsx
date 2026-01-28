import BottomNav from "@/components/BottomNav";
import { Outlet } from "react-router-dom";
import "./AppLayout.css";

const AppLayout = () => {
  return (
    <div className="app-layout">
      {/* main scrollt nicht selbst, child regelt Scroll */}
      <main className="app-layout__main">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default AppLayout;

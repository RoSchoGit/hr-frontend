import { Home, User, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

const BottomNav = () => {
  return (
    <footer className="h-12 flex items-center justify-around border-t border-yellow-500 bg-white">
      <NavLink to="/dashboard" className="flex flex-col items-center text-sm">
        <Home className="h-6 w-6" />
      </NavLink>
      <NavLink to="/settings" className="flex flex-col items-center text-sm">
        <Settings className="h-6 w-6" />
      </NavLink>
      <NavLink to="/profile" className="flex flex-col items-center text-sm">
        <User className="h-6 w-6" />
      </NavLink>
    </footer>
  );
};


export default BottomNav;

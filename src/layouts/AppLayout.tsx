import type { ReactNode } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

type AppLayoutProps = {
  children: ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header />

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-gray-100 border-2 border-green-500">
        {children}
      </main>

      {/* BottomNav */}
      <BottomNav />
    </div>
  );
};

export default AppLayout;

import type { FC } from "react";

const Header: FC = () => {
  return (
    <header className="h-10 flex-shrink-0 flex items-center justify-center border-2 border-red-500 bg-white shadow-sm">
      <h1 className="text-xl font-semibold font-sans text-gray-800 tracking-wide">
        flow<span className="text-indigo-600">wise</span>
      </h1>
    </header>
  );
};


export default Header;

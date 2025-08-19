import type { FC } from "react";

type HeaderProps = {
  title?: string;
};

const Header: FC<HeaderProps> = ({ title }) => {
  if (!title) return null; // Header nur anzeigen, wenn ein Titel vorhanden ist

  return (
    <header className="h-auto min-h-10 flex-shrink-0 flex items-center justify-center bg-indigo-100">
      <h1
        className="
          font-sans font-semibold text-gray-800 tracking-wide text-center leading-tight
          text-lg md:text-xl
          line-clamp-2 md:line-clamp-1 md:truncate md:max-w-[90%]
        "
        title={title} // Tooltip für Desktop
      >
        {title}
      </h1>
    </header>
  );
};

export default Header;

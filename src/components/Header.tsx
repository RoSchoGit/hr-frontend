import type { FC, ReactNode } from "react";

interface HeaderProps {
  title?: string | ReactNode;
}

const Header: FC<HeaderProps> = ({ title }) => {
  if (!title) return null;

  // Tooltip nur aus String
  const tooltip = typeof title === "string" ? title : undefined;

  return (
    <header className="h-auto min-h-10 flex-shrink-0 flex items-center justify-center bg-indigo-100">
      <h1
        className="
          font-sans font-semibold text-gray-800 tracking-wide text-center leading-tight
          text-lg md:text-xl
          line-clamp-2 md:line-clamp-1 md:truncate md:max-w-[90%]
        "
        title={tooltip} // Tooltip nur, wenn title String ist
      >
        {title}
      </h1>
    </header>
  );
};

export default Header;

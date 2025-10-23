import type { FC, ReactNode } from "react";
import SmartText from "./SmartText";

interface HeaderProps {
  /** Beliebiger Titelwert: string, JSX/ReactNode oder undefined/null */
  title?: string | ReactNode | null;
}

const Header: FC<HeaderProps> = ({ title }) => {
  const hasTitle =
    title !== undefined &&
    title !== null &&
    !(typeof title === "string" && title.trim() === "");

  const tooltip = typeof title === "string" ? title : undefined;

  return (
    <header
      className="
        flex-shrink-0 flex items-center justify-center
        bg-indigo-100
        px-4 py-2        /* ✅ Innenabstand: etwas Luft zu den Rändern */
        min-h-[2.5rem]   /* ✅ kleinere Mindesthöhe (~40px statt ~64px von min-h-10) */
      "
    >
      {hasTitle ? (
        typeof title === "string" ? (
          <div title={tooltip} className="w-full flex justify-center">
            <SmartText
              variant="h2"
              className="
                truncate font-sans font-semibold text-gray-800 tracking-wide text-center leading-tight
                text-lg md:text-xl line-clamp-2 md:line-clamp-1 md:max-w-[90%]
              "
            >
              {title}
            </SmartText>
          </div>
        ) : (
          <div className="w-full flex justify-center">{title}</div>
        )
      ) : (
        <div className="w-full flex justify-center">
          <SmartText
            variant="h2"
            className="font-sans font-semibold text-gray-800 tracking-wide text-center leading-tight text-lg md:text-xl"
          >
            Oh, da ist was mit dem Titel schief gelaufen
          </SmartText>
        </div>
      )}
    </header>
  );
};

export default Header;

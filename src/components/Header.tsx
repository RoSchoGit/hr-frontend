import type { FC, ReactNode } from "react";
import SmartText from "./SmartText";
import "./Header.css";

interface HeaderProps {
  title?: string | ReactNode | null;
}

const Header: FC<HeaderProps> = ({ title }) => {
  const hasTitle =
    title !== undefined &&
    title !== null &&
    !(typeof title === "string" && title.trim() === "");

  const tooltip = typeof title === "string" ? title : undefined;

  return (
    <header className="app-header">
      {hasTitle ? (
        typeof title === "string" ? (
          <div className="app-header__content" title={tooltip}>
            <SmartText variant="h2" className="app-header__title">
              {title}
            </SmartText>
          </div>
        ) : (
          <div className="app-header__content">{title}</div>
        )
      ) : (
        <div className="app-header__content">
          <SmartText variant="h2" className="app-header__title">
            Oh, noch kein Titel?
          </SmartText>
        </div>
      )}
    </header>
  );
};

export default Header;

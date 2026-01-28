import type { FC, ReactNode } from "react";
import "./PageWrapper.css";

interface PageWrapperProps {
  children: ReactNode;
}

const PageWrapper: FC<PageWrapperProps> = ({ children }) => {
  return <div className="page-wrapper">{children}</div>;
};

export default PageWrapper;

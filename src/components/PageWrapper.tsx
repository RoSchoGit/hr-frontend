import type { FC, ReactNode } from "react";

interface PageWrapperProps {
  children: ReactNode;
}

const PageWrapper: FC<PageWrapperProps> = ({ children }) => {
  return (
    <div className="pt-2 pb-6 px-4 max-w-3xl mx-auto flex flex-col gap-4">
      {children}
    </div>
  );
};

export default PageWrapper;

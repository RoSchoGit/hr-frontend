import React from "react";
import type { ReactNode } from "react";

interface SmartTextProps {
  children: ReactNode;
  variant?: "h1" | "h2" | "body" | "small";
  className?: string;
  lang?: string;
}

const variantClasses = {
  h1: "text-2xl font-semibold",
  h2: "text-lg font-semibold",
  body: "text-base",
  small: "text-sm text-gray-600",
};

const SmartText: React.FC<SmartTextProps> = ({
  children,
  variant = "body",
  className = "",
  lang = "de",
}) => {
  const Tag = variant === "h1" ? "h1" : variant === "h2" ? "h2" : "p";

  return (
    <Tag
      lang={lang}
      className={`${variantClasses[variant]} break-words hyphens-auto whitespace-pre-wrap ${className}`}
      style={{
        overflowWrap: "break-word",
        wordBreak: "break-word",
        hyphens: "auto",
      }}
    >
      {children}
    </Tag>
  );
};

export default SmartText;

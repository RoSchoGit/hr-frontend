import React from "react";
import type { ReactNode } from "react";
import "./SmartText.css";

interface SmartTextProps {
  children: ReactNode;
  variant?: "h1" | "h2" | "body" | "small";
  className?: string;
  lang?: string;
  as?: keyof HTMLElementTagNameMap;
}

const BLOCK_TAGS = new Set([
  "div", "p", "section", "article", "header", "footer",
  "main", "nav", "ul", "ol", "li", "table", "thead", "tbody",
  "tfoot", "tr", "td", "th", "form", "fieldset", "figure",
  "figcaption", "aside",
]);

function hasBlockLevelChild(children: ReactNode): boolean {
  const arr = React.Children.toArray(children);
  return arr.some(child => {
    if (React.isValidElement(child)) {
      if (typeof child.type === "string") {
        return BLOCK_TAGS.has(child.type);
      }
      return true;
    }
    return false;
  });
}

const SmartText: React.FC<SmartTextProps> = ({
  children,
  variant = "body",
  className = "",
  lang = "de",
  as,
}) => {
  const childArray = React.Children.toArray(children);

  const singleChild =
    childArray.length === 1 && React.isValidElement(childArray[0])
      ? (childArray[0] as React.ReactElement<any, any>)
      : null;

  const baseClass = "smart-text";
  const variantClass = `smart-text--${variant}`;

  // ---------------- Headings ----------------
  if (variant === "h1" || variant === "h2") {
    const headingTag = variant;

    if (
      singleChild &&
      typeof singleChild.type === "string" &&
      singleChild.type === headingTag
    ) {
      const existingProps = singleChild.props as any;

      return React.cloneElement(singleChild, {
        lang,
        className: [
          existingProps.className,
          baseClass,
          variantClass,
          className,
        ]
          .filter(Boolean)
          .join(" "),
      });
    }

    const containsAnyHeading = childArray.some(
      ch =>
        React.isValidElement(ch) &&
        typeof ch.type === "string" &&
        (ch.type === "h1" || ch.type === "h2")
    );

    if (containsAnyHeading) {
      return <>{children}</>;
    }

    const Tag = (as ?? headingTag) as React.ElementType;

    return (
      <Tag
        lang={lang}
        className={[baseClass, variantClass, className].filter(Boolean).join(" ")}
      >
        {children}
      </Tag>
    );
  }

  // ---------------- Body / Small ----------------
  const containsBlock = hasBlockLevelChild(children);
  const defaultTag: keyof HTMLElementTagNameMap = containsBlock ? "div" : "p";
  const Tag = (as ?? defaultTag) as React.ElementType;

  return (
    <Tag
      lang={lang}
      className={[baseClass, variantClass, className].filter(Boolean).join(" ")}
    >
      {children}
    </Tag>
  );
};

export default SmartText;

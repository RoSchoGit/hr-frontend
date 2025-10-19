import React from "react";
import type { ReactNode } from "react";

interface SmartTextProps {
  children: ReactNode;
  variant?: "h1" | "h2" | "body" | "small";
  className?: string;
  lang?: string;
  as?: keyof HTMLElementTagNameMap;
}

const variantClasses: Record<string, string> = {
  h1: "text-2xl font-semibold",
  h2: "text-lg font-semibold",
  body: "text-base",
  small: "text-sm text-gray-600",
};

const BLOCK_TAGS = new Set([
  "div", "p", "section", "article", "header", "footer",
  "main", "nav", "ul", "ol", "li", "table", "thead", "tbody",
  "tfoot", "tr", "td", "th", "form", "fieldset", "figure",
  "figcaption", "aside"
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

const baseStyle = {
  overflowWrap: "break-word",
  wordBreak: "break-word",
  hyphens: "auto",
};

const SmartText: React.FC<SmartTextProps> = ({
  children,
  variant = "body",
  className = "",
  lang = "de",
  as,
}) => {
  const childArray = React.Children.toArray(children);

  // ---------- Änderung: singleChild explizit als React.ReactElement<any, any> typisieren ----------
  const singleChild = childArray.length === 1 && React.isValidElement(childArray[0])
    ? (childArray[0] as React.ReactElement<any, any>)
    : null;
  // -----------------------------------------------------------------------------------------------

  if (variant === "h1" || variant === "h2") {
    const headingTag = variant;

    if (singleChild && typeof singleChild.type === "string" && singleChild.type === headingTag) {
      // ---------- Änderung: props als any behandeln, damit TS className/style akzeptiert ----------
      const existingProps = singleChild.props as any;
      const mergedClassName = [existingProps.className, variantClasses[variant], className].filter(Boolean).join(" ");
      const mergedStyle = { ...(existingProps.style || {}), ...baseStyle };
      return React.cloneElement(singleChild, { lang, className: mergedClassName, style: mergedStyle });
      // ----------------------------------------------------------------------------------------
    }

    const containsAnyHeading = childArray.some(ch => React.isValidElement(ch) && typeof (ch as React.ReactElement).type === "string" && ((ch as React.ReactElement).type === "h1" || (ch as React.ReactElement).type === "h2"));
    if (containsAnyHeading) {
      return <>{children}</>;
    }

    const Tag = (as ?? headingTag) as React.ElementType;
    return (
      <Tag lang={lang} className={`${variantClasses[variant]} break-words hyphens-auto whitespace-pre-wrap ${className}`} style={baseStyle}>
        {children}
      </Tag>
    );
  }

  const containsBlock = hasBlockLevelChild(children);
  const defaultTag: keyof HTMLElementTagNameMap = containsBlock ? "div" : "p";
  const Tag = (as ?? defaultTag) as React.ElementType;

  return (
    <Tag lang={lang} className={`${variantClasses[variant]} break-words hyphens-auto whitespace-pre-wrap ${className}`} style={baseStyle}>
      {children}
    </Tag>
  );
};

export default SmartText;

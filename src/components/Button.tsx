import React from "react";
import "./Button.css";

export type ButtonVariant =
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "ghost"
    | "icon";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    fit?: boolean;
    left?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = "primary",
            size = "md",
            fullWidth = false,
            fit = false,
            left = false,
            className = "",
            disabled,
            type = "button",
            children,
            ...rest
        },
        ref
    ) => {
        const classes = [
            "btn",
            `btn--${variant}`,
            `btn--${size}`,
            fullWidth ? "btn--full" : fit ? "btn--fit" : "btn--inline",
            left ? "btn--left" : "btn--center",
            variant === "ghost" || variant === "icon"
                ? "btn--no-focus"
                : "btn--focusable",
            className,
        ]
            .filter(Boolean)
            .join(" ");

        return (
            <button
                ref={ref}
                type={type}
                disabled={disabled}
                aria-disabled={disabled}
                className={classes}
                {...rest}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";
export default Button;

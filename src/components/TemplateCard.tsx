import React from "react";
import "./TemplateCard.css";

export type TemplateCardVariant = "default" | "muted" | "skeleton" | "cta";

export type TemplateCardProps = {
    className?: string;
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    children?: React.ReactNode;
    minHeightPx?: number;
    variant?: TemplateCardVariant;
    onClick?: () => void;
    showCTA?: boolean;
    ctaLabel?: string;
    onCTAClick?: () => void;
};

export default function TemplateCard({
    className = "",
    title,
    subtitle,
    children,
    minHeightPx = 96,
    variant = "default",
    onClick,
    showCTA = false,
    ctaLabel = "Aktion",
    onCTAClick,
}: TemplateCardProps) {
    const classes = [
        "template-card",
        onClick && "template-card--clickable",
        variant === "muted" && "template-card--muted",
        variant === "skeleton" && "template-card--skeleton",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div
            onClick={onClick}
            className={classes}
            style={{ minHeight: `${minHeightPx}px` }}
            role={onClick ? "button" : undefined}
        >
            {/* Left content */}
            <div className="template-card__content">
                {title ? (
                    <div className="template-card__title">{title}</div>
                ) : children ? (
                    children
                ) : variant === "skeleton" ? (
                    <>
                        <div style={{ height: 20, width: "75%", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 4 }} />
                        <div style={{ height: 16, width: "50%", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 4, marginTop: 8 }} />
                    </>
                ) : (
                    <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Platzhalter</div>
                )}
                {subtitle && <div className="template-card__subtitle">{subtitle}</div>}
            </div>

            {/* Right content */}
            <div className="template-card__right">
                <div className="template-card__status-dots">
                    <span />
                    <span />
                </div>

                {showCTA ? (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onCTAClick?.();
                        }}
                        type="button"
                        className="template-card__cta"
                    >
                        {ctaLabel}
                    </button>
                ) : (
                    <div className="template-card__chevron">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path
                                d="M9 6l6 6-6 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
}

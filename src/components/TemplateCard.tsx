// src/components/TemplateCard.tsx
import React from "react";

export type TemplateCardVariant = "default" | "muted" | "skeleton" | "cta";

export type TemplateCardProps = {
    className?: string;
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    children?: React.ReactNode;
    minHeightPx?: number; // z.B. 96
    variant?: TemplateCardVariant;
    onClick?: () => void;
    // optional CTA inside the card (right aligned)
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
    const base = "flex border-2 rounded-lg shadow-md bg-white select-none transition-shadow";
    const clickable = onClick ? "cursor-pointer hover:shadow-lg" : "";
    const muted = variant === "muted" ? "opacity-95 bg-surface" : "";
    const skeleton = variant === "skeleton" ? "animate-pulse bg-slate-100 border-slate-100" : "";

    return (
        <div
            onClick={onClick}
            className={`${base} ${clickable} ${muted} ${skeleton} ${className}`}
            style={{ minHeight: `${minHeightPx}px`, borderColor: "rgba(0,0,0,0.06)" }}
            role={onClick ? "button" : undefined}
        >
            {/* Left content */}
            <div className="flex-1 min-w-0 p-2 flex flex-col gap-1">
                {title ? (
                    <div className="truncate font-medium text-left text-base">{title}</div>
                ) : children ? (
                    children
                ) : variant === "skeleton" ? (
                    <>
                        <div className="h-5 w-3/4 bg-white/10 rounded" />
                        <div className="h-4 w-1/2 bg-white/10 rounded mt-2" />
                    </>
                ) : (
                    <div className="text-sm text-gray-500">Platzhalter</div>
                )}

                {subtitle && <div className="text-sm text-gray-500 truncate">{subtitle}</div>}
            </div>

            {/* Right area (icons / CTA) */}
            <div className="flex flex-row items-center space-x-2 basis-auto shrink-0 px-2 py-2">
                <div className="flex flex-col items-center space-y-1 mr-1">
                    {/* two small dots as status placeholders */}
                    <span className="w-2 h-2 rounded-full bg-transparent" />
                    <span className="w-2 h-2 rounded-full bg-transparent" />
                </div>

                {/* Chevron / CTA */}
                {showCTA ? (
                    <button
                        onClick={(e) => { e.stopPropagation(); onCTAClick?.(); }}
                        className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
                        type="button"
                    >
                        {ctaLabel}
                    </button>
                ) : (
                    <div className="w-8 h-8 flex items-center justify-center rounded text-gray-400">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
}

// components/Loader.tsx
import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

type LoaderProps = {
    size?: number;                 // Größe des Spinners in px
    loading?: boolean;             // sichtbarkeit
    fullScreen?: boolean;          // Fullscreen overlay oder inline
    message?: string | null;       // optionaler Text unter dem Spinner
    ariaLabel?: string;            // für assistive Technologie
    className?: string;            // zusätzliche Klassen
};

const srOnlyStyle: React.CSSProperties = {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0,
};

export default function Loader({
    size = 48,
    loading = true,
    fullScreen = false,
    message = "Lädt…",
    ariaLabel = "Lädt",
    className,
}: LoaderProps) {
    if (!loading) return null;

    if (fullScreen) {
        return (
            <div
                role="status"
                aria-busy="true"
                aria-live="polite"
                aria-label={ariaLabel}
                style={{
                    position: "fixed",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255,255,255,0.75)",
                    zIndex: 9999,
                }}
                className={className}
            >
                <div style={{ textAlign: "center" }}>
                    <ClipLoader size={size} />
                    {message ? (
                        <div style={{ marginTop: 12 }}>
                            <span>{message}</span>
                        </div>
                    ) : (
                        // Für Screenreader, falls message null
                        <span style={srOnlyStyle}>{ariaLabel}</span>
                    )}
                </div>
            </div>
        );
    }

    // Inline / centered loader
    return (
        <div
            role="status"
            aria-busy="true"
            aria-label={ariaLabel}
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            className={className}
        >
            <ClipLoader size={size} />
            {message ? (
                <div style={{ marginLeft: 12 }}>
                    <span>{message}</span>
                </div>
            ) : (
                <span style={srOnlyStyle}>{ariaLabel}</span>
            )}
        </div>
    );
}

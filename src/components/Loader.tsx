// components/Loader.tsx
import ClipLoader from "react-spinners/ClipLoader";
import "./Loader.css";

type LoaderProps = {
    size?: number;
    loading?: boolean;
    fullScreen?: boolean;
    message?: string | null;
    ariaLabel?: string;
    className?: string;
};

export default function Loader({
    size = 48,
    loading = true,
    fullScreen = false,
    message = "Lädt…",
    ariaLabel = "Lädt",
    className = "",
}: LoaderProps) {
    if (!loading) return null;

    const rootClass = [
        "loader",
        fullScreen ? "loader--fullscreen" : "loader--inline",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div
            role="status"
            aria-busy="true"
            aria-live="polite"
            aria-label={ariaLabel}
            className={rootClass}
        >
            <div className="loader__content">
                <ClipLoader size={size} />

                {message ? (
                    <div className="loader__message">{message}</div>
                ) : (
                    <span className="loader__sr-only">{ariaLabel}</span>
                )}
            </div>
        </div>
    );
}

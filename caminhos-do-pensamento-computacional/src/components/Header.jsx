import React from "react";

export default function Header({ onOpenAbout, onOpenForm, showHomeButtons = true }) {
    const formUrl = "https://forms.gle/"; // substitua pelo link real

    return (
        <header className="header">
            <div className="left">
                {showHomeButtons && (
                    <>
                        <button
                            type="button"
                            className="btn btn-header btn-about"
                            onClick={onOpenAbout}
                            aria-label="Sobre"
                        >
                            {/* ícone info */}
                            <svg className="icon" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.0" />
                                <path d="M12 8v.01M11 12h1v4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Sobre</span>
                        </button>

                        <button
                            type="button"
                            className="btn btn-header btn-evaluate"
                            onClick={() => (onOpenForm ? onOpenForm() : window.open(formUrl, "_blank", "noopener,noreferrer"))}
                            aria-label="Avaliar"
                        >
                            {/* estrela vazada (outline) */}
                            <svg className="icon" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <path d="M12 17.3l5.39 3.18-1.45-6.03L20.5 9.5l-6.11-.53L12 3.5 9.61 8.97 3.5 9.5l4.56 4.95L6.61 20.5 12 17.3z"
                                    stroke="currentColor" strokeWidth="2.0" strokeLinejoin="round" fill="none" />
                            </svg>

                            <span>Avaliar</span>

                            {/* setinha de redirecionamento (external link) */}
                            <svg className="ext-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <path d="M14 3h7v7" stroke="currentColor" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M10 14L21 3" stroke="currentColor" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </>
                )}
            </div>
        </header>
    );
}
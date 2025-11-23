import React, { useEffect } from "react";

export default function Home({ progress = {}, onStart, onNavigateToModules }) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Verifica se a introdução foi completada
    const introCompleted = progress.intro?.everCompleted === true;

    return (
        <div className="home">
            <div className="intro-text">
                <h1>Caminhos do Pensamento Computacional</h1>
                <p>Explore os pilares do Pensamento Computacional de forma prática, interativa e divertida!</p>
            </div>

            <div style={{ marginTop: "3rem", display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "center" }}>
                <button
                    className="btn start"
                    onClick={() => onStart && onStart()}
                    aria-label={introCompleted ? "Rever Introdução" : "Iniciar - Começar pela Introdução"}
                >
                    <svg className="icon start-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M5 3v18l15-9L5 3z" />
                    </svg>
                    {introCompleted ? "Introdução" : "Iniciar"}
                </button>

                {introCompleted && (
                    <button
                        className="btn start modules-btn"
                        onClick={() => onNavigateToModules && onNavigateToModules()}
                        aria-label="Acessar Módulos"
                    >
                        Acessar Módulos
                        <svg className="icon start-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}
// src/pages/ModulesPage.jsx
import React, { useEffect } from "react";
import ProgressBar from "../components/ProgressBar";

export default function ModulesHomePage({ modules = [], progress = {}, onOpenModule, onShowAlert, onBackToHome }) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const isUnlocked = (m) => {
        // Módulo 1 só desbloqueia após completar a introdução
        if (m?.id === 1) {
            return progress.intro?.completed === true;
        }
        // Outros módulos desbloqueiam se o anterior foi completado
        return !!(progress[m.id - 1] && progress[m.id - 1].everCompleted);
    };

    const getPercent = (id) => {
        const moduleProgress = progress[id];
        // Se já foi completado alguma vez, mostra sempre 100%
        if (moduleProgress?.everCompleted) {
            return 100;
        }
        // Caso contrário, mostra a porcentagem atual (ou 0)
        return moduleProgress && typeof moduleProgress.percent === "number" ? moduleProgress.percent : 0;
    };

    const handleCardClick = (m) => {
        if (isUnlocked(m)) {
            onOpenModule && onOpenModule(m.id);
        } else {
            if (m.id === 1) {
                onShowAlert && onShowAlert("Complete a Introdução primeiro! Clique no botão 'Voltar' e depois em 'Introdução'.");
            } else {
                onShowAlert && onShowAlert("Módulo bloqueado. Complete o módulo anterior para desbloqueá-lo.");
            }
        }
    };

    const getMedalEmoji = (moduleId) => {
        return "🏅";
    };

    return (
        <div className="home">
            <div className="intro-text">
                <h1>Caminhos do Pensamento Computacional</h1>
                <p>Explore os pilares do Pensamento Computacional de forma prática, interativa e divertida!</p>
            </div>

            <div className="cards">
                {modules.map((m) => {
                    const unlocked = isUnlocked(m);
                    return (
                        <div
                            key={m.id}
                            role="button"
                            tabIndex={0}
                            className={`card ${unlocked ? "clickable" : "locked"}`}
                            onClick={() => handleCardClick(m)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    handleCardClick(m);
                                }
                            }}
                            aria-disabled={!unlocked}
                        >
                            {!unlocked && <div className="lock-badge" aria-hidden>🔒</div>}

                            <div className="card-top">
                                <div className="card-icon">
                                    {m.icon || (m.character && m.character.face) || "🃏"}
                                </div>
                                <h2 className="card-title">{m.title}</h2>
                            </div>

                            {(progress[m.id]?.completed || progress[m.id]?.everCompleted) && (
                                <div className="medal-badge">{getMedalEmoji(m.id)}</div>
                            )}

                            <p className="card-desc">{m.keyPoints?.[0] || m.description}</p>

                            <div className="card-footer">
                                <ProgressBar progress={getPercent(m.id)} />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center" }}>
                <button
                    className="btn start"
                    onClick={() => onBackToHome && onBackToHome()}
                    aria-label="Voltar para Tela Inicial"
                >
                    <svg className="icon start-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden style={{ transform: "rotate(180deg)" }}>
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                    </svg>
                    Voltar
                </button>
            </div>
        </div>
    );
}
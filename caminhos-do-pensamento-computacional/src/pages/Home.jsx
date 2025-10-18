import React, { useEffect } from "react";
import ProgressBar from "../components/ProgressBar";


export default function Home({ modules = [], progress = {}, onStart, onOpenModule, onShowAlert }) {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const isUnlocked = (m) => {
        if (m?.id === 1) return true;
        return !!(progress[m.id - 1] && progress[m.id - 1].completed);
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
            onShowAlert && onShowAlert("Módulo bloqueado. Complete o módulo anterior para o liberar.");
        }
    };

    return (
        <div className="home">
            <div className="intro-text">
                <h1>Caminhos do Pensamento Computacional</h1>
                <p>Aprenda sobre algoritmos de forma prática, interativa e divertida!</p>
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
                            {/* lock badge (top-right) */}
                            {!unlocked && <div className="lock-badge" aria-hidden>🔒</div>}

                            <div className="card-top">
                                <div className="card-icon">
                                    {m.icon || (m.character && m.character.face) || "🃏"}
                                </div>

                                <h2 className="card-title">{m.title}</h2>
                            </div>

                            {/* descrição preservada exatamente como já estava */}
                            <p className="card-desc">{m.keyPoints?.[0] || m.description}</p>

                            {/* footer com barra de progresso sempre alinhada ao rodapé do card */}
                            <div className="card-footer">
                                <ProgressBar progress={getPercent(m.id)} />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: "1.6rem", display: "inline-flex", justifyContent: "center" }}>
                <button
                    className="btn start"
                    onClick={() => onStart && onStart(1)}
                    aria-label="Iniciar"
                >
                    <svg className="icon start-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M5 3v18l15-9L5 3z" />
                    </svg>
                    Iniciar
                </button>
            </div>
        </div>
    );
}
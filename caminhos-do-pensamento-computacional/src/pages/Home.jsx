import React, { useEffect } from "react";
import ProgressBar from "../components/ProgressBar";
import Header from "../components/Header";


export default function Home({ modules = [], progress = {}, onStart, onOpenModule, onShowAlert }) {

    useEffect(() => {
        window.scrollTo(0,0);
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
            // Vai direto para o módulo, independente de qual seja
            onOpenModule && onOpenModule(m.id);
        } else {
            // Mensagem personalizada para módulo 1
            if (m.id === 1) {
                onShowAlert && onShowAlert("Complete a Introdução primeiro! Clique em 'Iniciar' abaixo.");
            } else {
                onShowAlert && onShowAlert("Módulo bloqueado. Complete o módulo anterior para desbloqueá-lo.");
            }
        }
    };

    // Função para retornar o emoji da medalha de cada módulo
    const getMedalEmoji = (moduleId) => {
        switch (moduleId) {
            case 1, 2, 3, 4:
                return "🏅"; 
            default:
                return "🏅"; 
        }
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
                            {/* lock badge (top-right) */}
                            {!unlocked && <div className="lock-badge" aria-hidden>🔒</div>}

                            <div className="card-top">
                                <div className="card-icon">
                                    {m.icon || (m.character && m.character.face) || "🃏"}
                                </div>

                                <h2 className="card-title">{m.title}</h2>
                            </div>

                            {/* medalha flutuante (só aparece quando completo) */}
                            {(progress[m.id]?.completed || progress[m.id]?.everCompleted) && (
                                <div className="medal-badge">{getMedalEmoji(m.id)}</div>
                            )}

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
                    onClick={() => onStart && onStart()}
                    aria-label="Iniciar - Começar pela Introdução"
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
import React, { useEffect, useState } from "react";
import ProgressBar from "../components/ProgressBar";

export default function Module({ moduleData, onComplete, onBackHome, onAdvance, onReset, progress = { percent: 0 }, onProgressUpdate = () => { } }) {
    const [step, setStep] = useState(1); // etapas do módulo
    const [percent, setPercent] = useState(progress.percent || 0);

    useEffect(() => {
        // quando mudar prop progress (retorno da app) sincroniza
        setPercent(progress.percent || 0);
    }, [progress.percent]);

    const handleContinue = () => {
        if (step === 1) {
            setStep(2);
            const next = Math.max(percent, 50);
            setPercent(next);
            onProgressUpdate(next);
        } else {
            // finalizar módulo
            setPercent(100);
            onProgressUpdate(100);
            onComplete && onComplete();
        }
    };

    const handleBack = () => {
        // mantém progresso salvo via onProgressUpdate e volta para home
        onBackHome && onBackHome();
    };

    return (
        <div className="module">
            <ProgressBar progress={percent} />

            <h2>{moduleData.title}</h2>

            {step === 1 && (
                <section>
                    <h3>Teoria — Sequências</h3>
                    <p>
                        Uma sequência é uma ordem de instruções que deve ser seguida passo a passo.
                        Exemplo no dia a dia: preparar um sanduíche — primeiro pegue o pão, depois passe manteiga, adicione recheio e sirva.
                        Seguir as etapas na ordem correta evita erros e garante o resultado esperado.
                    </p>

                    <p>
                        Outro exemplo: escovar os dentes — primeiro molhar a escova, aplicar pasta, escovar por 2 minutos e depois enxaguar.
                        Cada ação depende da anterior para que o resultado seja correto.
                    </p>

                    <div style={{ margin: "1rem 0" }}>
                        <strong>Exercício prático:</strong> descreva os passos para amarrar um cadarço — a ordem importa!
                    </div>
                </section>
            )}

            {step === 2 && (
                <section>
                    <h3>Aplicação prática</h3>
                    <p>
                        Agora veremos um exemplo aplicado: transformar uma receita simples em passos claros — identificar ingredientes, preparar, cozinhar e servir.
                    </p>
                    <p>Em seguida, teste suas instruções seguindo-as literalmente — isso mostra se a sequência está correta.</p>
                </section>
            )}

            <div style={{ margin: "1rem 0" }}>
                <iframe
                    width="100%"
                    height="360"
                    src={moduleData.video}
                    title={moduleData.title + " — vídeo"}
                    frameBorder="0"
                    allowFullScreen
                />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <button className="btn" onClick={handleBack}>Voltar à Home</button>
                <div style={{ display: "flex", gap: 8 }}>
                    {step === 2 && <button className="btn" onClick={() => { setStep(1); /* voltar etapa se quiser */ }}>Voltar</button>}
                    <button className="btn" onClick={handleContinue}>
                        {step === 1 ? "Continuar" : "Concluir Módulo"}
                    </button>
                </div>
            </div>
        </div>
    );
}
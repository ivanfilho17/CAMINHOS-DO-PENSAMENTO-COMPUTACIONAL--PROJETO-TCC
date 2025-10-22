import React, { useEffect, useState } from "react";
import ProgressBar from "../components/ProgressBar";
import DigitalPuzzle from "../components/DigitalPuzzle";
import PlanBackpack from "../components/PlanBackpack";
import AssembleCar from "../components/AssembleCar";
import Quiz from "../components/Quiz";
import Confetti from '../components/Confetti';
import './Module.css';

export default function Module({
    moduleData,
    onComplete,
    onBackHome,
    onAdvance,
    onReset,
    progress = { percent: 0 },
    onProgressUpdate = () => { }
}) {
    const [telaAtual, setTelaAtual] = useState(1);
    const [percent, setPercent] = useState(0);
    const [exerciciosConcluidos, setExerciciosConcluidos] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);

    // Scroll to top ao mudar de tela
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [telaAtual]);

    // Inicializa o progresso se houver um valor salvo
    useEffect(() => {
        if (progress?.percent === 100) {
            setPercent(100);
        }
    }, [progress]);

    // Detecta scroll uma única vez
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Lógica de progresso principal
    const irParaTela = (tela, progresso) => {
        setTelaAtual(tela);
        const nextPercent = Math.max(percent, progresso);
        setPercent(nextPercent);
        onProgressUpdate(nextPercent);
    };

    const handleExercicioConcluido = () => {
        setExerciciosConcluidos((prev) => prev + 1);
    };

    useEffect(() => {
        // Ajuste de progresso para atividades
        if (exerciciosConcluidos === 1) irParaTela(2, 30);
        if (exerciciosConcluidos === 2) irParaTela(2, 40);
        if (exerciciosConcluidos === 3) irParaTela(2, 50);
    }, [exerciciosConcluidos]);

    const handleQuestionAnswered = (questionIndex) => {
        const totalPerguntas = moduleData.quiz.length;
        const progressoQuiz = ((questionIndex + 1) / totalPerguntas) * 30;
        const novaPorcentagem = Math.round(70 + progressoQuiz);
        setPercent(Math.min(novaPorcentagem, 99));
    };

    const handleQuizComplete = (pontuacao) => {
        setPercent(100);
        onProgressUpdate(100);
        onComplete && onComplete();
        setTelaAtual(4);
    };

    const handleReiniciar = () => {
        onReset && onReset(moduleData.id);
        setPercent(0);
        setExerciciosConcluidos(0);
        setTelaAtual(1);
    };

    const renderAtividade = (atividadeId, key) => {
        switch (atividadeId) {
            case "puzzle":
                return <DigitalPuzzle key={key} onConcluido={handleExercicioConcluido} />;
            case "mochila":
                return <PlanBackpack key={key} onConcluido={handleExercicioConcluido} />;
            case "carro":
                return <AssembleCar key={key} onConcluido={handleExercicioConcluido} />;
            default:
                return <p key={key}>Atividade '{atividadeId}' não encontrada.</p>;
        }
    };

    return (
        <div className="module">
            <div
                className={`progress-container ${isScrolled ? "scrolled" : ""} ${telaAtual === 4 ? "conclusion-screen" : ""
                    }`}
            >
                <ProgressBar progress={percent} />
            </div>

            {/* ---------- TELA 1: TEORIA ---------- */}
            {telaAtual === 1 && moduleData.teoria && (
                <div className="tela-conteudo">
                    <header className="module-header">
                        <h1>{moduleData.teoria.tituloPrincipal || moduleData.title}</h1>
                        <h4>{moduleData.teoria.subtitulo || moduleData.subtitulo}</h4>
                    </header>

                    <section className="texto-explicativo">
                        <h3>{moduleData.teoria.introducao}</h3>
                        <p>{moduleData.teoria.explicacao}</p>

                        {moduleData.teoria.exemploPrincipal && (
                            <div className="exemplo-principal">
                                <h4>{moduleData.teoria.exemploPrincipal.titulo}</h4>
                                <p>{moduleData.teoria.exemploPrincipal.tarefa}</p>
                                <ul>
                                    {moduleData.teoria.exemploPrincipal.subproblemas.map(
                                        (sub, i) => (
                                            <p key={i}>{sub}</p>
                                        )
                                    )}
                                </ul>
                                <p>
                                    <strong>
                                        {moduleData.teoria.exemploPrincipal.conclusao}
                                    </strong>
                                </p>
                            </div>
                        )}
                    </section>

                    {moduleData.teoria.exemplosReais && (
                        <section className="exemplos-container">
                            <h3>{moduleData.teoria.exemplosReais.titulo}</h3>
                            <div className="cards-exemplo">
                                {moduleData.teoria.exemplosReais.itens.map((ex, i) => (
                                    <div className="card-exemplo" key={i}>
                                        <h4>{ex.titulo}</h4>
                                        <p>{ex.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <div className="video-container">
                        <h4>Vídeo de Apoio</h4>
                        <iframe
                            width="100%"
                            height="360"
                            src={moduleData.video}
                            title={`Vídeo - ${moduleData.title}`}
                            allowFullScreen
                        ></iframe>
                    </div>

                    <footer className="module-footer">
                        <button className="btn" onClick={onBackHome}>
                            <svg
                                className="icon-voltar"
                                viewBox="0 0 24 24"
                            >
                                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
                            </svg>
                        </button>
                        <button
                            className="btn start"
                            onClick={() => irParaTela(2, 10)}
                        >
                            Continuar
                            <svg
                                className="icon-avancar"
                                viewBox="0 0 24 24"
                            >
                                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path>
                            </svg>
                        </button>
                    </footer>
                </div>
            )}

            {/* ---------- TELA 2: ATIVIDADES ---------- */}
            {telaAtual === 2 && (
                <div className="tela-conteudo">
                    <header className="module-header">
                        <h1>🧩 Atividades Interativas: Decomposição</h1>
                    </header>

                    {moduleData.atividades?.map((atividadeId, index) =>
                        renderAtividade(atividadeId, index)
                    )}

                    <footer className="module-footer">
                        <button
                            className="btn btn-icon"
                            onClick={() => setTelaAtual(1)}
                            aria-label="Voltar"
                        >
                            <svg viewBox="0 0 24 24">
                                <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"></path>
                            </svg>
                        </button>

                        {exerciciosConcluidos >= (moduleData.atividades?.length || 0) && (
                            <button
                                className="btn start"
                                onClick={() => irParaTela(3, 70)}
                            >
                                Continuar
                                <svg
                                    className="icon-avancar"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path>
                                </svg>
                            </button>
                        )}
                    </footer>
                </div>
            )}

            {/* ---------- TELA 3: QUIZ ---------- */}
            {telaAtual === 3 && (
                <div className="tela-conteudo quiz-screen-wrapper">
                    <Quiz
                        quizData={moduleData.quiz}
                        onQuizComplete={handleQuizComplete}
                        onQuestionAnswered={handleQuestionAnswered}
                    />
                    <footer className="module-footer quiz-footer">
                        <button
                            className="btn btn-icon"
                            onClick={() => setTelaAtual(2)}
                            aria-label="Voltar para Atividades"
                        >
                            <svg viewBox="0 0 24 24">
                                <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"></path>
                            </svg>
                        </button>
                        <button
                            className="btn btn-icon"
                            onClick={onBackHome}
                            aria-label="Voltar ao Menu"
                        >
                            <svg viewBox="0 0 24 24">
                                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
                            </svg>
                        </button>
                    </footer>
                </div>
            )}

            {/* ---------- TELA 4: CONCLUSÃO ---------- */}
            {telaAtual === 4 && (
                <div className="tela-conteudo">
                    <Confetti />
                    <div className="conclusao-container">
                        <h1>PARABÉNS!</h1>
                        <p className="subtitulo">
                            Você concluiu o {moduleData.title}. ✅
                        </p>
                        <p>
                            Você dominou a habilidade de quebrar problemas maiores em partes
                            menores para resolver problemas ou realizar tarefas!
                        </p>

                        <footer className="module-footer conclusao-botoes">
                            <button
                                className="btn btn-icon btn-home"
                                onClick={onBackHome}
                                aria-label="Voltar ao Menu"
                            >
                                <svg viewBox="0 0 24 24">
                                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
                                </svg>
                            </button>
                            <button
                                className="btn btn-icon btn-refazer"
                                onClick={handleReiniciar}
                                aria-label="Reiniciar Módulo"
                            >
                                <svg viewBox="0 0 24 24">
                                    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"></path>
                                </svg>
                            </button>
                            <button
                                className="btn btn-icon btn-avancar"
                                onClick={onAdvance}
                                aria-label="Avançar para o Próximo Módulo"
                            >
                                <svg viewBox="0 0 24 24">
                                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path>
                                </svg>
                            </button>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
}

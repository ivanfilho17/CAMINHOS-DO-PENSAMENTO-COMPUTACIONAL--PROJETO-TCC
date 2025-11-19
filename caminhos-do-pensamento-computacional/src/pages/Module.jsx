import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";
import DigitalPuzzle from "../components/AtividadesModulo1/DigitalPuzzle";
import PlanBackpack from "../components/AtividadesModulo1/PlanBackpack";
import AssembleCar from "../components/AtividadesModulo1/AssembleCar";
import PadraoSequencia from "../components/AtividadesModulo2/PadraoSequencia";
import DetetiveObjetos from "../components/AtividadesModulo2/DetetiveObjetos";
import DescobrindoPadrão from "../components/AtividadesModulo2/DescobrindoPadrao";
import MapaBairro from "../components/AtividadesModulo3/MapaBairro";
import AtributosEssenciais from "../components/AtividadesModulo3/AtributosEssenciais";
import CaraCaraGame from "../components/AtividadesModulo3/CaraCaraGame";
import RoboSequencias from "../components/AtividadesModulo4/RoboSequencias";
import RoboCondicoes from "../components/AtividadesModulo4/RoboCondicoes";
import RoboRepeticoes from "../components/AtividadesModulo4/RoboRepeticoes";
import Quiz from "../components/Quiz";
import Confetti from '../components/Confetti';
import './Module.css';

export default function Module({
    moduleData,
    currentSection = 'teoria',
    onNavigateToSection,
    onComplete,
    onAdvance,
    onReset,
    progress = { percent: 0 },
    onProgressUpdate = () => { }
}) {
    const [percent, setPercent] = useState(progress?.percent || 0);
    const [exerciciosConcluidos, setExerciciosConcluidos] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    // Mapear seção para número da tela
    const sectionToScreen = {
        'teoria': 1,
        'atividades-interativas': 2,
        'quiz': 3,
        'conclusao': 4
    };

    const telaAtual = sectionToScreen[currentSection] || 1;

    // Sincroniza o estado local com o progresso salvo
    useEffect(() => {
        if (progress?.percent >= 0) {
            setPercent(progress.percent);
        }
    }, [progress?.percent]);

    // Resetar apenas quando volta para teoria E o módulo não está completo
    useEffect(() => {
        if (currentSection === 'teoria' && progress?.percent !== 100) {
            setPercent(0);
            setExerciciosConcluidos(0);
        }
    }, [moduleData.id, currentSection, progress?.percent]);

    // Sempre que mudar de tela, rola para o topo
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentSection]);

    // Detecta scroll
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Atualiza barra de progresso
    const atualizarProgresso = (novoPercent) => {
        const valor = Math.min(Math.max(novoPercent, 0), 100);
        setPercent(valor);
        onProgressUpdate(valor);
    };

    // Teoria concluída = 20%
    const handleTeoriaConcluida = () => {
        atualizarProgresso(20);
        onNavigateToSection('atividades-interativas');
    };

    // Cada atividade = +10%
    const handleExercicioConcluido = () => {
        const novoTotal = exerciciosConcluidos + 1;
        setExerciciosConcluidos(novoTotal);
        const progresso = 20 + novoTotal * 10;
        atualizarProgresso(progresso);
    };

    // Cada pergunta respondida = +10%
    const handleQuestionAnswered = (questionIndex) => {
        const progresso = 50 + (questionIndex + 1) * 10;
        atualizarProgresso(progresso);
    };

    const handleQuizComplete = (pontuacao) => {
        atualizarProgresso(100);
        onComplete && onComplete();
        onNavigateToSection('conclusao');
    };

    // Reiniciar módulo (barra volta a 0%)
    const handleReiniciar = () => {
        onReset && onReset(moduleData.id);
        setPercent(0);
        setExerciciosConcluidos(0);
        onNavigateToSection('teoria');
    };

    // Ao avançar para o próximo módulo
    const handleAvancarModulo = () => {
        onAdvance(moduleData.id + 1);
        window.scrollTo({ top: 0 });
    };

    const renderAtividade = (atividadeId, key) => {
        switch (atividadeId) {
            // ATIVIDADES MODULO 1
            case "mochila":
                return <PlanBackpack key={key} onConcluido={handleExercicioConcluido} />;
            case "carro":
                return <AssembleCar key={key} onConcluido={handleExercicioConcluido} />;
            case "puzzle":
                return <DigitalPuzzle key={key} onConcluido={handleExercicioConcluido} />;

            // ATIVIDADES MODULO 2
            case "completeSequencias":
                return <PadraoSequencia key={key} onConcluido={handleExercicioConcluido} />;
            case "detetiveObjetos":
                return <DetetiveObjetos key={key} onConcluido={handleExercicioConcluido} />;
            case "padraoSecreto":
                return <DescobrindoPadrão key={key} onConcluido={handleExercicioConcluido} />;

            // ATIVIDADES MODULO 3
            case "mapaBairro":
                return <MapaBairro key={key} onConcluido={handleExercicioConcluido} />;
            case "atributosEssenciais":
                return <AtributosEssenciais key={key} onConcluido={handleExercicioConcluido} />;
            case "caraCara":
                return <CaraCaraGame key={key} onConcluido={handleExercicioConcluido} />;

            // ATIVIDADES MODULO 4
            case "roboSequencias":
                return <RoboSequencias key={key} onConcluido={handleExercicioConcluido} />;
            case "roboCondicoes":
                return <RoboCondicoes key={key} onConcluido={handleExercicioConcluido} />;
            case "roboRepeticoes":
                return <RoboRepeticoes key={key} onConcluido={handleExercicioConcluido} />;

            default:
                return <p key={key}>Atividade '{atividadeId}' não encontrada.</p>;
        }
    };

    return (
        <div className="module">
            <div
                className={`progress-container ${isScrolled ? "scrolled" : ""} ${telaAtual === 4 ? "conclusion-screen" : ""}`}
            >
                <ProgressBar progress={percent} />
            </div>

            {/* ---------- TELA 1: TEORIA ---------- */}
            {telaAtual === 1 && moduleData.teoria && (
                <div className="tela-conteudo">
                    <header className="module-header">
                        <h1>{moduleData.teoria.tituloPrincipal || moduleData.title}</h1><br></br>
                        <h2>{moduleData.teoria.subtitulo || moduleData.subtitulo}</h2>
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

                        {/* ----- CONTEÚDO EXTRA EXCLUSIVO DO MÓDULO 4 ----- */}
                        {moduleData.id === 4 && (
                            <div className="alg-section">
                                <p>
                                    Mas para criar algoritmos que resolvam problemas da vida real,
                                    precisamos de <strong>3 blocos de construção mágicos:</strong>
                                </p>

                                <div className="alg-cards-container">
                                    {[
                                        {
                                            id: 1,
                                            icon: "🔢",
                                            title: "Sequências",
                                            desc: "A ordem exata dos passos é essencial!",
                                            back: "1️⃣ Pegar a meia → 2️⃣ Calçar a meia. A ordem importa!"
                                        },
                                        {
                                            id: 2,
                                            icon: "🔀",
                                            title: "Seleções (Condições)",
                                            desc: "Permitem fazer escolhas no algoritmo.",
                                            back: "SE o sinal estiver verde, ENTÃO atravesse; SENÃO, espere."
                                        },
                                        {
                                            id: 3,
                                            icon: "🔁",
                                            title: "Repetições (Laços)",
                                            desc: "Permitem executar algo várias vezes.",
                                            back: "ENQUANTO o prato não estiver limpo, FAÇA: continue lavando."
                                        }
                                    ].map((card) => {
                                        const [flipped, setFlipped] = useState(false);
                                        return (
                                            <div
                                                key={card.id}
                                                className={`alg-card ${flipped ? "flipped" : ""}`}
                                                onClick={() => setFlipped(!flipped)}
                                            >
                                                <div className="alg-card-inner">
                                                    <div className="alg-card-front">
                                                        <div className="alg-icon">{card.icon}</div>
                                                        <h4>{card.title}</h4>
                                                        <p>{card.desc}</p>
                                                    </div>
                                                    <div className="alg-card-back">
                                                        <h4>Exemplo:</h4>
                                                        <p>{card.back}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <p style={{ marginTop: "2rem", textAlign: "center" }}>
                                    💡 Com esses três blocos, você pode construir a solução
                                    para quase qualquer problema!
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

                    <footer className="module-footer module-footer-fixed">
                        <button className="btn btn-icon" onClick={() => navigate('/home')}>
                            <svg className="icon-voltar" viewBox="0 0 24 24">
                                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
                            </svg>
                        </button>
                        <button className="btn start" onClick={handleTeoriaConcluida}>
                            Continuar
                            <svg className="icon-avancar" viewBox="0 0 24 24">
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
                        <h1>🧩 Atividades Interativas: {moduleData.nameModule} </h1>
                    </header>

                    {moduleData.atividades?.map((atividadeId, index) =>
                        renderAtividade(atividadeId, index)
                    )}

                    <footer className="module-footer module-footer-fixed">
                        <button
                            className="btn btn-icon"
                            onClick={() => onNavigateToSection('teoria')}
                            aria-label="Voltar"
                        >
                            <svg viewBox="0 0 24 24">
                                <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"></path>
                            </svg>
                        </button>

                        <button 
                            className="btn btn-icon" 
                            onClick={() => navigate('/home')} 
                            aria-label="Voltar ao Menu">
                            <svg className="icon-voltar" viewBox="0 0 24 24">
                                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
                            </svg>
                        </button>

                        {exerciciosConcluidos >= (moduleData.atividades?.length || 0) && (
                            <button
                                className="btn start"
                                onClick={() => {
                                    atualizarProgresso(50);
                                    onNavigateToSection('quiz');
                                }}
                            >
                                Continuar
                                <svg className="icon-avancar" viewBox="0 0 24 24">
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
                    <footer className="module-footer quiz-footer module-footer-fixed">
                        <button
                            className="btn btn-icon"
                            onClick={() => onNavigateToSection('atividades-interativas')}
                            aria-label="Voltar para Atividades"
                        >
                            <svg viewBox="0 0 24 24">
                                <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"></path>
                            </svg>
                        </button>
                        <button
                            className="btn btn-icon"
                            onClick={() => navigate('/home')}
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
                            Você concluiu: {moduleData.title}. ✅
                        </p>
                        <p className="final-message">
                            {moduleData.finalMessage || "Parabéns! Você concluiu o módulo com sucesso!"}
                        </p>

                        <footer className="module-footer conclusao-botoes">
                            <button
                                className="btn btn-icon btn-home"
                                onClick={() => navigate('/home')}
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
                                onClick={handleAvancarModulo}
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
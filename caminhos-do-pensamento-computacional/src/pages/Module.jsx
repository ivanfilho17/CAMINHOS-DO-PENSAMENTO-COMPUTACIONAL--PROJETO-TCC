import React, { useEffect, useState } from "react";
import ProgressBar from "../components/ProgressBar";
import SequenciaExercicio from "../components/SequenciaExercicio";
import EncontreErro from "../components/EncontreErro";
import Quiz from "../components/Quiz";
import Confetti from '../components/Confetti';
import './Module.css';

// Adicionar 'onReset' às props recebidas
export default function Module({ moduleData, onComplete, onBackHome, onAdvance, onReset, progress = { percent: 0 }, onProgressUpdate = () => { } }) {
    const [telaAtual, setTelaAtual] = useState(1);
    const [percent, setPercent] = useState(0); // Progresso interno começa em 0
    const [exerciciosConcluidos, setExerciciosConcluidos] = useState(0);

    // NOVO ESTADO PARA CONTROLAR O SCROLL
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [telaAtual]);

    // Sincroniza o progresso salvo apenas uma vez, ao entrar no módulo
    useEffect(() => {
        if (progress.percent === 100) {
            setPercent(100);
        }
    }, []); // Array vazio garante que isto só executa na montagem inicial

    const irParaTela = (tela, progresso) => {
        setTelaAtual(tela);
        const nextPercent = Math.max(percent, progresso);
        setPercent(nextPercent);
        onProgressUpdate(nextPercent);
    };

    const handleExercicioConcluido = () => {
        setExerciciosConcluidos(prev => prev + 1);
    };

    // LÓGICA DE PROGRESSO ATUALIZADA
    useEffect(() => {
        if (exerciciosConcluidos === 1) irParaTela(2, 30);
        if (exerciciosConcluidos === 2) irParaTela(2, 40);
        if (exerciciosConcluidos === 3) irParaTela(2, 50); // Para na metade após as atividades
    }, [exerciciosConcluidos]);

    const handleQuestionAnswered = (questionIndex) => {
        // Nova lógica de 5% por pergunta, começando de 60%
        const novaPorcentagem = 60 + ((questionIndex + 1) * 5);
        setPercent(Math.min(novaPorcentagem, 95)); // Para em 95% antes da conclusão
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

    // NOVO EFEITO PARA DETETAR O SCROLL
    useEffect(() => {
        const handleScroll = () => {
            // Se o scroll vertical for maior que 50px, ativamos o estado
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        // Adiciona o "ouvinte" de evento de scroll
        window.addEventListener('scroll', handleScroll);

        // Função de limpeza: remove o "ouvinte" quando o componente é desmontado
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []); // Array vazio significa que este efeito só corre uma vez (na montagem)

    return (
        <div className="module">
            <div className={`progress-container ${isScrolled ? 'scrolled' : ''} ${telaAtual === 4 ? 'conclusion-screen' : ''}`}>
                <ProgressBar progress={percent} />
            </div>

            {telaAtual === 1 && (
                <div className="tela-conteudo">
                    <header className="module-header"><h1>O que é um Algoritmo? 🤔</h1></header>
                    <section className="texto-explicativo">
                        <p>Imagine que um algoritmo é como uma <strong>receita de bolo</strong> ou um <strong>manual de instruções</strong>. É simplesmente uma lista de passos organizados, uma sequência de ações que você precisa seguir em uma ordem específica para resolver um problema ou completar uma tarefa.</p>
                        <p>Você usa algoritmos todos os dias e nem percebe! Sua rotina para se arrumar de manhã, os passos para atravessar a rua com segurança ou até as regras de um jogo são exemplos de algoritmos da vida real.</p>
                        <h4>Características de um Bom Algoritmo</h4>
                        <p>Um algoritmo precisa ser:</p>
                        <ul>
                            <li>✅ <strong>Claro:</strong> Fácil de entender</li>
                            <li>✅ <strong>Preciso:</strong> Sem ambiguidades (não pode ter duplo sentido)</li>
                            <li>✅ <strong>Finito:</strong> Tem início e fim</li>
                            <li>✅ <strong>Eficiente:</strong> Resolve o problema da melhor forma possível</li>
                        </ul>
                    </section>
                    <div className="video-container">
                        <h4>Vídeo de Apoio</h4>
                        <iframe width="100%" height="360" src="https://www.youtube.com/embed/iEVLDKOLgQk?si=cpF-CvCprh7MOdnL" title="O que é Algoritmo?" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                    </div>
                    <section className="exemplos-container">
                        <h3>Exemplos do Dia a Dia:</h3>
                        <div className="cards-exemplo">
                            <div className="card-exemplo anim-glow-yellow"><h4>Algoritmo: Escovar os Dentes</h4><ol><li>Pegar a escova de dentes.</li><li>Colocar pasta na escova.</li><li>Escovar todos os dentes.</li><li>Enxaguar a boca.</li><li>Lavar a escova.</li></ol></div>
                            <div className="card-exemplo anim-glow-yellow"><h4>Algoritmo: Atravessar a Rua</h4><ol><li>Parar na calçada.</li><li>Olhar para a esquerda.</li><li>Olhar para a direita.</li><li>Se não vier carro, atravessar na faixa.</li><li>Chegar ao outro lado.</li></ol></div>
                        </div>
                    </section>
                    <footer className="module-footer">
                        <button className="btn" onClick={onBackHome}>
                            <svg className="icon-voltar" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path></svg>
                            Voltar ao Menu
                        </button>
                        <button className="btn" onClick={() => irParaTela(2, 20)}>
                            Continuar
                            <svg className="icon-avancar" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path></svg>
                        </button>
                    </footer>
                </div>
            )}

            {telaAtual === 2 && (
                <div className="tela-conteudo">
                    <header className="module-header"><h1>Módulo 1: Sequências ➡️</h1></header>
                    <section className="texto-explicativo">
                        <p>Como vimos, todo algoritmo é uma sequência de passos. A <strong>sequência</strong> é a parte mais básica. Ela garante que cada instrução seja executada na ordem certa, uma após a outra, sem pular nenhuma etapa.</p>
                    </section>
                    <div className="atividades-header"><span className="atividades-icon">🧩</span><h3>Atividades Interativas</h3></div>
                    <SequenciaExercicio desafioId="sanduiche" onConcluido={handleExercicioConcluido} />
                    <SequenciaExercicio desafioId="cafe" onConcluido={handleExercicioConcluido} />
                    <EncontreErro onConcluido={handleExercicioConcluido} />
                    <footer className="module-footer">
                        <button className="btn btn-icon" onClick={() => setTelaAtual(1)} aria-label="Voltar">
                            <svg viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"></path></svg>
                        </button>
                        {exerciciosConcluidos >= 3 && (
                            <button className="btn" onClick={() => irParaTela(3, 60)}>
                                Continuar
                                <svg className="icon-avancar" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path></svg>
                            </button>
                        )}
                    </footer>
                </div>
            )}

            {/* TELA 3: QUIZ */}
            {telaAtual === 3 && (
                <div className="tela-conteudo quiz-screen-wrapper">
                     <Quiz
                        quizData={moduleData.quiz}
                        onQuizComplete={handleQuizComplete}
                        onQuestionAnswered={handleQuestionAnswered}
                     />
                     {/* ADICIONAR ESTE FOOTER */}
                     <footer className="module-footer quiz-footer">
                        <button className="btn btn-icon" onClick={() => setTelaAtual(2)} aria-label="Voltar para Atividades">
                            <svg viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"></path></svg>
                        </button>
                        <button className="btn btn-icon" onClick={onBackHome} aria-label="Voltar ao Menu">
                            <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path></svg>
                        </button>
                    </footer>
                </div>
            )}

            {telaAtual === 4 && (
                <div className="tela-conteudo">
                    <Confetti />
                    <div className="conclusao-container">
                        <h1>PARABÉNS!</h1>
                        <p className="subtitulo">Você concluiu o Módulo 1 - Sequências. ✅</p>
                        <p>Você ganhou a medalha e troféu <strong>"Mestre do Algoritmo Sequencial"</strong>.</p>
                        <div className="premios-container">
                            <div className="premio-wrapper">
                                <svg className="premio-img" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="35" fill="#ffd700" stroke="#b8860b" strokeWidth="4" />
                                    <path d="M50 85 L30 15 L70 15 Z" fill="#4169e1" />
                                    <text x="50" y="60" fontSize="30" textAnchor="middle" fill="#b8860b" fontWeight="bold">1</text>
                                </svg>
                            </div>
                            <div className="premio-wrapper trophy">
                                <svg className="premio-img" viewBox="0 0 100 100">
                                    <path d="M20 20 H80 V30 H70 C70 45, 60 50, 50 50 C40 50, 30 45, 30 30 H20 Z" fill="#ffd700" stroke="#b8860b" strokeWidth="3" />
                                    <rect x="45" y="50" width="10" height="20" fill="#ffd700" stroke="#b8860b" strokeWidth="3" />
                                    <rect x="30" y="70" width="40" height="10" fill="#ffd700" stroke="#b8860b" strokeWidth="3" />
                                </svg>
                            </div>
                        </div>
                        <footer className="module-footer conclusao-botoes">
                            <button className="btn" onClick={onBackHome} aria-label="Voltar ao Menu"><svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path></svg></button>
                            <button className="btn" onClick={handleReiniciar} aria-label="Reiniciar Módulo"><svg viewBox="0 0 24 24"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"></path></svg></button>
                            <button className="btn start" onClick={onAdvance} aria-label="Avançar para o Próximo Módulo"><svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path></svg></button>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
}


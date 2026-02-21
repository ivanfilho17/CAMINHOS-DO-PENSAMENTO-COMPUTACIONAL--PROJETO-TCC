import React, { useState, useEffect } from 'react';
import Quiz from '../components/Quiz';
import './IntroPage.css';
import './Module.css';
import YouTube from 'react-youtube';

// Dados para os cards interativos
const PILARES_CARDS = [
    { id: 1, pilar: 'Decomposição', icone: '🧩', frenteIcone: '🧩', versoTexto: 'É o que você faz ao planejar uma festa: você não pensa "fazer festa" de uma vez. Você quebra em partes: 1. Lista de convidados. 2. Enviar convites. 3. Comprar comida. 4. Decorar.' },
    { id: 2, pilar: 'Padrões', icone: '🎨', frenteIcone: '🔄', versoTexto: 'É o que você faz ao notar que toda vez que chove, você precisa de um guarda-chuva. Você percebe uma regra ou padrão que se repete.' },
    { id: 3, pilar: 'Abstração', icone: '🎯', frenteIcone: '😀', versoTexto: 'É o que você faz ao desenhar um emoji feliz. Você ignora a cor do cabelo, formato do nariz e foca SÓ no essencial: olhos e boca sorrindo para mostrar "felicidade".' },
    { id: 4, pilar: 'Algoritmos', icone: '👣', frenteIcone: '🗺️', versoTexto: 'É a sua receita de bolo! Um passo a passo que qualquer pessoa pode seguir para chegar ao mesmo resultado. É o passo final que junta todas as outras ideias.' },
];

export default function IntroPage({
    quizData,
    currentSection = 'teoria',
    onNavigateToSection,
    onBackHome,
    onCompleteIntro,
    onOpenModule,
    introEverCompleted = false,
    progress = {},
    onGoToModules
}) {
    const [flippedCardId, setFlippedCardId] = useState(null);
    const [videoAssistido, setVideoAssistido] = useState(() => {
        // Restaurar do localStorage ao montar o componente
        const saved = localStorage.getItem('mod0_video_assistido');
        return saved === 'true';
    });

    // Atualiza a tela com base na currentSection
    const tela = currentSection === 'quiz' ? 'quiz' :
        currentSection === 'conclusao' ? 'conclusaoIntro' :
            'teoria';

    // =====================================================================
    // LÓGICA DE SCROLL RIGOROSA (PERSISTÊNCIA APENAS NO F5)
    // =====================================================================
    
    // 1. Restaurar Scroll (apenas se existir no storage e estiver na teoria)
    useEffect(() => {
        if (tela === 'teoria') {
            const savedScroll = sessionStorage.getItem('intro_scroll_teoria');
            if (savedScroll) {
                // Pequeno timeout para garantir que o DOM renderizou
                setTimeout(() => window.scrollTo(0, parseInt(savedScroll)), 0);
            } else {
                window.scrollTo(0, 0);
            }
        } else {
            // Se não for teoria (ex: quiz, conclusão), forçar topo
            window.scrollTo(0, 0);
        }
    }, [tela]);

    // 2. Salvar Scroll ao rolar (apenas na teoria)
    useEffect(() => {
        const handleScroll = () => {
            if (tela === 'teoria') {
                sessionStorage.setItem('intro_scroll_teoria', window.scrollY);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [tela]);

    // 3. Função auxiliar para limpar o scroll ao navegar intencionalmente
    const limparScrollTeoria = () => {
        sessionStorage.removeItem('intro_scroll_teoria');
    };
    // =====================================================================

    // Desbloquear automaticamente o módulo 1 quando chegar na conclusão (apenas uma vez)
    useEffect(() => {
        if (tela === "conclusaoIntro" && !progress?.intro?.everCompleted) {
            console.log('Desbloqueando módulo 1...');
            onCompleteIntro && onCompleteIntro();
        }
    }, [tela]);

    // FUNÇÃO DE LIMPEZA DO QUIZ DA INTRODUÇÃO
    const limparDadosQuizIntro = () => {
        const chaves = [
            "mod0_quiz_index",
            "mod0_quiz_score",
            "mod0_quiz_selected",
            "mod0_quiz_feedback",
            "mod0_quiz_finished"
        ];
        chaves.forEach(chave => localStorage.removeItem(chave));
        // Nota: mod0_video_assistido NÃO é removido, pois deve persistir
    };

    const handleIntroQuizComplete = () => {
        onNavigateToSection('conclusao');
    };

    // Função chamada quando o vídeo termina
    const handleVideoEnd = () => {
        setVideoAssistido(true);
        localStorage.setItem('mod0_video_assistido', 'true');
    };

    // Configurações do player
    const videoOptions = {
        height: '400',
        width: '100%',
        playerVars: {
            autoplay: 0,
            rel: 0,           // Mostra apenas vídeos do canal ao final
            modestbranding: 1, // Esconde o logo do YouTube na barra
            controls: 1,      // Mantém os controles visíveis
        },
    };

    // O botão de avançar não deve mais ser bloqueado pelo vídeo para permitir
    // uso offline. Sempre deixamos o usuário livre para seguir para o quiz.
    const isButtonDisabled = false;
    const opacityValue = 1;
    const cursorValue = 'pointer';

    return (
        <div className="intro-container">
            {/* TELA 1: TEORIA */}
            {tela === 'teoria' && (
                <div className="tela-conteudo">
                    <header className="module-header">
                        <h1>Introdução 🚀</h1>
                    </header>
                    <section className="texto-explicativo">
                        <h3>O que é Pensamento Computacional?</h3>
                        <p>Você já se deparou com um problema muito grande, que parecia difícil de resolver? Como montar um quebra-cabeça de muitas peças ou arrumar um quarto super bagunçado?</p>
                        <p>O Pensamento Computacional não é sobre "pensar como um computador". Na verdade, é o contrário: é um <strong>superpoder que nós, humanos, usamos para ensinar os computadores a resolver problemas</strong>. É uma forma de pensar e organizar ideias para que qualquer problema, não importa o tamanho, possa ser resolvido passo a passo.</p>
                        <p>Para usar esse superpoder, nós seguimos <strong>4 caminhos</strong> ou <strong>pilares:</strong></p>
                        <ul>
                            <li><strong>Decomposição:</strong> Quebrar o problemão em probleminhas.</li>
                            <li><strong>Reconhecimento de Padrões:</strong> Encontrar semelhanças entre eles.</li>
                            <li><strong>Abstração:</strong> Focar no que é importante e ignorar o resto.</li>
                            <li><strong>Algoritmos:</strong> Criar um plano passo a passo para resolver.</li>
                        </ul>
                        <p>Vamos explorar cada um desses pilares juntos!</p>
                    </section>

                    <div className="pilares-titulo-container">
                        <h4>Clique nos cards abaixo para ver exemplos:</h4>
                    </div>
                    <section className="pilares-container">
                        {PILARES_CARDS.map(pilar => (
                            <div key={pilar.id} className="flip-card" onClick={() => setFlippedCardId(flippedCardId === pilar.id ? null : pilar.id)}>
                                <div className={`flip-card-inner ${flippedCardId === pilar.id ? 'flipped' : ''}`}>
                                    <div className="flip-card-front">
                                        <div className="pilar-icone">{pilar.frenteIcone}</div>
                                        <h4>{pilar.pilar}</h4>
                                    </div>
                                    <div className="flip-card-back">
                                        <p>{pilar.versoTexto}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>

                    <div className="video-container">
                        <h4>Vídeo de Apoio</h4>
                        <YouTube
                            videoId="pRpjYrdb9UY"
                            opts={videoOptions}
                            onEnd={handleVideoEnd}
                        />
                    </div>

                    <footer className="module-footer">
                        <button
                            className="btn btn-icon"
                            title="Ir para o Menu Inicial"
                            onClick={() => {
                                console.log('Clicou Voltar (Teoria)');
                                // Limpa tudo ao sair
                                limparDadosQuizIntro(); 
                                limparScrollTeoria(); // Limpa scroll
                                onBackHome && onBackHome();
                            }}
                            aria-label="Voltar ao Menu Inicial"
                        >
                            <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path></svg>
                        </button>
                        <button
                            className="btn btn-icon"
                            title="Avançar para o Quiz"
                            aria-label="Avançar para o Quiz"
                            onClick={() => {
                                console.log('Clicou Próximo (Quiz)');
                                limparScrollTeoria(); // Limpa scroll ao avançar
                                onNavigateToSection && onNavigateToSection('quiz');
                            }}
                            disabled={isButtonDisabled}
                            style={{ opacity: opacityValue, cursor: cursorValue }}
                        >
                            <svg className="icon-avancar" viewBox="0 0 24 24">
                                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path>
                            </svg>
                        </button>
                    </footer>
                </div>
            )}

            {/* TELA 2: QUIZ */}
            {tela === 'quiz' && (
                <div className="tela-conteudo quiz-screen-wrapper">
                    <Quiz
                        quizData={quizData}
                        onQuizComplete={handleIntroQuizComplete}
                        moduleId={0} 
                    />
                    <footer className="module-footer quiz-footer">
                        <button
                            className="btn btn-icon"
                            title="Voltar para a Teoria"
                            onClick={() => {
                                console.log('Clicou Voltar para Teoria (Quiz)');
                                
                                limparScrollTeoria(); 
                                onNavigateToSection && onNavigateToSection('teoria');
                            }}
                            aria-label="Voltar para a Teoria"
                        >
                            <svg viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"></path></svg>
                        </button>

                        <button
                            className="btn btn-icon"
                            title="Ir para o Menu Inicial"
                            onClick={() => {
                                console.log('Clicou Voltar ao Menu (Quiz)');
                                limparDadosQuizIntro();
                                limparScrollTeoria(); // Limpa scroll
                                onBackHome && onBackHome();
                            }}
                            aria-label="Voltar ao Menu"
                        >
                            <svg viewBox="0 0 24 24">
                                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
                            </svg>
                        </button>
                    </footer>
                </div>
            )}

            {/* TELA 3: CONCLUSÃO */}
            {tela === 'conclusaoIntro' && (
                <div className="tela-conteudo conclusao-intro-container">
                    <h2>Muito bem! 👏🏽😃</h2>
                    <p>Você completou a <strong>Introdução</strong> ao Pensamento Computacional!</p>
                    <p>Os Módulos <strong>Decomposição, Padrões, Abstração e Algoritmos</strong> foram desbloqueados.</p>
                    <p>Clique em <strong>AVANÇAR</strong> para acessá-los!</p>

                    <footer className="module-footer conclusao-intro-botoes">
                        {/* BOTÃO VOLTAR AO MENU */}
                        <button
                            className="btn btn-icon"
                            title="Ir para o Menu Inicial"
                            onClick={() => {
                                console.log('Clicou Voltar ao Menu');
                                limparDadosQuizIntro();
                                limparScrollTeoria(); // Limpa scroll
                                onBackHome && onBackHome();
                            }}
                            aria-label="Voltar ao Menu Inicial"
                        >
                            <svg viewBox="0 0 24 24">
                                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
                            </svg>
                        </button>

                        {/* BOTÃO REVER INTRODUÇÃO */}
                        <button
                            className="btn btn-icon"
                            title="Rever Introdução"
                            onClick={() => {
                                console.log('Clicou Rever Introdução');
                                limparDadosQuizIntro();
                                limparScrollTeoria(); // Limpa scroll para começar do topo
                                onNavigateToSection && onNavigateToSection('teoria');
                            }}
                            aria-label="Rever Introdução"
                        >
                            <svg viewBox="0 0 24 24">
                                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"></path>
                            </svg>
                        </button>

                        {/* BOTÃO AVANÇAR (ABRIR TELA HOME DOS MÓDULOS) */}
                        <button
                            className="btn start"
                            onClick={() => {
                                console.log('Clicou Avançar -> Ir para ModulesHomePage');
                                limparDadosQuizIntro();
                                limparScrollTeoria(); // Limpa scroll
                                
                                if (onGoToModules) {
                                    onGoToModules();
                                } else {
                                    // Fallback caso a prop não tenha sido passada (opcional)
                                    console.warn("onGoToModules não foi passado em App.jsx");
                                }
                            }}
                            aria-label="Ir para Home dos Módulos"
                        >
                            Avançar
                            <svg className="icon-avancar" viewBox="0 0 24 24">
                                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path>
                            </svg>
                        </button>
                    </footer>
                </div>
            )}
        </div>
    );
}
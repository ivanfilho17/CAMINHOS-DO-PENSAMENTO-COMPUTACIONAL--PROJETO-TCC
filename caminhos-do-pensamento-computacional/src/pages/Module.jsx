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
    onBackHome,
    onReset,
    progress = { percent: 0 },
    onProgressUpdate = () => { }
}) {
    // Estado inicial sempre 0. Ignoramos a prop 'progress' na inicialização 
    // para garantir o comportamento de "nova sessão visual".
    const [percent, setPercent] = useState(0);
    const [atividadesConcluidas, setAtividadesConcluidas] = useState([]);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    const activityToLocalStorageMap = {
        // Módulo 1
        "mochila": "mod1_mochila_concluido",
        "carro": "mod1_carro_concluido",
        "puzzle": "mod1_puzzle_concluido",
        // Módulo 2
        "completeSequencias": "mod2_sequencia_concluido",
        "detetiveObjetos": "mod2_detetive_concluido",
        "padraoSecreto": "mod2_padrao_concluido",
        // Módulo 3
        "mapaBairro": "mod3_mapa_concluido",
        "atributosEssenciais": "mod3_atributos_concluido",
        "caraCara": "mod3_caracara_concluido",
        // Módulo 4
        "roboSequencias": "mod4_sequencia_concluido",
        "roboCondicoes": "mod4_condicoes_concluido",
        "roboRepeticoes": "mod4_repeticoes_concluido",
    };

    const sectionToScreen = {
        'teoria': 1,
        'atividades-interativas': 2,
        'quiz': 3,
        'conclusao': 4
    };

    const telaAtual = sectionToScreen[currentSection] || 1;

    // SINCRONIZAÇÃO: Verifica LocalStorage para restaurar progresso em caso de F5
    useEffect(() => {
        if (moduleData.atividades) {
            const concluidasRecuperadas = [];

            moduleData.atividades.forEach(actId => {
                const lsKey = activityToLocalStorageMap[actId];
                const saved = localStorage.getItem(lsKey);
                if (saved && JSON.parse(saved) === true) {
                    concluidasRecuperadas.push(actId);
                }
            });

            setAtividadesConcluidas(prev => {
                const combined = [...new Set([...prev, ...concluidasRecuperadas])];
                return combined;
            });
        }
    }, [moduleData, currentSection]);

    // Cálculo da Barra removendo dependência da prop externa
    useEffect(() => {
        let novaPorcentagem = 0; // Começa assumindo 0

        const baseAtividades = 20;
        const bonusPorAtividade = atividadesConcluidas.length * 10;
        const totalAtividades = baseAtividades + bonusPorAtividade;

        if (currentSection === 'teoria') {
            if (atividadesConcluidas.length > 0) {
                // Se já tem atividades feitas (F5 ou voltou da tela de atividades), mostra o progresso
                novaPorcentagem = totalAtividades;
            } else {
                // Se é a primeira vez ou resetou, garante 0%
                novaPorcentagem = 0;
            }
        } else if (currentSection === 'atividades-interativas') {
            // Garante no mínimo 20% ao entrar nas atividades
            novaPorcentagem = Math.max(20, totalAtividades);
        } else if (currentSection === 'quiz') {
            // No quiz, assumimos pelo menos 50% (Teoria + 3 Atividades)
            // Mantemos o maior valor caso o usuário já tenha respondido perguntas
            novaPorcentagem = Math.max(percent, 50);
        } else if (currentSection === 'conclusao') {
            novaPorcentagem = 100;
        }

        if (novaPorcentagem !== percent) {
            setPercent(novaPorcentagem);
            onProgressUpdate(novaPorcentagem);
        }
    }, [atividadesConcluidas, currentSection]);

    // Chave única para o scroll deste módulo específico
    const scrollKey = `module_${moduleData.id}_scroll_teoria`;

    // 1. Restaurar Scroll (apenas se estiver na teoria)
    useEffect(() => {
        if (currentSection === 'teoria') {
            const savedScroll = sessionStorage.getItem(scrollKey);
            if (savedScroll) {
                // Pequeno timeout para garantir que o DOM renderizou
                setTimeout(() => window.scrollTo(0, parseInt(savedScroll)), 0);
            } else {
                window.scrollTo(0, 0);
            }
        } else {
            // Se mudou para atividades, quiz ou conclusão, vai para o topo
            window.scrollTo(0, 0);
        }
    }, [currentSection, moduleData.id]);

    // 2. Salvar Scroll (apenas na teoria)
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50); // Sua lógica visual existente

            // Só salva se estiver lendo a teoria
            if (currentSection === 'teoria') {
                sessionStorage.setItem(scrollKey, window.scrollY);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [currentSection, moduleData.id]);

    // =====================================================================
    // NOVO: Gerenciamento Inteligente do Scroll (Persistência no F5)
    // =====================================================================

    // 1. Restaurar scroll ao montar ou mudar de seção
    useEffect(() => {
        const storageKey = `module_scroll_${moduleData.id}`;
        const savedData = JSON.parse(sessionStorage.getItem(storageKey) || '{}');

        // Se a seção salva for a mesma da atual, significa que é um F5 (ou recarregamento)
        if (savedData.section === currentSection) {
            // Restaura a posição
            setTimeout(() => {
                window.scrollTo(0, savedData.scroll || 0);
            }, 0);
        } else {
            // Se mudou de seção (ex: Teoria -> Atividades), vai para o topo
            window.scrollTo(0, 0);
        }
    }, [currentSection, moduleData.id]);

    // 2. Salvar scroll enquanto o usuário navega
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);

            // Salva a posição atual atrelada à seção e ao módulo
            const storageKey = `module_scroll_${moduleData.id}`;
            sessionStorage.setItem(storageKey, JSON.stringify({
                section: currentSection,
                scroll: window.scrollY
            }));
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [currentSection, moduleData.id]);
    // =====================================================================

    const limparDadosAtividades = () => {
        const chavesParaRemover = [
            // MÓDULO 1:
            // Atividade Planejar Mochila
            "mod1_mochila_progresso", "mod1_mochila_concluido",

            // Atividade Montar Carro
            "mod1_carro_progresso", "mod1_carro_concluido",

            // Atividade Quebra-Cabeça Digital
            "mod1_puzzle_etapa", "mod1_puzzle_categorizadas", "mod1_puzzle_montagem", "mod1_puzzle_concluido",

            // MÓDULO 2:
            // Atividade Padrão Sequências
            "mod2_sequencia_desafio", "mod2_sequencia_acertos", "mod2_sequencia_tentativas", "mod2_sequencia_concluido", "mod2_sequencia_resposta", "mod2_sequencia_feedback", "mod2_sequencia_opcoes",

            // Atividade Detetive Objetos
            "mod2_detetive_desafio", "mod2_detetive_colocados", "mod2_detetive_concluido", "mod2_detetive_acertos",

            // Atividade Padrão Secreto
            "mod2_padrao_desafio", "mod2_padrao_acertos", "mod2_padrao_tentativas", "mod2_padrao_concluido",
            "mod2_padrao_resposta", "mod2_padrao_feedback", "mod2_padrao_opcoes",

            //MÓDULO 3:
            // Atividade Mapa do Bairro
            "mod3_mapa_colocados", "mod3_mapa_concluido", "mod3_mapa_tentativas", "mod3_mapa_embaralhado",

            // Atividade Atributos Essenciais
            "mod3_atributos_desafio", "mod3_atributos_acertos", "mod3_atributos_concluido",
            "mod3_atributos_selecionados", "mod3_atributos_verificado", "mod3_atributos_feedback",
            "mod3_atributos_opcoes",

            // Atividade Cara-Cara Game
            "mod3_caracara_secreto", "mod3_caracara_visiveis", "mod3_caracara_grid", "mod3_caracara_historico", "mod3_caracara_venceu", "mod3_caracara_concluido", "mod3_caracara_pergunta_selecionada", "mod3_caracara_feedback",

            // MÓDULO 4:
            // Atividade Robô Sequências
            "mod4_sequencia_nivel", "mod4_sequencia_algoritmo", "mod4_sequencia_niveis_completos", "mod4_sequencia_concluido", "mod4_sequencia_robo_pos", "mod4_sequencia_feedback", "mod4_sequencia_expressao",

            // Atividade Robô Condições
            "mod4_condicoes_nivel", "mod4_condicoes_algoritmo", "mod4_condicoes_niveis_completos", "mod4_condicoes_concluido", "mod4_condicoes_robo_pos", "mod4_condicoes_feedback",
            "mod4_condicoes_expressao", "mod4_condicoes_venceu",

            // Atividade Robô Repetições
            "mod4_repeticoes_nivel", "mod4_repeticoes_algoritmo", "mod4_repeticoes_niveis_completos", "mod4_repeticoes_concluido", "mod4_repeticoes_robo_pos", "mod4_repeticoes_feedback",
            "mod4_repeticoes_expressao", "mod4_repeticoes_venceu",

            // Adicione as chaves dos outros módulos aqui conforme criar a persistência neles

            // CHAVES DO QUIZ (Dinâmicas baseadas no ID do módulo atual)
            `mod${moduleData.id}_quiz_index`,
            `mod${moduleData.id}_quiz_score`,
            `mod${moduleData.id}_quiz_selected`,
            `mod${moduleData.id}_quiz_feedback`,
            `mod${moduleData.id}_quiz_finished`,
        ];
        chavesParaRemover.forEach(chave => localStorage.removeItem(chave));
    };

    const handleVoltarHome = () => {
        limparDadosAtividades();
        sessionStorage.removeItem(scrollKey);
        // Limpa também o scroll salvo ao sair do módulo
        sessionStorage.removeItem(`module_scroll_${moduleData.id}`);
        navigate('/home/modulos');
    };

    const atualizarProgresso = (novoPercent) => {
        const valor = Math.min(Math.max(novoPercent, 0), 100);
        setPercent(valor);
        onProgressUpdate(valor);
    };

    // Teoria concluída = 20%
    const handleTeoriaConcluida = () => {
        atualizarProgresso(20);
        sessionStorage.removeItem(scrollKey);
        onNavigateToSection('atividades-interativas');
    };

    const handleExercicioConcluido = (atividadeId) => {
        setAtividadesConcluidas((prev) => {
            if (prev.includes(atividadeId)) return prev;
            return [...prev, atividadeId];
        });
    };

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
        limparDadosAtividades();
        sessionStorage.removeItem(scrollKey);
        // Limpa o scroll ao reiniciar
        sessionStorage.removeItem(`module_scroll_${moduleData.id}`);
        onReset && onReset(moduleData.id);
        setPercent(0);
        setAtividadesConcluidas([]);
        onNavigateToSection('teoria');
    };

    // Ao avançar para o próximo módulo
    const handleAvancarModulo = () => {
        limparDadosAtividades();
        sessionStorage.removeItem(scrollKey);
        // Limpa o scroll ao avançar
        sessionStorage.removeItem(`module_scroll_${moduleData.id}`);
        onAdvance(moduleData.id + 1);
        window.scrollTo({ top: 0 });
    };

    const renderAtividade = (atividadeId, key) => {
        const onFinish = () => handleExercicioConcluido(atividadeId);

        switch (atividadeId) {
            case "mochila": return <PlanBackpack key={key} onConcluido={onFinish} />;
            case "carro": return <AssembleCar key={key} onConcluido={onFinish} />;
            case "puzzle": return <DigitalPuzzle key={key} onConcluido={onFinish} />;
            case "completeSequencias": return <PadraoSequencia key={key} onConcluido={onFinish} />;
            case "detetiveObjetos": return <DetetiveObjetos key={key} onConcluido={onFinish} />;
            case "padraoSecreto": return <DescobrindoPadrão key={key} onConcluido={onFinish} />;
            case "mapaBairro": return <MapaBairro key={key} onConcluido={onFinish} />;
            case "atributosEssenciais": return <AtributosEssenciais key={key} onConcluido={onFinish} />;
            case "caraCara": return <CaraCaraGame key={key} onConcluido={onFinish} />;
            case "roboSequencias": return <RoboSequencias key={key} onConcluido={onFinish} />;
            case "roboCondicoes": return <RoboCondicoes key={key} onConcluido={onFinish} />;
            case "roboRepeticoes": return <RoboRepeticoes key={key} onConcluido={onFinish} />;
            default: return <p key={key}>Atividade '{atividadeId}' não encontrada.</p>;
        }
    };

    const todasAtividadesConcluidas = atividadesConcluidas.length >= (moduleData.atividades?.length || 0);

    return (
        <div className="module">
            <div className={`progress-container ${isScrolled ? "scrolled" : ""} ${telaAtual === 4 ? "conclusion-screen" : ""}`}>
                <ProgressBar progress={percent} />
            </div>

            {/* TELA 1: TEORIA */}
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
                                <ul>{moduleData.teoria.exemploPrincipal.subproblemas.map((sub, i) => <p key={i}>{sub}</p>)}</ul>
                                <p><strong>{moduleData.teoria.exemploPrincipal.conclusao}</strong></p>
                            </div>
                        )}

                        {/* ----- CONTEÚDO EXTRA EXCLUSIVO DO MÓDULO 4 ----- */}
                        {moduleData.id === 4 && (
                            <div className="alg-section">
                                <p>Mas para criar algoritmos que resolvam problemas da vida real, precisamos de <strong>3 blocos de construção mágicos:</strong></p>
                                <div className="alg-cards-container">
                                    {[
                                        { id: 1, icon: "🔢", title: "Sequências", desc: "A ordem exata dos passos é essencial!", back: "1️⃣ Pegar a meia → 2️⃣ Calçar a meia. A ordem importa!" },
                                        { id: 2, icon: "🔀", title: "Seleções (Condições)", desc: "Permitem fazer escolhas no algoritmo.", back: "SE o sinal estiver verde, ENTÃO atravesse; SENÃO, espere." },
                                        { id: 3, icon: "🔁", title: "Repetições (Laços)", desc: "Permitem executar algo várias vezes.", back: "ENQUANTO o prato não estiver limpo, FAÇA: continue lavando." }
                                    ].map((card) => {
                                        const [flipped, setFlipped] = useState(false);
                                        return (
                                            <div key={card.id} className={`alg-card ${flipped ? "flipped" : ""}`} onClick={() => setFlipped(!flipped)}>
                                                <div className="alg-card-inner">
                                                    <div className="alg-card-front"><div className="alg-icon">{card.icon}</div><h4>{card.title}</h4><p>{card.desc}</p></div>
                                                    <div className="alg-card-back"><h4>Exemplo:</h4><p>{card.back}</p></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <p style={{ marginTop: "2rem", textAlign: "center" }}>💡 Com esses três blocos, você pode construir a solução para quase qualquer problema!</p>
                            </div>
                        )}
                    </section>

                    {moduleData.teoria.exemplosReais && (
                        <section className="exemplos-container">
                            <h3>{moduleData.teoria.exemplosReais.titulo}</h3>
                            <div className="cards-exemplo">
                                {moduleData.teoria.exemplosReais.itens.map((ex, i) => (
                                    <div className="card-exemplo" key={i}><h4>{ex.titulo}</h4><p>{ex.desc}</p></div>
                                ))}
                            </div>
                        </section>
                    )}

                    <footer className="module-footer module-footer-fixed">
                        <button className="btn btn-icon" onClick={handleVoltarHome} aria-label="Voltar ao Menu de Módulos">
                            <svg className="icon-voltar" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path></svg>
                        </button>
                        <button className="btn start" onClick={handleTeoriaConcluida}>
                            Continuar
                            <svg className="icon-avancar" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path></svg>
                        </button>
                    </footer>
                </div>
            )}

            {/* TELA 2: ATIVIDADES */}
            {telaAtual === 2 && (
                <div className="tela-conteudo">
                    <header className="module-header">
                        <h1>🧩 Atividades Interativas: {moduleData.nameModule} </h1>
                    </header>

                    {moduleData.atividades?.map((atividadeId, index) => renderAtividade(atividadeId, index))}

                    <footer className="module-footer module-footer-fixed">
                        <button className="btn btn-icon" onClick={() => onNavigateToSection('teoria')} aria-label="Voltar">
                            <svg viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"></path></svg>
                        </button>
                        <button className="btn btn-icon" onClick={handleVoltarHome} aria-label="Voltar ao Menu de Módulos">
                            <svg className="icon-voltar" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path></svg>
                        </button>

                        {todasAtividadesConcluidas && (
                            <button className="btn start" onClick={() => { atualizarProgresso(50); onNavigateToSection('quiz'); }}>
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
                        moduleId={moduleData.id} 
                        onQuizComplete={handleQuizComplete}
                        onQuestionAnswered={handleQuestionAnswered}
                    />
                    <footer className="module-footer quiz-footer module-footer-fixed">
                        <button className="btn btn-icon" onClick={() => onNavigateToSection('atividades-interativas')} aria-label="Voltar para Atividades">
                            <svg viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"></path></svg>
                        </button>
                        <button className="btn btn-icon" onClick={handleVoltarHome} aria-label="Voltar ao Menu de Módulos">
                            <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path></svg>
                        </button>
                    </footer>
                </div>
            )}

            {/* TELA 4: CONCLUSÃO */}
            {telaAtual === 4 && (
                <div className="tela-conteudo">
                    <Confetti />
                    <div className="conclusao-container">
                        <h1>PARABÉNS!</h1>
                        <div className="premios-container">
                            <div className="premio-wrapper trophy"><span className="premio-img" style={{ fontSize: '5rem', display: 'block' }}>🏆</span></div>
                            <div className="premio-wrapper medal"><span className="premio-img" style={{ fontSize: '5rem', display: 'block' }}>🏅</span></div>
                        </div>
                        <p className="subtitulo">Você concluiu: {moduleData.title}. ✅</p>
                        <p className="final-message">{moduleData.finalMessage || "Parabéns! Você concluiu o módulo com sucesso!"}</p>
                        <footer className="module-footer conclusao-botoes">
                            <button className="btn btn-icon btn-home" onClick={handleVoltarHome} aria-label="Voltar ao Menu de Módulos">
                                <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path></svg>
                            </button>
                            <button className="btn btn-icon btn-refazer" onClick={handleReiniciar} aria-label="Reiniciar Módulo">
                                <svg viewBox="0 0 24 24"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"></path></svg>
                            </button>
                            <button className="btn btn-icon btn-avancar" onClick={handleAvancarModulo} aria-label="Avançar para o Próximo Módulo">
                                <svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path></svg>
                            </button>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
}
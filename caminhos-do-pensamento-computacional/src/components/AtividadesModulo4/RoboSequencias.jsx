import React, { useState, useRef, useEffect } from 'react';
import { useLocalStorage } from "../../hooks/useLocalStorage";
import './RoboSequencias.css';

// Componente do Robô em SVG - COM EXPRESSÕES
function RoboSVG({ expressao = 'feliz' }) {
    return (
        <g>
            {/* Corpo e Cabeça */}
            <rect x="-18" y="-22" width="36" height="44" fill="#2563eb" rx="6" />
            <rect x="-16" y="-20" width="32" height="40" fill="#3b82f6" rx="5" />
            <ellipse cx="0" cy="-32" rx="15" ry="12" fill="#60a5fa" />
            
            {/* Olhos e Boca baseados na expressão */}
            {expressao === 'triste' ? (
                <>
                    {/* Olhos em X */}
                    <line x1="-8" y1="-34" x2="-4" y2="-30" stroke="#1e293b" strokeWidth="1.5" />
                    <line x1="-8" y1="-30" x2="-4" y2="-34" stroke="#1e293b" strokeWidth="1.5" />
                    <line x1="4" y1="-34" x2="8" y2="-30" stroke="#1e293b" strokeWidth="1.5" />
                    <line x1="4" y1="-30" x2="8" y2="-34" stroke="#1e293b" strokeWidth="1.5" />
                    {/* Boca Triste */}
                    <path d="M -6 -24 Q 0 -30 6 -24" stroke="#1e293b" strokeWidth="1.5" fill="none" />
                </>
            ) : (
                <>
                    {/* Olhos Normais */}
                    <circle cx="-6" cy="-32" r="4" fill="white" />
                    <circle cx="6" cy="-32" r="4" fill="white" />
                    <circle cx="-6" cy="-32" r="2" fill="#1e293b" />
                    <circle cx="6" cy="-32" r="2" fill="#1e293b" />
                    {/* Boca Feliz */}
                    <path d="M -6 -26 Q 0 -22 6 -26" stroke="#1e293b" strokeWidth="1.5" fill="none" />
                </>
            )}

            {/* Antena e Detalhes */}
            <line x1="0" y1="-40" x2="0" y2="-48" stroke="#1e293b" strokeWidth="2" />
            <circle cx="0" cy="-48" r="3" fill="#ef4444" />
            <rect x="-22" y="-12" width="4" height="18" fill="#3b82f6" rx="2" />
            <rect x="18" y="-12" width="4" height="18" fill="#3b82f6" rx="2" />
            <circle cx="0" cy="-8" r="4" fill="#1e40af" />
            <rect x="-10" y="0" width="20" height="2" fill="#1e40af" rx="1" />
            <rect x="-10" y="6" width="20" height="2" fill="#1e40af" rx="1" />
            <rect x="-12" y="22" width="8" height="12" fill="#1e40af" rx="2" />
            <rect x="4" y="22" width="8" height="12" fill="#1e40af" rx="2" />
        </g>
    );
}

// Bandeira com animação
function BandeiraSVG({ animando }) {
    return (
        <g className={animando ? 'bandeira-vitoria' : ''}>
            <rect x="-2" y="-35" width="4" height="65" fill="#78350f" />
            <path d="M 2,-30 Q 25,-25 25,-15 Q 25,-5 2,-10 Z" fill="#ef4444" />
            <path d="M 2,-30 Q 25,-25 25,-15 Q 25,-5 2,-10 Z" fill="none" stroke="#991b1b" strokeWidth="1.5" />
        </g>
    );
}

// Comandos - Movimentos em 2D
const COMANDOS = [
    { id: 'direita', nome: 'Direita', icone: '➡️', cor: '#3b82f6' },
    { id: 'baixo', nome: 'Baixo', icone: '⬇️', cor: '#10b981' },
    { id: 'cima', nome: 'Cima', icone: '⬆️', cor: '#ffa200ff' },
    { id: 'esquerda', nome: 'Esquerda', icone: '⬅️', cor: '#ec4899' },
];

// Níveis do jogo
const NIVEIS = [
    {
        id: 1,
        titulo: 'Desafio 1: Caminho Reto',
        grade: 5,
        roboInicio: { x: 0, y: 2 },
        bandeiraPos: { x: 4, y: 2 },
        dica: 'O caminho é uma linha reta! Use o comando de Direita quantas vezes for preciso.'
    },
    {
        id: 2,
        titulo: 'Desafio 2: Uma Curva',
        grade: 5,
        roboInicio: { x: 0, y: 4 },
        bandeiraPos: { x: 4, y: 0 },
        dica: 'Primeiro ande tudo para a Direita, depois suba tudo para Cima.'
    },
    {
        id: 3,
        titulo: 'Desafio 3: Zigue-Zague',
        grade: 5,
        roboInicio: { x: 0, y: 2 },
        bandeiraPos: { x: 4, y: 4 },
        dica: 'Você vai precisar descer e ir para a direita, como uma escada!'
    }
];

export default function RoboSequencias({ onConcluido }) {
    // ESTADOS PERSISTENTES (Lógica + Visual)
    const [nivelAtual, setNivelAtual] = useLocalStorage("mod4_sequencia_nivel", 0);
    const [algoritmo, setAlgoritmo] = useLocalStorage("mod4_sequencia_algoritmo", []);
    const [niveisCompletos, setNiveisCompletos] = useLocalStorage("mod4_sequencia_niveis_completos", []);
    const [concluidoGeral, setConcluidoGeral] = useLocalStorage("mod4_sequencia_concluido", false);

    // Inicializa nível para uso
    const nivel = NIVEIS[nivelAtual] || NIVEIS[0]; 

    // Estados Visuais PERSISTIDOS
    const [roboPos, setRoboPos] = useLocalStorage("mod4_sequencia_robo_pos", { x: nivel.roboInicio.x, y: nivel.roboInicio.y });
    const [feedback, setFeedback] = useLocalStorage("mod4_sequencia_feedback", '');
    const [expressaoRobo, setExpressaoRobo] = useLocalStorage("mod4_sequencia_expressao", 'feliz');
    // MUDANÇA: Agora 'venceu' é persistido para mostrar o botão 'Próximo' no F5
    const [venceu, setVenceu] = useLocalStorage("mod4_sequencia_venceu", false);
    
    // Estados visuais temporários (Resetam com F5)
    const [executando, setExecutando] = useState(false);
    const [mostrarDica, setMostrarDica] = useState(false);
    const [bandeiraAnimando, setBandeiraAnimando] = useState(false);
    const [draggedItem, setDraggedItem] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [comandoAtivo, setComandoAtivo] = useState(null);

    // Referência direta para o elemento do robô
    const roboRef = useRef(null);

    // Ref para rastrear mudança real de nível
    const prevNivelRef = useRef(nivelAtual);

    useEffect(() => {
        // Se o nível mudou, reseta tudo para o padrão do novo nível
        if (prevNivelRef.current !== nivelAtual) {
            if (!executando) {
                setRoboPos({ x: nivel.roboInicio.x, y: nivel.roboInicio.y });
                setVenceu(false);
                setFeedback('');
                setExpressaoRobo('feliz');
            }
            prevNivelRef.current = nivelAtual;
        }
        // Se for a mesma montagem (F5), mantém os valores carregados do useLocalStorage
    }, [nivelAtual, executando, nivel.roboInicio.x, nivel.roboInicio.y, setRoboPos, setFeedback, setExpressaoRobo, setVenceu]); 

    // Efeito para notificar o pai se já terminou tudo
    useEffect(() => {
        if (concluidoGeral) {
            onConcluido?.();
        }
    }, [concluidoGeral, onConcluido]);

    const resetar = () => {
        setRoboPos({ x: nivel.roboInicio.x, y: nivel.roboInicio.y });
        setVenceu(false);
        setFeedback('');
        setBandeiraAnimando(false);
        setComandoAtivo(null);
        setExpressaoRobo('feliz');
        
        // Remove classe de tremor se existir (usando ref)
        if (roboRef.current) {
            roboRef.current.classList.remove('tremendo');
        }
    };

    const adicionarComando = (comandoId) => {
        if (algoritmo.length < 15) {
            setAlgoritmo([...algoritmo, comandoId]);
        }
    };

    const removerComando = (index) => {
        setAlgoritmo(algoritmo.filter((_, i) => i !== index));
    };

    const limpar = () => {
        setAlgoritmo([]);
        resetar();
    };

    // Calcula posição sem mover (para validação)
    const calcularNovaPosicao = (pos, cmd) => {
        const { x, y } = pos;
        let nx = x, ny = y;

        if (cmd === 'direita') nx = x + 1;
        else if (cmd === 'esquerda') nx = x - 1;
        else if (cmd === 'baixo') ny = y + 1;
        else if (cmd === 'cima') ny = y - 1;

        return { x: nx, y: ny };
    };

    // Verifica se saiu dos limites
    const isForaDoMapa = (p) => {
        return p.x < 0 || p.x >= nivel.grade || p.y < 0 || p.y >= nivel.grade;
    };

    // Função para tratar a colisão (animação)
    const tratarSaidaTabuleiro = async () => {
        setExpressaoRobo('triste');
        setFeedback('💥 Ops! O robô saiu do tabuleiro!');
        
        if (roboRef.current) {
            // Pequeno delay para garantir renderização da expressão
            await new Promise(r => setTimeout(r, 50));
            roboRef.current.classList.add('tremendo');
            await new Promise(r => setTimeout(r, 600));
            if (roboRef.current) roboRef.current.classList.remove('tremendo');
        }
    };

    // --- FUNÇÃO DE SCROLL LOCAL CORRIGIDA ---
    const scrollToElement = (id) => {
        const element = document.getElementById(id);
        if (!element) return;

        // Encontra o container rolável mais próximo (no caso, .algoritmo-mini)
        const container = element.closest('.algoritmo-mini');

        if (container) {
            // Calcula a posição para centralizar o elemento no container
            const elementRect = element.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const offset = elementRect.top - containerRect.top;
            const targetScroll = container.scrollTop + offset - (container.clientHeight / 2) + (elementRect.height / 2);
            container.scrollTo({ top: targetScroll, behavior: 'smooth' });
        }
    };

    const executar = async () => {
        // Reset inicial para começar da base
        resetar();
        await new Promise(r => setTimeout(r, 400)); 
        
        setExecutando(true);
        setFeedback('');
        setComandoAtivo(null);
        setExpressaoRobo('feliz');
        let pos = { x: nivel.roboInicio.x, y: nivel.roboInicio.y };

        for (let i = 0; i < algoritmo.length; i++) {
            const cmd = algoritmo[i];
            setComandoAtivo(i);
            
            // Chama o scroll apenas para o container do algoritmo
            scrollToElement(`cmd-${i}`);
            
            // Pausa inicial para destacar o comando
            await new Promise(r => setTimeout(r, 600));
            
            const novaPos = calcularNovaPosicao(pos, cmd);
            
            // Verifica se saiu do mapa
            if (isForaDoMapa(novaPos)) {
                setRoboPos(novaPos); // Move para fora visualmente
                await new Promise(r => setTimeout(r, 600));
                
                // 3. Executa o tremor e o feedback
                await tratarSaidaTabuleiro();
                
                setExecutando(false);
                setComandoAtivo(null);
                return; // Sai da função, mantendo o robô "fora" e triste
            }
            
            // Move visualmente (dentro do tabuleiro)
            pos = novaPos;
            setRoboPos(pos);
            
            // Tempo do movimento
            await new Promise(r => setTimeout(r, 600));
            
            // Pausa entre comandos
            await new Promise(r => setTimeout(r, 300));
        }

        setComandoAtivo(null);
        
        if (pos.x === nivel.bandeiraPos.x && pos.y === nivel.bandeiraPos.y) {
            setBandeiraAnimando(true);
            await new Promise(r => setTimeout(r, 1500));
            setVenceu(true);
            setFeedback('🎉 Aê, Muito bem! Você fez a sequência de passos (algoritmo) correta e o robô chegou na bandeira!');
            
            let novosNiveisCompletos = niveisCompletos;
            if (!niveisCompletos.includes(nivelAtual)) {
                novosNiveisCompletos = [...niveisCompletos, nivelAtual];
                setNiveisCompletos(novosNiveisCompletos);
            }

            if (nivelAtual === NIVEIS.length - 1 && novosNiveisCompletos.length === NIVEIS.length) {
                setConcluidoGeral(true);
                setTimeout(() => onConcluido && onConcluido(), 2000);
            }
        } else {
            // LÓGICA MANTIDA: Se não chegou, fica triste ONDE PAROU.
            setExpressaoRobo('triste');
            setFeedback('❌ Ops! O robô não chegou na bandeira. Tente arrumar os passos!');
        }

        setExecutando(false);
    };

    const proximo = () => {
        if (nivelAtual < NIVEIS.length - 1) {
            const prox = nivelAtual + 1;
            setNivelAtual(prox);
            setAlgoritmo([]); // Limpa o algoritmo para o novo nível
            
            // O useEffect [nivelAtual] cuidará de resetar a posição visualmente
            setVenceu(false);
            setFeedback('');
            setMostrarDica(false);
            setBandeiraAnimando(false);
            setExpressaoRobo('feliz');
        }
    };

    // Drag and Drop
    const handleDragStart = (e, item, index = null) => {
        setDraggedItem({ item, fromIndex: index });
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        setDragOverIndex(index);
    };

    const handleDrop = (e, dropIndex = null) => {
        e.preventDefault();
        if (!draggedItem) return;

        if (draggedItem.fromIndex === null) {
            if (dropIndex === null) {
                if (algoritmo.length < 15) setAlgoritmo([...algoritmo, draggedItem.item]);
            } else {
                if (algoritmo.length < 15) {
                    const novo = [...algoritmo];
                    novo.splice(dropIndex, 0, draggedItem.item);
                    setAlgoritmo(novo);
                }
            }
        } else {
            if (dropIndex !== null && dropIndex !== draggedItem.fromIndex) {
                const novo = [...algoritmo];
                const [removed] = novo.splice(draggedItem.fromIndex, 1);
                novo.splice(dropIndex, 0, removed);
                setAlgoritmo(novo);
            }
        }
        setDraggedItem(null);
        setDragOverIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
        setDragOverIndex(null);
    };

    return (
        <div className="robo-sequencias-container">
            <h2 className="robo-title">🤖 Robô com Sequências</h2>
            <p className="robo-subtitle">
                Ajude o robô a pegar a bandeira! Crie uma <strong>sequência</strong> de comandos para ele seguir.
                <br /><strong>Lembre-se:</strong> A ordem dos passos é muito importante!
            </p>

            {/* Níveis */}
            <div className="nivel-selector">
                {NIVEIS.map((n, i) => (
                    <button
                        key={n.id}
                        className={`nivel-btn ${i === nivelAtual ? 'ativo' : ''} ${niveisCompletos.includes(i) ? 'completo' : ''}`}
                        onClick={() => {
                            setNivelAtual(i);
                            setAlgoritmo([]);
                            // O useEffect cuidará do reset visual
                        }}
                        disabled={executando}
                    >
                        {niveisCompletos.includes(i) && '✓ '}
                        Desafio {n.id}
                    </button>
                ))}
            </div>

            <div className="game-area">
                {/* Grade */}
                <div className="grade-wrapper">
                    <h4 className="subtitle">{nivel.titulo}</h4>
                    <svg width="320" height="320" viewBox="0 0 400 400" className="grade-svg">
                        {Array.from({ length: nivel.grade }).map((_, row) =>
                            Array.from({ length: nivel.grade }).map((_, col) => (
                                <rect
                                    key={`${row}-${col}`}
                                    x={col * 80} y={row * 80}
                                    width={78} height={78}
                                    fill={row % 2 === col % 2 ? '#e0f2fe' : '#bae6fd'}
                                    stroke="#0ea5e9" strokeWidth="2"
                                />
                            ))
                        )}

                        {/* Grupo Pai move, Grupo Filho anima com REF */}
                        <g 
                            transform={`translate(${roboPos.x * 80 + 40}, ${roboPos.y * 80 + 40})`} 
                            className="robo-movimento"
                        >
                            <g ref={roboRef} className="robo-animado">
                                <RoboSVG expressao={expressaoRobo} />
                            </g>
                        </g>

                        <g transform={`translate(${nivel.bandeiraPos.x * 80 + 40}, ${nivel.bandeiraPos.y * 80 + 40})`} style={{ zIndex: bandeiraAnimando ? 10 : 1 }}>
                            <BandeiraSVG animando={bandeiraAnimando} />
                        </g>
                    </svg>

                    {mostrarDica && (
                        <div className="dica-box">
                            <strong>💡 Dica:</strong> {nivel.dica}
                        </div>
                    )}
                    <button className="btn-dica" onClick={() => setMostrarDica(!mostrarDica)}>
                        {mostrarDica ? '🙈 Esconder' : '💡 Ver Dica'}
                    </button>

                    {/* Feedback ajustado para priorizar erro se houver texto de erro */}
                    {feedback && (
                        <div className={`feedback ${venceu ? 'sucesso' : (feedback.includes('saiu do tabuleiro') || feedback.includes('não chegou') ? 'erro' : '')}`}>
                            {feedback}
                        </div>
                    )}
                </div>

                {/* Painel de Controle */}
                <div className="control-panel">
                    <div className="comandos-section">
                        <h4 className="subtitle">Comandos:</h4>
                        <div className="comandos-mini">
                            {COMANDOS.map(c => (
                                <button
                                    key={c.id}
                                    className="cmd-mini"
                                    style={{ background: c.cor }}
                                    onClick={() => adicionarComando(c.id)}
                                    disabled={executando || algoritmo.length >= 15}
                                    title={c.nome}
                                    draggable={!executando && algoritmo.length < 15}
                                    onDragStart={(e) => handleDragStart(e, c.id)}
                                >
                                    {c.icone}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="algoritmo-section">
                        <div className="algo-header">
                            <h4 className="subtitle">Seu Algoritmo ({algoritmo.length}/15):</h4>
                            {algoritmo.length > 0 && (
                                <button className="btn-limpar-mini" onClick={limpar} disabled={executando}>
                                    🗑️
                                </button>
                            )}
                        </div>
                        <div
                            className="algoritmo-mini"
                            onDragOver={(e) => handleDragOver(e, null)}
                            onDrop={(e) => handleDrop(e, null)}
                        >
                            {algoritmo.length === 0 ? (
                                <div className="algo-vazio">Arraste os comandos para cá...</div>
                            ) : (
                                algoritmo.map((cmdId, i) => {
                                    const cmd = COMANDOS.find(c => c.id === cmdId);
                                    return (
                                        <div
                                            key={i}
                                            id={`cmd-${i}`}
                                            className={`algo-item ${dragOverIndex === i ? 'drag-over' : ''} ${comandoAtivo === i ? 'comando-ativo' : ''}`}
                                            draggable={!executando}
                                            onDragStart={(e) => handleDragStart(e, cmdId, i)}
                                            onDragOver={(e) => handleDragOver(e, i)}
                                            onDrop={(e) => handleDrop(e, i)}
                                            onDragEnd={handleDragEnd}
                                        >
                                            <div className="cmd-item" style={{ background: cmd.cor }}>
                                                <span className="cmd-numero">{i + 1}</span>
                                                <span className="cmd-content">
                                                    <span className="cmd-icone-item">{cmd.icone}</span>
                                                    <span className="cmd-nome">{cmd.nome}</span>
                                                </span>
                                                <button className="btn-x" onClick={() => removerComando(i)} disabled={executando}>✕</button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <div className="botoes-acao">
                        <button className="btn btn-exec" onClick={executar} disabled={executando || algoritmo.length === 0}>
                            {executando ? '⏳' : '▶️'} Executar
                        </button>
                        <button className="btn btn-reset" onClick={resetar} disabled={executando}>
                            🔄 Resetar
                        </button>
                        {venceu && nivelAtual < NIVEIS.length - 1 && (
                            <button className="btn btn-prox" onClick={proximo}>
                                ➡️ Próximo
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {niveisCompletos.length === NIVEIS.length && (
                <div className="conclusao">
                    <h3>🏆 Parabéns! Você completou todos os desafios!</h3>
                    <p>
                        Você dominou as <strong>SEQUÊNCIAS</strong>! Você aprendeu que a ordem dos comandos
                        muda tudo o que o robô faz.
                    </p>
                    <div className="conceito-box">
                        <strong>💡 O que aprendemos:</strong>
                        <p>
                            <br></br>Uma <strong>SEQUÊNCIA</strong> é como uma fila de instruções. 
                            O computador (ou o robô) segue um passo de cada vez, na ordem certinha!
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
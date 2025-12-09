import React, { useState, useRef } from 'react';
import './RoboCondicoes.css';

// Componente do Robô em SVG
function RoboSVG({ expressao = 'feliz' }) {
    return (
        <g>
            {/* Corpo e Cabeça */}
            <rect x="-18" y="-22" width="36" height="44" fill="#2563eb" rx="6" />
            <rect x="-16" y="-20" width="32" height="40" fill="#3b82f6" rx="5" />
            <ellipse cx="0" cy="-32" rx="15" ry="12" fill="#60a5fa" />
            
            {/* Expressões */}
            {expressao === 'triste' ? (
                <>
                    <line x1="-8" y1="-34" x2="-4" y2="-30" stroke="#1e293b" strokeWidth="1.5" />
                    <line x1="-8" y1="-30" x2="-4" y2="-34" stroke="#1e293b" strokeWidth="1.5" />
                    <line x1="4" y1="-34" x2="8" y2="-30" stroke="#1e293b" strokeWidth="1.5" />
                    <line x1="4" y1="-30" x2="8" y2="-34" stroke="#1e293b" strokeWidth="1.5" />
                    <path d="M -6 -24 Q 0 -30 6 -24" stroke="#1e293b" strokeWidth="1.5" fill="none" />
                </>
            ) : (
                <>
                    <circle cx="-6" cy="-32" r="4" fill="white" />
                    <circle cx="6" cy="-32" r="4" fill="white" />
                    <circle cx="-6" cy="-32" r="2" fill="#1e293b" />
                    <circle cx="6" cy="-32" r="2" fill="#1e293b" />
                    <path d="M -6 -26 Q 0 -22 6 -26" stroke="#1e293b" strokeWidth="1.5" fill="none" />
                </>
            )}

            {/* Detalhes */}
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

function BandeiraSVG({ animando }) {
    return (
        <g className={animando ? 'bandeira-vitoria' : ''}>
            <rect x="-2" y="-35" width="4" height="65" fill="#78350f" />
            <path d="M 2,-30 Q 25,-25 25,-15 Q 25,-5 2,-10 Z" fill="#ef4444" />
            <path d="M 2,-30 Q 25,-25 25,-15 Q 25,-5 2,-10 Z" fill="none" stroke="#991b1b" strokeWidth="1.5" />
        </g>
    );
}

const COMANDOS = [
    { id: 'direita', nome: 'Direita', icone: '➡️', cor: '#3b82f6' },
    { id: 'baixo', nome: 'Baixo', icone: '⬇️', cor: '#10b981' },
    { id: 'cima', nome: 'Cima', icone: '⬆️', cor: '#f59e0b' },
    { id: 'esquerda', nome: 'Esquerda', icone: '⬅️', cor: '#ec4899' },
];

const NIVEIS = [
    {
        id: 1,
        titulo: 'Desafio 1: Desvie da Lama',
        grade: 5,
        roboInicio: { x: 0, y: 2 },
        bandeiraPos: { x: 4, y: 2 },
        lamas: [{ x: 2, y: 2 }],
        dica: 'O robô vai encontrar lama! Use o bloco SE/ENTÃO para ele desviar.'
    },
    {
        id: 2,
        titulo: 'Desafio 2: Desvie de Duas Lamas',
        grade: 5,
        roboInicio: { x: 0, y: 3 },
        bandeiraPos: { x: 4, y: 1 },
        lamas: [{ x: 1, y: 3 }, { x: 3, y: 2 }],
        dica: 'Tem lama duas vezes! Use o bloco SE/ENTÃO sempre que encontrar sujeira.'
    },
    {
        id: 3,
        titulo: 'Desafio 3: Labirinto de Lamas',
        grade: 5,
        roboInicio: { x: 0, y: 4 },
        bandeiraPos: { x: 4, y: 0 },
        lamas: [{ x: 1, y: 4 }, { x: 2, y: 3 }, { x: 3, y: 1 }],
        dica: 'O caminho é cheio de obstáculos! Use as condições com sabedoria.'
    }
];

export default function RoboCondicoes({ onConcluido }) {
    const [nivelAtual, setNivelAtual] = useState(0);
    const [algoritmo, setAlgoritmo] = useState([]);
    const [roboPos, setRoboPos] = useState({ x: NIVEIS[0].roboInicio.x, y: NIVEIS[0].roboInicio.y });
    const [executando, setExecutando] = useState(false);
    const [venceu, setVenceu] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [niveisCompletos, setNiveisCompletos] = useState([]);
    const [mostrarDica, setMostrarDica] = useState(false);
    const [bandeiraAnimando, setBandeiraAnimando] = useState(false);
    const [draggedItem, setDraggedItem] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [comandoAtivo, setComandoAtivo] = useState(null);
    const [blocoSeAtivo, setBlocoSeAtivo] = useState(null);
    const [comandoInternoAtivo, setComandoInternoAtivo] = useState(null);
    const [expressaoRobo, setExpressaoRobo] = useState('feliz');

    // REF: Referência direta para o elemento do robô na DOM
    const roboRef = useRef(null);

    const nivel = NIVEIS[nivelAtual];

    const resetar = () => {
        setRoboPos({ x: nivel.roboInicio.x, y: nivel.roboInicio.y });
        setVenceu(false);
        setFeedback('');
        setBandeiraAnimando(false);
        setComandoAtivo(null);
        setBlocoSeAtivo(null);
        setComandoInternoAtivo(null);
        setExpressaoRobo('feliz');
        
        if (roboRef.current) {
            roboRef.current.classList.remove('tremendo');
        }
    };

    const adicionarComando = (comandoId) => {
        if (algoritmo.length < 15) {
            setAlgoritmo([...algoritmo, { tipo: 'comando', id: comandoId }]);
        }
    };

    const adicionarBlocoSe = () => {
        if (algoritmo.length < 15) {
            setAlgoritmo([...algoritmo, { tipo: 'se', comandos: [] }]);
        }
    };

    const adicionarDentroSe = (indexBloco, comandoId) => {
        const novo = [...algoritmo];
        if (novo[indexBloco].comandos.length < 8) {
            novo[indexBloco].comandos.push(comandoId);
            setAlgoritmo(novo);
        }
    };

    const removerItem = (index) => {
        setAlgoritmo(algoritmo.filter((_, i) => i !== index));
    };

    const removerDentroSe = (indexBloco, indexCmd) => {
        const novo = [...algoritmo];
        novo[indexBloco].comandos = novo[indexBloco].comandos.filter((_, i) => i !== indexCmd);
        setAlgoritmo(novo);
    };

    const limpar = () => {
        setAlgoritmo([]);
        resetar();
    };

    const temLamaFrente = (x, y) => {
        const proxX = x + 1;
        return nivel.lamas.some(l => l.x === proxX && l.y === y);
    };

    const calcularNovaPosicao = (pos, cmd) => {
        const { x, y } = pos;
        let nx = x, ny = y;

        if (cmd === 'direita') nx = x + 1;
        else if (cmd === 'esquerda') nx = x - 1;
        else if (cmd === 'baixo') ny = y + 1;
        else if (cmd === 'cima') ny = y - 1;

        return { x: nx, y: ny };
    };

    const isForaDoMapa = (p) => {
        return p.x < 0 || p.x >= nivel.grade || p.y < 0 || p.y >= nivel.grade;
    };

    const checarColisaoLama = (p) => {
        return nivel.lamas.some(l => l.x === p.x && l.y === p.y);
    };

    // Função de animação corrigida usando REF
    const tratarSaidaTabuleiro = async () => {
        setExpressaoRobo('triste');
        setFeedback('💥 Ops! O robô saiu do tabuleiro!');
        
        // Usa a referência direta, não querySelector
        if (roboRef.current) {
            // Pequeno delay para garantir que o render da expressão ocorra antes da animação
            await new Promise(r => setTimeout(r, 50));
            roboRef.current.classList.add('tremendo');
            await new Promise(r => setTimeout(r, 600));
            if (roboRef.current) roboRef.current.classList.remove('tremendo');
        }
        
        setExecutando(false);
        setComandoAtivo(null);
        setBlocoSeAtivo(null);
        setComandoInternoAtivo(null);
    };

    const executar = async () => {
        resetar();
        await new Promise(r => setTimeout(r, 400)); // Tempo aumentado para garantir reset visual

        setExecutando(true);
        let pos = { x: nivel.roboInicio.x, y: nivel.roboInicio.y };

        for (let i = 0; i < algoritmo.length; i++) {
            const item = algoritmo[i];
            setComandoAtivo(i);
            
            await new Promise(r => setTimeout(r, 600));

            if (item.tipo === 'se') {
                const temLama = temLamaFrente(pos.x, pos.y);

                if (temLama) {
                    setBlocoSeAtivo(i);
                    for (let ci = 0; ci < item.comandos.length; ci++) {
                        const cmd = item.comandos[ci];
                        setComandoInternoAtivo(ci);
                        
                        await new Promise(r => setTimeout(r, 600));
                        
                        const novaPos = calcularNovaPosicao(pos, cmd);
                        
                        if (isForaDoMapa(novaPos)) {
                            setRoboPos(novaPos);
                            // Espera o tempo da transição CSS (0.6s) antes de tremer
                            await new Promise(r => setTimeout(r, 600)); 
                            await tratarSaidaTabuleiro();
                            return;
                        }

                        setRoboPos(novaPos);
                        await new Promise(r => setTimeout(r, 600)); // Espera movimento

                        if (checarColisaoLama(novaPos)) {
                            setExpressaoRobo('triste');
                            setFeedback('💥 Sujou! O robô pisou na lama!');
                            setExecutando(false);
                            return;
                        }
                        
                        pos = novaPos;
                        await new Promise(r => setTimeout(r, 300));
                    }
                    setComandoInternoAtivo(null);
                    setBlocoSeAtivo(null);
                }
            } else {
                const novaPos = calcularNovaPosicao(pos, item.id);
                
                if (isForaDoMapa(novaPos)) {
                    setRoboPos(novaPos);
                    // Espera o tempo da transição CSS (0.6s) antes de tremer
                    await new Promise(r => setTimeout(r, 600));
                    await tratarSaidaTabuleiro();
                    return;
                }

                setRoboPos(novaPos);
                await new Promise(r => setTimeout(r, 600));

                if (checarColisaoLama(novaPos)) {
                    setExpressaoRobo('triste');
                    setFeedback('💥 Sujou! O robô pisou na lama! Use o bloco SE/ENTÃO para desviar!');
                    setExecutando(false);
                    return;
                }
                
                pos = novaPos;
                await new Promise(r => setTimeout(r, 300));
            }
        }

        setComandoAtivo(null);
        setBlocoSeAtivo(null);
        setComandoInternoAtivo(null);
        await new Promise(r => setTimeout(r, 300));

        if (pos.x === nivel.bandeiraPos.x && pos.y === nivel.bandeiraPos.y) {
            setBandeiraAnimando(true);
            await new Promise(r => setTimeout(r, 2000));
            setVenceu(true);
            setFeedback('🎉 Isso aí! O robô desviou direitinho da lama e conseguiu chegar na bandeira!');
            if (!niveisCompletos.includes(nivelAtual)) {
                setNiveisCompletos([...niveisCompletos, nivelAtual]);
            }
            if (nivelAtual === NIVEIS.length - 1 && niveisCompletos.length === NIVEIS.length - 1) {
                setTimeout(() => onConcluido && onConcluido(), 2000);
            }
        } else {
            setExpressaoRobo('triste');
            setFeedback('❌ O robô não chegou na bandeira. Revise seu algoritmo e tente de novo!');
        }

        setExecutando(false);
    };

    const proximo = () => {
        if (nivelAtual < NIVEIS.length - 1) {
            const prox = nivelAtual + 1;
            setNivelAtual(prox);
            setAlgoritmo([]);
            setRoboPos({ x: NIVEIS[prox].roboInicio.x, y: NIVEIS[prox].roboInicio.y });
            setVenceu(false);
            setFeedback('');
            setMostrarDica(false);
            setBandeiraAnimando(false);
            setExpressaoRobo('feliz');
        }
    };

    const handleDragStart = (e, item, index = null, parentIndex = null) => {
        setDraggedItem({ item, fromIndex: index, fromParentIndex: parentIndex });
        e.dataTransfer.effectAllowed = 'move';
        e.stopPropagation();
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        setDragOverIndex(index);
    };

    const handleDrop = (e, dropIndex = null, dropParentIndex = null) => {
        e.preventDefault();
        e.stopPropagation();
        if (!draggedItem) return;

        const newAlgoritmo = JSON.parse(JSON.stringify(algoritmo));

        if (dropParentIndex !== null) {
            // Drop dentro de um SE
            const targetBlock = newAlgoritmo[dropParentIndex];
            if (draggedItem.fromParentIndex === dropParentIndex) {
                 // Move dentro do mesmo SE
                 if (draggedItem.fromIndex !== null && dropIndex !== null && dropIndex !== draggedItem.fromIndex) {
                     const [removed] = targetBlock.comandos.splice(draggedItem.fromIndex, 1);
                     targetBlock.comandos.splice(dropIndex, 0, removed);
                 }
            } else if (draggedItem.fromIndex === null) {
                 // Adiciona novo vindo da toolbar
                 if (targetBlock.comandos.length < 8) {
                    if (dropIndex === null) targetBlock.comandos.push(draggedItem.item.id);
                    else targetBlock.comandos.splice(dropIndex, 0, draggedItem.item.id);
                 }
            }
        } else {
            // Drop na raiz
            if (draggedItem.fromParentIndex === null) {
                if (draggedItem.fromIndex === null) {
                    if (newAlgoritmo.length < 15) {
                        if (dropIndex === null) newAlgoritmo.push(draggedItem.item);
                        else newAlgoritmo.splice(dropIndex, 0, draggedItem.item);
                    }
                } else if (dropIndex !== null && dropIndex !== draggedItem.fromIndex) {
                    const [removed] = newAlgoritmo.splice(draggedItem.fromIndex, 1);
                    newAlgoritmo.splice(dropIndex, 0, removed);
                }
            }
        }
        setAlgoritmo(newAlgoritmo);
        setDraggedItem(null);
        setDragOverIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
        setDragOverIndex(null);
    };

    return (
        <div className="robo-condicoes-container">
            <h2 className="robo-title">🤖 Robo com Condições (SE/ENTÃO)</h2>
            <p className="robo-subtitle">Ensine o robô a <strong>tomar decisões</strong>! Use o bloco <strong>SE/ENTÃO</strong> para ele saber o que fazer quando encontrar lama.</p>

            <div className="nivel-selector">
                {NIVEIS.map((n, i) => (
                    <button
                        key={n.id}
                        className={`nivel-btn ${i === nivelAtual ? 'ativo' : ''} ${niveisCompletos.includes(i) ? 'completo' : ''}`}
                        onClick={() => {
                            setNivelAtual(i);
                            setAlgoritmo([]);
                            setRoboPos({ x: NIVEIS[i].roboInicio.x, y: NIVEIS[i].roboInicio.y });
                            setVenceu(false);
                            setFeedback('');
                            setMostrarDica(false);
                            setBandeiraAnimando(false);
                            setExpressaoRobo('feliz');
                        }}
                        disabled={executando}
                    >
                        {niveisCompletos.includes(i) && '✓ '}
                        Desafio {n.id}
                    </button>
                ))}
            </div>

            <div className="game-area">
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

                        {nivel.lamas.map((lama, i) => (
                            <g key={i} transform={`translate(${lama.x * 80 + 40}, ${lama.y * 80 + 40})`}>
                                <ellipse cx="-8" cy="-5" rx="15" ry="12" fill="#78350f" />
                                <ellipse cx="10" cy="3" rx="12" ry="10" fill="#78350f" />
                                <ellipse cx="-3" cy="8" rx="10" ry="8" fill="#78350f" />
                            </g>
                        ))}

                        <g 
                            transform={`translate(${roboPos.x * 80 + 40}, ${roboPos.y * 80 + 40})`} 
                            className="robo-movimento"
                        >
                            {/* REF: Adicionada aqui para controle direto */}
                            <g ref={roboRef} className="robo-animado">
                                <RoboSVG expressao={expressaoRobo} />
                            </g>
                        </g>

                        <g transform={`translate(${nivel.bandeiraPos.x * 80 + 40}, ${nivel.bandeiraPos.y * 80 + 40})`}>
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

                    {feedback && (
                        <div className={`feedback ${venceu ? 'sucesso' : (feedback.includes('Ops') || feedback.includes('Sujou') || feedback.includes('não chegou') ? 'erro' : '')}`}>
                            {feedback}
                        </div>
                    )}
                </div>

                {/* Painel e Barra lateral (mantidos iguais) */}
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
                                    onDragStart={(e) => handleDragStart(e, { tipo: 'comando', id: c.id }, null, null)}
                                >
                                    {c.icone}
                                </button>
                            ))}
                            <button
                                className="cmd-mini se"
                                onClick={adicionarBlocoSe}
                                disabled={executando || algoritmo.length >= 15}
                                title="SE/ENTÃO"
                                draggable={!executando && algoritmo.length < 15}
                                onDragStart={(e) => handleDragStart(e, { tipo: 'se', comandos: [] }, null, null)}
                            >
                                🔀 SE, ENTÃO
                            </button>
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
                            onDrop={(e) => handleDrop(e, null, null)}
                        >
                            {algoritmo.length === 0 ? (
                                <div className="algo-vazio">Arraste ou clique nos comandos...</div>
                            ) : (
                                algoritmo.map((item, i) => (
                                    <div
                                        key={i}
                                        className={`algo-item ${dragOverIndex === i ? 'drag-over' : ''} ${comandoAtivo === i ? 'comando-ativo' : ''}`}
                                        draggable={!executando}
                                        onDragStart={(e) => handleDragStart(e, item, i, null)}
                                        onDragOver={(e) => handleDragOver(e, i)}
                                        onDrop={(e) => handleDrop(e, i, null)}
                                        onDragEnd={handleDragEnd}
                                    >
                                        {item.tipo === 'se' ? (
                                            <div className={`bloco-se ${blocoSeAtivo === i ? 'bloco-se-ativo' : ''}`}>
                                                <div className="se-header">
                                                    <span>🔀 SE tem lama, ENTÃO:</span>
                                                    <button className="btn-x" onClick={() => removerItem(i)} disabled={executando}>✕</button>
                                                </div>
                                                <div className="se-body">
                                                    {item.comandos.length === 0 ? (
                                                        <div className="se-vazio">Adicione comandos</div>
                                                    ) : (
                                                        item.comandos.map((cmdId, ci) => {
                                                            const cmd = COMANDOS.find(c => c.id === cmdId);
                                                            return (
                                                                <div 
                                                                    key={ci} 
                                                                    className={`se-cmd ${blocoSeAtivo === i && comandoInternoAtivo === ci ? 'se-cmd-ativo' : ''}`} 
                                                                    style={{ background: cmd.cor }}
                                                                    draggable={!executando}
                                                                    onDragStart={(e) => handleDragStart(e, {id: cmdId}, ci, i)}
                                                                    onDragOver={(e) => { e.stopPropagation(); handleDragOver(e, null); }}
                                                                    onDrop={(e) => handleDrop(e, ci, i)}
                                                                >
                                                                    <span className="cmd-content">
                                                                        <span className="cmd-icone-item">{cmd.icone}</span>
                                                                        <span className="cmd-nome">{cmd.nome}</span>
                                                                    </span>
                                                                    <button className="btn-x" onClick={() => removerDentroSe(i, ci)} disabled={executando}>✕</button>
                                                                </div>
                                                            );
                                                        })
                                                    )}
                                                </div>
                                                <div className="se-add">
                                                    {COMANDOS.map(c => (
                                                        <button
                                                            key={c.id}
                                                            className="mini-add"
                                                            onClick={() => adicionarDentroSe(i, c.id)}
                                                            disabled={executando || item.comandos.length >= 8}
                                                            title={c.nome}
                                                            draggable={!executando}
                                                            onDragStart={(e) => handleDragStart(e, {item: {id: c.id}}, null, i)}
                                                        >
                                                            {c.icone}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="cmd-item" style={{ background: COMANDOS.find(c => c.id === item.id).cor }}>
                                                <span className="cmd-content">
                                                    <span className="cmd-icone-item">{COMANDOS.find(c => c.id === item.id).icone}</span>
                                                    <span className="cmd-nome">{COMANDOS.find(c => c.id === item.id).nome}</span>
                                                </span>
                                                <button className="btn-x" onClick={() => removerItem(i)} disabled={executando}>✕</button>
                                            </div>
                                        )}
                                    </div>
                                ))
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
                    <h3>🏆 Parabéns! Todos os os desafios completos!</h3>
                    <p>Você dominou as <strong>CONDIÇÕES</strong>! O robô agora sabe tomar decisões baseadas no que encontra.</p>
                    <div className="conceito-box">
                        <strong>💡 O que aprendemos:</strong>
                        <p>
                            <br></br><strong>CONDIÇÕES (SE/ENTÃO)</strong> permitem que o algoritmo tome decisões! 
                            "SE tiver lama, ENTÃO desvie". Sem isso, o robô ficaria preso sem saber o que fazer.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
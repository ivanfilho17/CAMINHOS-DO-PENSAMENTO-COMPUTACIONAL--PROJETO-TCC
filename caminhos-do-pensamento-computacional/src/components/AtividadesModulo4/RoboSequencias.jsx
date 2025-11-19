import React, { useState } from 'react';
import './RoboSequencias.css';

// Componente do Robô em SVG - SEM ROTAÇÃO
function RoboSVG() {
    return (
        <g>
            <rect x="-18" y="-22" width="36" height="44" fill="#2563eb" rx="6" />
            <rect x="-16" y="-20" width="32" height="40" fill="#3b82f6" rx="5" />
            <ellipse cx="0" cy="-32" rx="15" ry="12" fill="#60a5fa" />
            <circle cx="-6" cy="-32" r="4" fill="white" />
            <circle cx="6" cy="-32" r="4" fill="white" />
            <circle cx="-6" cy="-32" r="2" fill="#1e293b" />
            <circle cx="6" cy="-32" r="2" fill="#1e293b" />
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
    { id: 'direita', nome: 'Avançar', icone: '➡️', cor: '#3b82f6' },
    { id: 'baixo', nome: 'Descer', icone: '⬇️', cor: '#10b981' },
    { id: 'cima', nome: 'Subir', icone: '⬆️', cor: '#ffa200ff' },
    { id: 'esquerda', nome: 'Voltar', icone: '⬅️', cor: '#ec4899' },
];

// Níveis do jogo
const NIVEIS = [
    {
        id: 1,
        titulo: 'Nível 1: Caminho Reto',
        grade: 5,
        roboInicio: { x: 0, y: 2 },
        bandeiraPos: { x: 4, y: 2 },
        dica: 'Use 4x Avançar à Direita ➡️'
    },
    {
        id: 2,
        titulo: 'Nível 2: Uma Curva',
        grade: 5,
        roboInicio: { x: 0, y: 4 },
        bandeiraPos: { x: 4, y: 0 },
        dica: 'Avance à Direita ➡️ 4x, depois Avance para Cima ⬆️ 4x'
    },
    {
        id: 3,
        titulo: 'Nível 3: Zigue-Zague',
        grade: 5,
        roboInicio: { x: 0, y: 2 },
        bandeiraPos: { x: 4, y: 4 },
        dica: 'Combine Avançar à Direita ➡️, Avançar para Baixo ⬇️!'
    }
];

export default function RoboSequencias({ onConcluido }) {
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

    const nivel = NIVEIS[nivelAtual];

    const resetar = () => {
        setRoboPos({ x: nivel.roboInicio.x, y: nivel.roboInicio.y });
        setVenceu(false);
        setFeedback('');
        setBandeiraAnimando(false);
        setComandoAtivo(null);
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

    const mover = (pos, cmd) => {
        const { x, y } = pos;
        let nx = x, ny = y;

        if (cmd === 'direita') nx = Math.min(x + 1, nivel.grade - 1);
        else if (cmd === 'esquerda') nx = Math.max(x - 1, 0);
        else if (cmd === 'baixo') ny = Math.min(y + 1, nivel.grade - 1);
        else if (cmd === 'cima') ny = Math.max(y - 1, 0);

        return { x: nx, y: ny };
    };

    const executar = async () => {
        setExecutando(true);
        setFeedback('');
        setComandoAtivo(null);
        let pos = { x: nivel.roboInicio.x, y: nivel.roboInicio.y };

        for (let i = 0; i < algoritmo.length; i++) {
            const cmd = algoritmo[i];
            setComandoAtivo(i);
            await new Promise(r => setTimeout(r, 800));
            pos = mover(pos, cmd);
            setRoboPos(pos);
            await new Promise(r => setTimeout(r, 200));
        }

        setComandoAtivo(null);
        await new Promise(r => setTimeout(r, 300));

        if (pos.x === nivel.bandeiraPos.x && pos.y === nivel.bandeiraPos.y) {
            setBandeiraAnimando(true);
            await new Promise(r => setTimeout(r, 1500));
            setVenceu(true);
            setFeedback('🎉 Parabéns! Você completou o nível!');
            if (!niveisCompletos.includes(nivelAtual)) {
                setNiveisCompletos([...niveisCompletos, nivelAtual]);
            }
            if (nivelAtual === NIVEIS.length - 1 && niveisCompletos.length === NIVEIS.length - 1) {
                setTimeout(() => onConcluido && onConcluido(), 2000);
            }
        } else {
            setFeedback('❌ O robô não chegou na bandeira. Tente de novo!');
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
                if (algoritmo.length < 15) {
                    setAlgoritmo([...algoritmo, draggedItem.item]);
                }
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
                Monte a sequência de comandos para o robô chegar na bandeira!
                <strong> A ordem dos passos é muito importante!</strong>
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
                            setRoboPos({ x: NIVEIS[i].roboInicio.x, y: NIVEIS[i].roboInicio.y });
                            setVenceu(false);
                            setFeedback('');
                            setMostrarDica(false);
                            setBandeiraAnimando(false);
                        }}
                        disabled={executando}
                    >
                        {niveisCompletos.includes(i) && '✓ '}
                        Nível {n.id}
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

                        <g transform={`translate(${roboPos.x * 80 + 40}, ${roboPos.y * 80 + 40})`} className="robo-animado">
                            <RoboSVG />
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
                            <h4 className="subtitle">Algoritmo ({algoritmo.length}/15):</h4>
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
                                <div className="algo-vazio">Arraste ou clique nos comandos...</div>
                            ) : (
                                algoritmo.map((cmdId, i) => {
                                    const cmd = COMANDOS.find(c => c.id === cmdId);
                                    return (
                                        <div
                                            key={i}
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

                    {feedback && (
                        <div className={`feedback ${venceu ? 'sucesso' : 'erro'}`}>
                            {feedback}
                        </div>
                    )}
                </div>
            </div>

            {niveisCompletos.length === NIVEIS.length && (
                <div className="conclusao">
                    <h3>🏆 Parabéns! Todos os níveis completos!</h3>
                    <p>
                        Você dominou as <strong>SEQUÊNCIAS</strong>! Aprendeu que a ordem dos comandos
                        é fundamental em um algoritmo.
                    </p>
                    <div className="conceito-box">
                        <strong>💡 Conceito Aprendido:</strong>
                        <p>
                            Uma SEQUÊNCIA é uma lista ordenada de passos. Em um algoritmo,
                            cada instrução é executada uma após a outra, na ordem exata!
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
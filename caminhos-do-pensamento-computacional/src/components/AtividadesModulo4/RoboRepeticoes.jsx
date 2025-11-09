import React, { useState } from 'react';
import './RoboRepeticoes.css';

// Componente do Robô em SVG (sem rotação)
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
            <polygon points="0,-8 8,0 0,8" fill="#22d3ee" opacity="0.5" />
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

// Comandos - Movimentos em 2D + Repetições
const COMANDOS = [
    { id: 'direita', nome: 'Avançar →', icone: '➡️', cor: '#3b82f6', tipo: 'acao' },
    { id: 'baixo', nome: 'Descer ↓', icone: '⬇️', cor: '#10b981', tipo: 'acao' },
    { id: 'cima', nome: 'Subir ↑', icone: '⬆️', cor: '#f59e0b', tipo: 'acao' },
    { id: 'esquerda', nome: 'Voltar ←', icone: '⬅️', cor: '#ec4899', tipo: 'acao' },
    { id: 'repita', nome: 'REPITA', icone: '🔁', cor: '#8b5cf6', tipo: 'repeticao' }
];

// Níveis do jogo
const NIVEIS = [
    {
        id: 1,
        titulo: 'Nível 1: Corredor Reto',
        grade: 6,
        roboInicio: { x: 0, y: 2 },
        bandeiraPos: { x: 5, y: 2 },
        dica: 'Use REPITA 5x para avançar 5 casas ao invés de 5 comandos separados!'
    },
    {
        id: 2,
        titulo: 'Nível 2: Escada',
        grade: 6,
        roboInicio: { x: 0, y: 5 },
        bandeiraPos: { x: 5, y: 0 },
        dica: 'Use REPITA 5x: [Avançar, Subir] para fazer o movimento diagonal!'
    },
    {
        id: 3,
        titulo: 'Nível 3: Labirinto em L',
        grade: 6,
        roboInicio: { x: 0, y: 0 },
        bandeiraPos: { x: 5, y: 5 },
        dica: 'Use REPITA 5x: [Avançar] e depois REPITA 5x: [Descer] para fazer o caminho em L!'
    }
];

export default function RoboRepeticoes({ onConcluido }) {
    const [nivelAtual, setNivelAtual] = useState(0);
    const [algoritmo, setAlgoritmo] = useState([]);
    const [roboPos, setRoboPos] = useState(NIVEIS[0].roboInicio);
    const [executando, setExecutando] = useState(false);
    const [venceu, setVenceu] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [niveisCompletos, setNiveisCompletos] = useState([]);
    const [mostrarDica, setMostrarDica] = useState(false);
    const [bandeiraAnimando, setBandeiraAnimando] = useState(false);
    const [draggedItem, setDraggedItem] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    const nivel = NIVEIS[nivelAtual];

    const resetar = () => {
        setRoboPos(nivel.roboInicio);
        setVenceu(false);
        setFeedback('');
        setBandeiraAnimando(false);
    };

    const adicionarComando = (comandoId) => {
        if (algoritmo.length < 15) {
            if (comandoId === 'repita') {
                setAlgoritmo([...algoritmo, { tipo: 'repita', vezes: 3, comandos: [] }]);
            } else {
                setAlgoritmo([...algoritmo, { tipo: 'comando', id: comandoId }]);
            }
        }
    };

    const adicionarDentroRepita = (indexBloco, comandoId) => {
        const novo = [...algoritmo];
        if (novo[indexBloco].comandos.length < 8) {
            novo[indexBloco].comandos.push(comandoId);
            setAlgoritmo(novo);
        }
    };

    const alterarVezes = (indexBloco, novasVezes) => {
        const novo = [...algoritmo];
        novo[indexBloco].vezes = Math.min(Math.max(novasVezes, 1), 10);
        setAlgoritmo(novo);
    };

    const removerItem = (index) => {
        setAlgoritmo(algoritmo.filter((_, i) => i !== index));
    };

    const removerDentroRepita = (indexBloco, indexCmd) => {
        const novo = [...algoritmo];
        novo[indexBloco].comandos = novo[indexBloco].comandos.filter((_, i) => i !== indexCmd);
        setAlgoritmo(novo);
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
        let pos = nivel.roboInicio;

        for (const item of algoritmo) {
            await new Promise(r => setTimeout(r, 400));

            if (item.tipo === 'repita') {
                for (let i = 0; i < item.vezes; i++) {
                    for (const cmdId of item.comandos) {
                        await new Promise(r => setTimeout(r, 350));
                        pos = mover(pos, cmdId);
                        setRoboPos(pos);
                    }
                }
            } else {
                pos = mover(pos, item.id);
                setRoboPos(pos);
            }
        }

        await new Promise(r => setTimeout(r, 300));

        if (pos.x === nivel.bandeiraPos.x && pos.y === nivel.bandeiraPos.y) {
            setBandeiraAnimando(true);
            await new Promise(r => setTimeout(r, 2000));
            setVenceu(true);
            setFeedback('🎉 Perfeito! Você usou repetições com sucesso!');
            if (!niveisCompletos.includes(nivelAtual)) {
                setNiveisCompletos([...niveisCompletos, nivelAtual]);
            }
            if (nivelAtual === NIVEIS.length - 1 && niveisCompletos.length === NIVEIS.length - 1) {
                setTimeout(() => onConcluido && onConcluido(), 2000);
            }
        } else {
            setFeedback('❌ O robô não chegou na bandeira. Ajuste as repetições!');
        }

        setExecutando(false);
    };

    const proximo = () => {
        if (nivelAtual < NIVEIS.length - 1) {
            const prox = nivelAtual + 1;
            setNivelAtual(prox);
            setAlgoritmo([]);
            setRoboPos(NIVEIS[prox].roboInicio);
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

    const comandoNormal = (cmd) => ['direita', 'baixo', 'cima', 'esquerda'].includes(cmd);

    return (
        <div className="robo-repeticoes-container">
            <h2 className="robo-title">🤖 Robô com Repetições (REPITA)</h2>
            <p className="robo-subtitle">
                Use <strong>REPETIÇÕES</strong> para otimizar seu código!
                Ao invés de repetir comandos, use laços!
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
                            setRoboPos(NIVEIS[i].roboInicio);
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
                    <svg width="320" height="320" viewBox={`0 0 ${nivel.grade * 80} ${nivel.grade * 80}`} className="grade-svg">
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
                </div>

                {/* Painel de Controle */}
                <div className="control-panel">
                    <div className="comandos-section">
                        <h4 className="subtitle">Comandos:</h4>
                        <div className="comandos-mini">
                            {COMANDOS.map(c => (
                                <button
                                    key={c.id}
                                    className={`cmd-mini ${c.tipo === 'repeticao' ? 'repita' : ''}`}
                                    style={{ background: c.cor }}
                                    onClick={() => adicionarComando(c.id)}
                                    disabled={executando || algoritmo.length >= 15}
                                    title={c.nome}
                                    draggable={!executando && algoritmo.length < 15}
                                    onDragStart={(e) => handleDragStart(e, c.id === 'repita' ? { tipo: 'repita', vezes: 3, comandos: [] } : { tipo: 'comando', id: c.id })}
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
                                algoritmo.map((item, i) => (
                                    <div
                                        key={i}
                                        className={`algo-item ${dragOverIndex === i ? 'drag-over' : ''}`}
                                        draggable={!executando}
                                        onDragStart={(e) => handleDragStart(e, item, i)}
                                        onDragOver={(e) => handleDragOver(e, i)}
                                        onDrop={(e) => handleDrop(e, i)}
                                        onDragEnd={handleDragEnd}
                                    >
                                        {item.tipo === 'repita' ? (
                                            <div className="bloco-repita">
                                                <div className="repita-header">
                                                    <span>🔁 REPITA</span>
                                                    <div className="vezes-control">
                                                        <button
                                                            className="btn-vezes"
                                                            onClick={() => alterarVezes(i, item.vezes - 1)}
                                                            disabled={executando}
                                                        >
                                                            −
                                                        </button>
                                                        <span className="vezes-num">{item.vezes}x</span>
                                                        <button
                                                            className="btn-vezes"
                                                            onClick={() => alterarVezes(i, item.vezes + 1)}
                                                            disabled={executando}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <button className="btn-x" onClick={() => removerItem(i)} disabled={executando}>✕</button>
                                                </div>
                                                <div className="repita-body">
                                                    {item.comandos.length === 0 ? (
                                                        <div className="repita-vazio">Adicione comandos ⬇️</div>
                                                    ) : (
                                                        item.comandos.map((cmdId, ci) => {
                                                            const cmd = COMANDOS.find(c => c.id === cmdId);
                                                            return (
                                                                <div key={ci} className="repita-cmd" style={{ background: cmd.cor }}>
                                                                    {cmd.icone}
                                                                    <button className="btn-x" onClick={() => removerDentroRepita(i, ci)} disabled={executando}>✕</button>
                                                                </div>
                                                            );
                                                        })
                                                    )}
                                                </div>
                                                <div className="repita-add">
                                                    {COMANDOS.filter(c => comandoNormal(c.id)).map(c => (
                                                        <button
                                                            key={c.id}
                                                            className="mini-add"
                                                            onClick={() => adicionarDentroRepita(i, c.id)}
                                                            disabled={executando || item.comandos.length >= 8}
                                                            title={c.nome}
                                                        >
                                                            {c.icone}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="cmd-item" style={{ background: COMANDOS.find(c => c.id === item.id).cor }}>
                                                {COMANDOS.find(c => c.id === item.id).icone}
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
                        Você dominou as <strong>REPETIÇÕES</strong>! Aprendeu a otimizar algoritmos
                        usando laços ao invés de repetir comandos manualmente.
                    </p>
                    <div className="conceito-box">
                        <strong>💡 Conceito Aprendido:</strong>
                        <p>
                            REPETIÇÕES (ou Laços) permitem executar o mesmo comando várias vezes
                            sem precisar escrevê-lo repetidamente. Isso torna o código mais curto,
                            eficiente e fácil de entender!
                        </p>
                    </div>
                    <div className="conquista-final">
                        <h4>🎓 Parabéns! Você completou as 3 atividades de Algoritmos!</h4>
                        <div className="pilares-completos">
                            <div className="pilar">🔢 Sequências</div>
                            <div className="pilar">🔀 Condições</div>
                            <div className="pilar">🔁 Repetições</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
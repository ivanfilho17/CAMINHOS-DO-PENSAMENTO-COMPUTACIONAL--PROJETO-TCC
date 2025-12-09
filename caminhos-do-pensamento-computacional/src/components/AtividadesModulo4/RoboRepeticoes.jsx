import React, { useState, useRef } from 'react';
import './RoboRepeticoes.css';

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
    { id: 'direita', nome: 'Direita', icone: '➡️', cor: '#3b82f6', tipo: 'acao' },
    { id: 'baixo', nome: 'Baixo', icone: '⬇️', cor: '#10b981', tipo: 'acao' },
    { id: 'cima', nome: 'Cima', icone: '⬆️', cor: '#f59e0b', tipo: 'acao' },
    { id: 'esquerda', nome: 'Esquerda', icone: '⬅️', cor: '#ec4899', tipo: 'acao' },
    { id: 'repita', nome: 'REPITA', icone: '🔁', cor: '#8b5cf6', tipo: 'repeticao' }
];

// Níveis do jogo
const NIVEIS = [
    {
        id: 1,
        titulo: 'Desafio 1: Corredor Reto',
        grade: 6,
        roboInicio: { x: 0, y: 2 },
        bandeiraPos: { x: 5, y: 2 },
        dica: 'Use o bloco REPITA para fazer o robô andar para a Direita 5 vezes.'
    },
    {
        id: 2,
        titulo: 'Desafio 2: Escada',
        grade: 6,
        roboInicio: { x: 0, y: 5 },
        bandeiraPos: { x: 5, y: 0 },
        dica: 'Coloque [Direita, Cima] dentro do REPITA e veja o robô subir a escada!'
    },
    {
        id: 3,
        titulo: 'Desafio 3: Uma Curva',
        grade: 6,
        roboInicio: { x: 0, y: 0 },
        bandeiraPos: { x: 5, y: 5 },
        dica: 'Use um REPITA para ir até o fim para a Direita, e outro REPITA para descer tudo.'
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
    const [comandoAtivo, setComandoAtivo] = useState(null);
    const [blocoRepitaAtivo, setBlocoRepitaAtivo] = useState(null);
    const [comandoInternoAtivo, setComandoInternoAtivo] = useState(null);
    
    // Estado para expressão facial
    const [expressaoRobo, setExpressaoRobo] = useState('feliz');

    // REF para animação direta
    const roboRef = useRef(null);

    const nivel = NIVEIS[nivelAtual];

    const resetar = () => {
        setRoboPos(nivel.roboInicio);
        setVenceu(false);
        setFeedback('');
        setBandeiraAnimando(false);
        setComandoAtivo(null);
        setBlocoRepitaAtivo(null);
        setComandoInternoAtivo(null);
        setExpressaoRobo('feliz');
        
        if (roboRef.current) {
            roboRef.current.classList.remove('tremendo');
        }
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

    // Atualizado para não travar nas bordas (permite sair para animar)
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

    const tratarSaidaTabuleiro = async () => {
        setExpressaoRobo('triste');
        setFeedback('💥 Ops! O robô saiu do tabuleiro!');
        
        if (roboRef.current) {
            await new Promise(r => setTimeout(r, 50));
            roboRef.current.classList.add('tremendo');
            await new Promise(r => setTimeout(r, 600));
            if (roboRef.current) roboRef.current.classList.remove('tremendo');
        }
        
        setExecutando(false);
        setComandoAtivo(null);
        setBlocoRepitaAtivo(null);
        setComandoInternoAtivo(null);
    };

    const executar = async () => {
        // Reset inicial obrigatório
        resetar();
        await new Promise(r => setTimeout(r, 400)); 

        setExecutando(true);
        setFeedback('');
        setComandoAtivo(null);
        setBlocoRepitaAtivo(null);
        setComandoInternoAtivo(null);
        setExpressaoRobo('feliz');
        let pos = { x: nivel.roboInicio.x, y: nivel.roboInicio.y };

        for (let i = 0; i < algoritmo.length; i++) {
            const item = algoritmo[i];
            setComandoAtivo(i);
        
            await new Promise(r => setTimeout(r, 800));

            if (item.tipo === 'repita') {
                setBlocoRepitaAtivo(i);
                for (let rep = 0; rep < item.vezes; rep++) {
                    for (let ci = 0; ci < item.comandos.length; ci++) {
                        const cmdId = item.comandos[ci];
                        setComandoInternoAtivo(ci);
                        
                        await new Promise(r => setTimeout(r, 800));
                        
                        const novaPos = calcularNovaPosicao(pos, cmdId);
                        
                        // Verifica se saiu (Dentro do loop REPITA)
                        if (isForaDoMapa(novaPos)) {
                            setRoboPos(novaPos);
                            await new Promise(r => setTimeout(r, 800)); 
                            await tratarSaidaTabuleiro();
                            return;
                        }

                        pos = novaPos;
                        setRoboPos(pos);
                        await new Promise(r => setTimeout(r, 800)); 
                    }
                }
                setComandoInternoAtivo(null);
                setBlocoRepitaAtivo(null);
            } else {
                // Comandos normais fora do REPITA
                const novaPos = calcularNovaPosicao(pos, item.id);
                
                if (isForaDoMapa(novaPos)) {
                    setRoboPos(novaPos);
                    
                    await new Promise(r => setTimeout(r, 800));
                    await tratarSaidaTabuleiro();
                    return;
                }

                pos = novaPos;
                setRoboPos(pos);
                await new Promise(r => setTimeout(r, 800));
            }
        }

        setComandoAtivo(null);
        setBlocoRepitaAtivo(null);
        setComandoInternoAtivo(null);
        await new Promise(r => setTimeout(r, 500));

        if (pos.x === nivel.bandeiraPos.x && pos.y === nivel.bandeiraPos.y) {
            setBandeiraAnimando(true);
            await new Promise(r => setTimeout(r, 1500));
            setVenceu(true);
            setFeedback('🎉 Perfeito! Você usou repetições com sucesso e fez o robô chegar na bandeira!');
            if (!niveisCompletos.includes(nivelAtual)) {
                setNiveisCompletos([...niveisCompletos, nivelAtual]);
            }
            if (nivelAtual === NIVEIS.length - 1 && niveisCompletos.length === NIVEIS.length - 1) {
                setTimeout(() => onConcluido && onConcluido(), 2000);
            }
        } else {
            setExpressaoRobo('triste');
            setFeedback('❌ Ops! O robô não chegou na bandeira. Verifique e ajuste suas repetições!');
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
            setExpressaoRobo('feliz');
        }
    };

    // Drag and Drop
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

        // 1. Drop DENTRO de um bloco REPITA
        if (dropParentIndex !== null) {
            if (draggedItem.fromParentIndex === dropParentIndex) {
                const targetBlock = newAlgoritmo[dropParentIndex];
                if (draggedItem.fromIndex === null) {
                    if (targetBlock.comandos.length < 8) {
                        if (dropIndex === null) targetBlock.comandos.push(draggedItem.item.id);
                        else targetBlock.comandos.splice(dropIndex, 0, draggedItem.item.id);
                    }
                } else {
                    if (dropIndex !== null && dropIndex !== draggedItem.fromIndex) {
                        const [removed] = targetBlock.comandos.splice(draggedItem.fromIndex, 1);
                        targetBlock.comandos.splice(dropIndex, 0, removed);
                    }
                }
            } else {
                if (draggedItem.fromIndex === null && draggedItem.fromParentIndex === null) {
                    const targetBlock = newAlgoritmo[dropParentIndex];
                    if (targetBlock.comandos.length < 8) {
                        if (dropIndex === null) targetBlock.comandos.push(draggedItem.item.id);
                        else targetBlock.comandos.splice(dropIndex, 0, draggedItem.item.id);
                    }
                }
            }
        } 
        // 2. Drop na lista PRINCIPAL
        else {
            if (draggedItem.fromParentIndex === null) {
                if (draggedItem.fromIndex === null) {
                    if (newAlgoritmo.length < 15) {
                        if (dropIndex === null) newAlgoritmo.push(draggedItem.item);
                        else newAlgoritmo.splice(dropIndex, 0, draggedItem.item);
                    }
                } else {
                    if (dropIndex !== null && dropIndex !== draggedItem.fromIndex) {
                        const [removed] = newAlgoritmo.splice(draggedItem.fromIndex, 1);
                        newAlgoritmo.splice(dropIndex, 0, removed);
                    }
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

    const comandoNormal = (cmd) => ['direita', 'baixo', 'cima', 'esquerda'].includes(cmd);

    return (
        <div className="robo-repeticoes-container">
            <h2 className="robo-title">🤖 Robô com Repetições (REPITA)</h2>
            <p className="robo-subtitle">
                Use <strong>REPETIÇÕES</strong> para otimizar seus algoritmos!
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

                        {/* CORREÇÃO: Grupo Pai (Movimento) + Grupo Filho (Animação com REF) */}
                        <g 
                            transform={`translate(${roboPos.x * 80 + 40}, ${roboPos.y * 80 + 40})`} 
                            className="robo-movimento"
                        >
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
                    
                    {/* Feedback priorizando erro */}
                    {feedback && (
                        <div className={`feedback ${venceu ? 'sucesso' : (feedback.includes('Ops') || feedback.includes('saiu') ? 'erro' : '')}`}>
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
                                    className={`cmd-mini ${c.tipo === 'repeticao' ? 'repita' : ''}`}
                                    style={{ background: c.cor }}
                                    onClick={() => adicionarComando(c.id)}
                                    disabled={executando || algoritmo.length >= 15}
                                    title={c.nome}
                                    draggable={!executando && algoritmo.length < 15}
                                    onDragStart={(e) => handleDragStart(e, c.id === 'repita' ? { tipo: 'repita', vezes: 3, comandos: [] } : { tipo: 'comando', id: c.id }, null, null)}
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
                                        {item.tipo === 'repita' ? (
                                            <div className={`bloco-repita ${blocoRepitaAtivo === i ? 'bloco-repita-ativo' : ''}`}>
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
                                                        <div className="repita-vazio">Adicione comandos...</div>
                                                    ) : (
                                                        item.comandos.map((cmdId, ci) => {
                                                            const cmd = COMANDOS.find(c => c.id === cmdId);
                                                            return (
                                                                <div 
                                                                    key={ci} 
                                                                    className={`repita-cmd ${blocoRepitaAtivo === i && comandoInternoAtivo === ci ? 'repita-cmd-ativo' : ''}`} 
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
                    <h3>🏆 Parabéns! Todos os desafios completos!</h3>
                    <p>
                        Você dominou as <strong>REPETIÇÕES</strong>! Aprendeu a otimizar algoritmos
                        usando laços ao invés de repetir os mesmos comandos várias vezes.
                    </p>
                    <div className="conceito-box">
                        <strong>💡 O que aprendemos:</strong>
                        <p>
                            <br></br><strong>REPETIÇÕES (ou Laços)</strong> permitem executar o mesmo comando várias vezes
                            sem precisar escrevê-lo repetidamente. Isso torna o código mais curto,
                            eficiente e fácil de entender!
                        </p>
                    </div>
                    {/*<div className="conquista-final">
                        <h4>🎓 Parabéns! Você completou as 3 atividades de Algoritmos!</h4>
                        <div className="pilares-completos">
                            <div className="pilar">🔢 Sequências</div>
                            <div className="pilar">🔀 Condições</div>
                            <div className="pilar">🔁 Repetições</div>
                        </div>
                    </div>*/}
                </div>
            )}
        </div>
    );
}
import React, { useState } from 'react';
import './RoboRepeticoes.css';

// Componente do Robô em SVG
function RoboSVG({ direcao }) {
    const rotacao = {
        'direita': 0,
        'baixo': 90,
        'esquerda': 180,
        'cima': 270
    };

    return (
        <g transform={`rotate(${rotacao[direcao]})`}>
            <rect x="-20" y="-25" width="40" height="50" fill="#3b82f6" rx="5" />
            <rect x="-15" y="-35" width="30" height="25" fill="#60a5fa" rx="3" />
            <circle cx="-8" cy="-25" r="3" fill="white" />
            <circle cx="8" cy="-25" r="3" fill="white" />
            <circle cx="-8" cy="-25" r="1.5" fill="#1e293b" />
            <circle cx="8" cy="-25" r="1.5" fill="#1e293b" />
            <line x1="0" y1="-35" x2="0" y2="-42" stroke="#1e293b" strokeWidth="2" />
            <circle cx="0" cy="-42" r="3" fill="#ef4444" />
            <rect x="-25" y="-15" width="5" height="20" fill="#60a5fa" rx="2" />
            <rect x="20" y="-15" width="5" height="20" fill="#60a5fa" rx="2" />
            <rect x="-15" y="25" width="10" height="15" fill="#1e40af" rx="2" />
            <rect x="5" y="25" width="10" height="15" fill="#1e40af" rx="2" />
            <circle cx="0" cy="-5" r="4" fill="#1e40af" />
            <rect x="-8" y="5" width="16" height="3" fill="#1e40af" rx="1" />
            <rect x="-8" y="12" width="16" height="3" fill="#1e40af" rx="1" />
        </g>
    );
}

// Componente da Bandeira
function BandeiraSVG() {
    return (
        <g>
            <rect x="-2" y="-35" width="4" height="60" fill="#78350f" />
            <path d="M 2,-30 L 2,-10 L 25,-20 Z" fill="#ef4444" />
            <path d="M 2,-30 L 2,-10 L 25,-20 Z" fill="none" stroke="#991b1b" strokeWidth="1" />
        </g>
    );
}

// Comandos disponíveis (agora com blocos de repetição)
const COMANDOS = [
    { id: 'avancar', nome: 'Avançar', icone: '⬆️', cor: '#3b82f6', tipo: 'acao' },
    { id: 'direita', nome: 'Virar à Direita', icone: '➡️', cor: '#10b981', tipo: 'acao' },
    { id: 'esquerda', nome: 'Virar à Esquerda', icone: '⬅️', cor: '#f59e0b', tipo: 'acao' },
    { id: 'repita-3', nome: 'REPITA 3 vezes', icone: '🔁', cor: '#ec4899', tipo: 'repeticao', vezes: 3 },
    { id: 'repita-5', nome: 'REPITA 5 vezes', icone: '🔁', cor: '#ec4899', tipo: 'repeticao', vezes: 5 },
    { id: 'repita-10', nome: 'REPITA 10 vezes', icone: '🔁', cor: '#ec4899', tipo: 'repeticao', vezes: 10 }
];

// Níveis do jogo
const NIVEIS = [
    {
        id: 1,
        titulo: 'Nível 1: Corredor Reto',
        grade: 6,
        roboInicio: { x: 0, y: 2, direcao: 'direita' },
        bandeiraPos: { x: 5, y: 2 },
        dica: 'Use REPITA 5 vezes: [Avançar] ao invés de 5 comandos de avançar!',
        solucaoOtima: 2 // Número ideal de comandos
    },
    {
        id: 2,
        titulo: 'Nível 2: Quadrado',
        grade: 6,
        roboInicio: { x: 1, y: 4, direcao: 'direita' },
        bandeiraPos: { x: 1, y: 4 },
        dica: 'Para fazer um quadrado: REPITA 4 vezes: [Avançar 3x, Virar à Direita]',
        solucaoOtima: 3,
        isLoop: true // Indica que deve voltar ao ponto inicial
    },
    {
        id: 3,
        titulo: 'Nível 3: Corredor Longo',
        grade: 7,
        roboInicio: { x: 0, y: 3, direcao: 'direita' },
        bandeiraPos: { x: 6, y: 0 },
        dica: 'Combine repetições! REPITA 5 vezes + virar + REPITA 3 vezes',
        solucaoOtima: 4
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
    const [numeroComandos, setNumeroComandos] = useState(0);

    const nivel = NIVEIS[nivelAtual];

    const resetarNivel = () => {
        setRoboPos(nivel.roboInicio);
        setAlgoritmo([]);
        setVenceu(false);
        setFeedback('');
        setNumeroComandos(0);
    };

    const adicionarComando = (comandoId) => {
        if (algoritmo.length < 15) {
            setAlgoritmo([...algoritmo, comandoId]);
        }
    };

    const removerComando = (index) => {
        setAlgoritmo(algoritmo.filter((_, i) => i !== index));
    };

    const moverRobo = (posAtual, comando) => {
        const { x, y, direcao } = posAtual;
        let novaDirecao = direcao;
        let novoX = x;
        let novoY = y;

        if (comando === 'direita') {
            if (direcao === 'direita') novaDirecao = 'baixo';
            else if (direcao === 'baixo') novaDirecao = 'esquerda';
            else if (direcao === 'esquerda') novaDirecao = 'cima';
            else if (direcao === 'cima') novaDirecao = 'direita';
        } else if (comando === 'esquerda') {
            if (direcao === 'direita') novaDirecao = 'cima';
            else if (direcao === 'cima') novaDirecao = 'esquerda';
            else if (direcao === 'esquerda') novaDirecao = 'baixo';
            else if (direcao === 'baixo') novaDirecao = 'direita';
        } else if (comando === 'avancar') {
            if (direcao === 'direita') novoX = Math.min(x + 1, nivel.grade - 1);
            else if (direcao === 'esquerda') novoX = Math.max(x - 1, 0);
            else if (direcao === 'baixo') novoY = Math.min(y + 1, nivel.grade - 1);
            else if (direcao === 'cima') novoY = Math.max(y - 1, 0);
        }

        return { x: novoX, y: novoY, direcao: novaDirecao };
    };

    const executarAlgoritmo = async () => {
        setExecutando(true);
        setFeedback('');
        let posicaoAtual = nivel.roboInicio;
        let comandosExecutados = 0;

        for (let i = 0; i < algoritmo.length; i++) {
            const comandoId = algoritmo[i];
            const comando = COMANDOS.find(c => c.id === comandoId);

            if (comando.tipo === 'repeticao') {
                // Verifica se tem comando seguinte para repetir
                if (i + 1 < algoritmo.length) {
                    const comandoRepetir = algoritmo[i + 1];

                    for (let r = 0; r < comando.vezes; r++) {
                        await new Promise(resolve => setTimeout(resolve, 400));
                        posicaoAtual = moverRobo(posicaoAtual, comandoRepetir);
                        setRoboPos(posicaoAtual);
                        comandosExecutados++;
                    }
                    i++; // Pula o próximo comando pois já foi repetido
                }
            } else {
                await new Promise(resolve => setTimeout(resolve, 400));
                posicaoAtual = moverRobo(posicaoAtual, comandoId);
                setRoboPos(posicaoAtual);
                comandosExecutados++;
            }
        }

        await new Promise(resolve => setTimeout(resolve, 400));
        setNumeroComandos(comandosExecutados);

        const chegouNaBandeira = posicaoAtual.x === nivel.bandeiraPos.x &&
            posicaoAtual.y === nivel.bandeiraPos.y;

        if (chegouNaBandeira) {
            const eficiente = algoritmo.length <= nivel.solucaoOtima;

            setVenceu(true);

            if (eficiente) {
                setFeedback(`🎉 Perfeito! Você usou repetições de forma eficiente! (${algoritmo.length} blocos)`);
            } else {
                setFeedback(`✅ Chegou na bandeira, mas pode otimizar usando mais repetições! (${algoritmo.length} blocos, ideal: ${nivel.solucaoOtima})`);
            }

            if (!niveisCompletos.includes(nivelAtual)) {
                setNiveisCompletos([...niveisCompletos, nivelAtual]);
            }

            if (nivelAtual === NIVEIS.length - 1 && niveisCompletos.length === NIVEIS.length - 1) {
                setTimeout(() => onConcluido && onConcluido(), 2000);
            }
        } else {
            setFeedback('❌ Ops! O robô não chegou na bandeira. Revise as repetições!');
        }

        setExecutando(false);
    };

    const proximoNivel = () => {
        if (nivelAtual < NIVEIS.length - 1) {
            const proximo = nivelAtual + 1;
            setNivelAtual(proximo);
            setAlgoritmo([]);
            setRoboPos(NIVEIS[proximo].roboInicio);
            setVenceu(false);
            setFeedback('');
            setMostrarDica(false);
            setNumeroComandos(0);
        }
    };

    return (
        <div className="robo-repeticoes-container">
            <h2 className="robo-title">🤖 O Robô Coletor - Nível 3: Repetições</h2>
            <p className="robo-subtitle">
                Agora use <strong>REPETIÇÕES</strong> para otimizar seu código!
                Ao invés de repetir comandos, use laços!
            </p>

            {/* Seletor de Nível */}
            <div className="nivel-selector">
                {NIVEIS.map((n, idx) => (
                    <button
                        key={n.id}
                        className={`nivel-btn ${idx === nivelAtual ? 'ativo' : ''} ${niveisCompletos.includes(idx) ? 'completo' : ''}`}
                        onClick={() => {
                            setNivelAtual(idx);
                            setAlgoritmo([]);
                            setRoboPos(NIVEIS[idx].roboInicio);
                            setVenceu(false);
                            setFeedback('');
                            setMostrarDica(false);
                            setNumeroComandos(0);
                        }}
                        disabled={executando}
                    >
                        {niveisCompletos.includes(idx) && '✓ '}
                        Nível {n.id}
                    </button>
                ))}
            </div>

            <h3 className="nivel-titulo">{nivel.titulo}</h3>

            {/* Grade do Jogo */}
            <div className="grade-container">
                <svg
                    width={nivel.grade * 60}
                    height={nivel.grade * 60}
                    viewBox={`0 0 ${nivel.grade * 80} ${nivel.grade * 80}`}
                    className="grade-svg"
                >
                    {/* Células da grade */}
                    {Array.from({ length: nivel.grade }).map((_, row) =>
                        Array.from({ length: nivel.grade }).map((_, col) => (
                            <rect
                                key={`${row}-${col}`}
                                x={col * 80}
                                y={row * 80}
                                width={78}
                                height={78}
                                fill={row % 2 === col % 2 ? '#e0f2fe' : '#bae6fd'}
                                stroke="#0ea5e9"
                                strokeWidth="2"
                            />
                        ))
                    )}

                    {/* Bandeira */}
                    <g transform={`translate(${nivel.bandeiraPos.x * 80 + 40}, ${nivel.bandeiraPos.y * 80 + 40})`}>
                        <BandeiraSVG />
                    </g>

                    {/* Robô */}
                    <g transform={`translate(${roboPos.x * 80 + 40}, ${roboPos.y * 80 + 40})`} className="robo-animado">
                        <RoboSVG direcao={roboPos.direcao} />
                    </g>
                </svg>
            </div>

            {/* Estatísticas */}
            <div className="stats-container">
                <div className="stat-item">
                    <span className="stat-label">Blocos usados:</span>
                    <span className="stat-value">{algoritmo.length}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Solução ótima:</span>
                    <span className="stat-value">{nivel.solucaoOtima}</span>
                </div>
                {numeroComandos > 0 && (
                    <div className="stat-item">
                        <span className="stat-label">Comandos executados:</span>
                        <span className="stat-value">{numeroComandos}</span>
                    </div>
                )}
            </div>

            {/* Botão de Dica */}
            <div className="dica-container">
                <button className="btn-dica" onClick={() => setMostrarDica(!mostrarDica)}>
                    💡 {mostrarDica ? 'Esconder Dica' : 'Ver Dica'}
                </button>
                {mostrarDica && (
                    <div className="dica-box">
                        <strong>Dica:</strong> {nivel.dica}
                    </div>
                )}
            </div>

            {/* Comandos Disponíveis */}
            <div className="comandos-section">
                <h4 className="section-title">📦 Comandos Disponíveis:</h4>
                <div className="comandos-grid">
                    {COMANDOS.map(cmd => (
                        <button
                            key={cmd.id}
                            className={`comando-btn ${cmd.tipo}`}
                            style={{ background: cmd.cor }}
                            onClick={() => adicionarComando(cmd.id)}
                            disabled={executando || algoritmo.length >= 15}
                        >
                            <span className="comando-icone">{cmd.icone}</span>
                            <span className="comando-nome">{cmd.nome}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Algoritmo Montado */}
            <div className="algoritmo-section">
                <h4 className="section-title">🎯 Seu Algoritmo (com repetições):</h4>
                <div className="algoritmo-lista">
                    {algoritmo.length === 0 ? (
                        <div className="algoritmo-vazio">
                            Use blocos de REPITA para otimizar seu código...
                        </div>
                    ) : (
                        algoritmo.map((cmdId, idx) => {
                            const cmd = COMANDOS.find(c => c.id === cmdId);
                            const isRepeticao = cmd.tipo === 'repeticao';

                            return (
                                <div
                                    key={idx}
                                    className={`algoritmo-item ${isRepeticao ? 'repeticao' : ''}`}
                                    style={{ background: cmd.cor }}
                                >
                                    <span className="algoritmo-numero">{idx + 1}</span>
                                    <span className="algoritmo-icone">{cmd.icone}</span>
                                    <span className="algoritmo-texto">{cmd.nome}</span>
                                    {isRepeticao && <span className="badge-repeticao">×{cmd.vezes}</span>}
                                    <button
                                        className="remover-btn"
                                        onClick={() => removerComando(idx)}
                                        disabled={executando}
                                    >
                                        ✕
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
                <div className="algoritmo-info">
                    {algoritmo.length}/15 blocos
                </div>
            </div>

            {/* Botões de Ação */}
            <div className="botoes-acao">
                <button
                    className="btn btn-executar"
                    onClick={executarAlgoritmo}
                    disabled={executando || algoritmo.length === 0}
                >
                    {executando ? '⏳ Executando...' : '▶️ Executar Algoritmo'}
                </button>
                <button
                    className="btn btn-resetar"
                    onClick={resetarNivel}
                    disabled={executando}
                >
                    🔄 Resetar
                </button>
                {venceu && nivelAtual < NIVEIS.length - 1 && (
                    <button
                        className="btn btn-proximo"
                        onClick={proximoNivel}
                    >
                        ➡️ Próximo Nível
                    </button>
                )}
            </div>

            {/* Feedback */}
            {feedback && (
                <div className={`feedback ${venceu ? 'sucesso' : 'erro'}`}>
                    {feedback}
                </div>
            )}

            {/* Conclusão Final */}
            {niveisCompletos.length === NIVEIS.length && (
                <div className="conclusao">
                    <h3 className="conclusao-title">🏆 Todos os Níveis Completos!</h3>
                    <p className="conclusao-texto">
                        Você dominou as <strong>REPETIÇÕES</strong>! Aprendeu a otimizar algoritmos
                        usando laços ao invés de repetir comandos manualmente.
                    </p>
                    <div className="conceito-box">
                        <strong>💡 Conceito Aprendido:</strong>
                        <p>
                            REPETIÇÕES (ou Laços) permitem executar o mesmo comando várias vezes
                            sem precisar escrevê-lo repetidamente. Isso torna o código mais curto,
                            mais eficiente e mais fácil de entender!
                        </p>
                    </div>
                    <div className="conquista-final">
                        <h4>🎓 Parabéns! Você completou os 4 Pilares do Pensamento Computacional!</h4>
                        <div className="pilares-completos">
                            <div className="pilar">🧩 Decomposição</div>
                            <div className="pilar">🎨 Padrões</div>
                            <div className="pilar">🎯 Abstração</div>
                            <div className="pilar">👣 Algoritmos</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
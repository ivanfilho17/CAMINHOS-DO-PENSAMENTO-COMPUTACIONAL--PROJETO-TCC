import React, { useState } from 'react';
import './RoboCondicoes.css';

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

// Comandos disponíveis (agora com blocos condicionais)
const COMANDOS = [
    { id: 'avancar', nome: 'Avançar', icone: '⬆️', cor: '#3b82f6', tipo: 'acao' },
    { id: 'direita', nome: 'Virar à Direita', icone: '➡️', cor: '#10b981', tipo: 'acao' },
    { id: 'esquerda', nome: 'Virar à Esquerda', icone: '⬅️', cor: '#f59e0b', tipo: 'acao' },
    { id: 'se-lama', nome: 'SE tem Lama à frente', icone: '🔀', cor: '#8b5cf6', tipo: 'condicao' },
    { id: 'senao', nome: 'SENÃO', icone: '↩️', cor: '#ec4899', tipo: 'condicao' }
];

// Níveis do jogo com obstáculos
const NIVEIS = [
    {
        id: 1,
        titulo: 'Nível 1: Desvie da Lama',
        grade: 5,
        roboInicio: { x: 0, y: 2, direcao: 'direita' },
        bandeiraPos: { x: 4, y: 2 },
        lamas: [{ x: 2, y: 2 }],
        dica: 'Use SE tem lama à frente, vire à direita. SENÃO, avance.'
    },
    {
        id: 2,
        titulo: 'Nível 2: Duas Lamas',
        grade: 5,
        roboInicio: { x: 0, y: 3, direcao: 'direita' },
        bandeiraPos: { x: 4, y: 1 },
        lamas: [{ x: 1, y: 3 }, { x: 3, y: 2 }],
        dica: 'Use condições para desviar de cada obstáculo!'
    },
    {
        id: 3,
        titulo: 'Nível 3: Labirinto de Lama',
        grade: 5,
        roboInicio: { x: 0, y: 4, direcao: 'direita' },
        bandeiraPos: { x: 4, y: 0 },
        lamas: [{ x: 1, y: 4 }, { x: 2, y: 3 }, { x: 3, y: 1 }],
        dica: 'Combine várias condições para navegar pelo labirinto!'
    }
];

export default function RoboCondicoes({ onConcluido }) {
    const [nivelAtual, setNivelAtual] = useState(0);
    const [algoritmo, setAlgoritmo] = useState([]);
    const [roboPos, setRoboPos] = useState(NIVEIS[0].roboInicio);
    const [executando, setExecutando] = useState(false);
    const [venceu, setVenceu] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [niveisCompletos, setNiveisCompletos] = useState([]);
    const [mostrarDica, setMostrarDica] = useState(false);

    const nivel = NIVEIS[nivelAtual];

    const resetarNivel = () => {
        setRoboPos(nivel.roboInicio);
        setAlgoritmo([]);
        setVenceu(false);
        setFeedback('');
    };

    const adicionarComando = (comandoId) => {
        if (algoritmo.length < 20) {
            setAlgoritmo([...algoritmo, comandoId]);
        }
    };

    const removerComando = (index) => {
        setAlgoritmo(algoritmo.filter((_, i) => i !== index));
    };

    const temLamaAFrente = (x, y, direcao) => {
        let proxX = x, proxY = y;

        if (direcao === 'direita') proxX = x + 1;
        else if (direcao === 'esquerda') proxX = x - 1;
        else if (direcao === 'baixo') proxY = y + 1;
        else if (direcao === 'cima') proxY = y - 1;

        return nivel.lamas.some(lama => lama.x === proxX && lama.y === proxY);
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

            // Verifica se não está tentando pisar na lama
            if (nivel.lamas.some(lama => lama.x === novoX && lama.y === novoY)) {
                return null; // Não pode mover para lama
            }
        }

        return { x: novoX, y: novoY, direcao: novaDirecao };
    };

    const executarAlgoritmo = async () => {
        setExecutando(true);
        setFeedback('');
        let posicaoAtual = nivel.roboInicio;
        let i = 0;

        while (i < algoritmo.length) {
            const comando = algoritmo[i];

            await new Promise(resolve => setTimeout(resolve, 700));

            if (comando === 'se-lama') {
                // Verifica condição
                const temLama = temLamaAFrente(posicaoAtual.x, posicaoAtual.y, posicaoAtual.direcao);

                // Procura o próximo comando (ação dentro do SE)
                if (i + 1 < algoritmo.length) {
                    if (temLama) {
                        // Executa o comando do SE
                        const novaPosicao = moverRobo(posicaoAtual, algoritmo[i + 1]);
                        if (novaPosicao) {
                            posicaoAtual = novaPosicao;
                            setRoboPos(posicaoAtual);
                        }
                        i += 2; // Pula o comando que foi executado

                        // Pula o SENÃO se existir
                        if (i < algoritmo.length && algoritmo[i] === 'senao') {
                            i += 2; // Pula SENÃO e sua ação
                        }
                    } else {
                        // Pula o comando do SE
                        i += 2;

                        // Se tem SENÃO, executa
                        if (i < algoritmo.length && algoritmo[i] === 'senao') {
                            if (i + 1 < algoritmo.length) {
                                const novaPosicao = moverRobo(posicaoAtual, algoritmo[i + 1]);
                                if (novaPosicao) {
                                    posicaoAtual = novaPosicao;
                                    setRoboPos(posicaoAtual);
                                } else {
                                    setFeedback('💥 O robô tentou pisar na lama! Revise seu algoritmo.');
                                    setExecutando(false);
                                    return;
                                }
                                i += 2;
                            } else {
                                i++;
                            }
                        }
                    }
                } else {
                    i++;
                }
            } else if (comando !== 'senao') {
                // Comando normal
                const novaPosicao = moverRobo(posicaoAtual, comando);
                if (novaPosicao) {
                    posicaoAtual = novaPosicao;
                    setRoboPos(posicaoAtual);
                } else {
                    setFeedback('💥 O robô tentou pisar na lama! Revise seu algoritmo.');
                    setExecutando(false);
                    return;
                }
                i++;
            } else {
                i++;
            }
        }

        await new Promise(resolve => setTimeout(resolve, 400));

        if (posicaoAtual.x === nivel.bandeiraPos.x && posicaoAtual.y === nivel.bandeiraPos.y) {
            setVenceu(true);
            setFeedback('🎉 Parabéns! O robô desviou da lama e chegou na bandeira!');
            if (!niveisCompletos.includes(nivelAtual)) {
                setNiveisCompletos([...niveisCompletos, nivelAtual]);
            }
            if (nivelAtual === NIVEIS.length - 1 && niveisCompletos.length === NIVEIS.length - 1) {
                setTimeout(() => onConcluido && onConcluido(), 2000);
            }
        } else {
            setFeedback('❌ Ops! O robô não chegou na bandeira. Revise as condições!');
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
        }
    };

    return (
        <div className="robo-condicoes-container">
            <h2 className="robo-title">🤖 O Robô Coletor - Nível 2: Condições</h2>
            <p className="robo-subtitle">
                Agora o robô precisa <strong>tomar decisões</strong>! Use SE/SENÃO para desviar das poças de lama.
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
                <svg width="400" height="400" viewBox="0 0 400 400" className="grade-svg">
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

                    {/* Lamas */}
                    {nivel.lamas.map((lama, idx) => (
                        <g key={idx} transform={`translate(${lama.x * 80 + 40}, ${lama.y * 80 + 40})`}>
                            <circle cx="0" cy="0" r="35" fill="#78350f" opacity="0.7" />
                            <circle cx="-10" cy="-8" r="12" fill="#92400e" opacity="0.6" />
                            <circle cx="8" cy="5" r="15" fill="#92400e" opacity="0.6" />
                            <circle cx="-5" cy="10" r="10" fill="#92400e" opacity="0.6" />
                            <text x="0" y="10" fontSize="25" textAnchor="middle">💩</text>
                        </g>
                    ))}

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
                            disabled={executando || algoritmo.length >= 20}
                        >
                            <span className="comando-icone">{cmd.icone}</span>
                            <span className="comando-nome">{cmd.nome}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Algoritmo Montado */}
            <div className="algoritmo-section">
                <h4 className="section-title">🎯 Seu Algoritmo (com condições):</h4>
                <div className="algoritmo-lista">
                    {algoritmo.length === 0 ? (
                        <div className="algoritmo-vazio">
                            Monte seu algoritmo usando condições SE/SENÃO...
                        </div>
                    ) : (
                        algoritmo.map((cmdId, idx) => {
                            const cmd = COMANDOS.find(c => c.id === cmdId);
                            const isCondicao = cmd.tipo === 'condicao';

                            return (
                                <div
                                    key={idx}
                                    className={`algoritmo-item ${isCondicao ? 'condicao' : ''}`}
                                    style={{ background: cmd.cor }}
                                >
                                    <span className="algoritmo-numero">{idx + 1}</span>
                                    <span className="algoritmo-icone">{cmd.icone}</span>
                                    <span className="algoritmo-texto">{cmd.nome}</span>
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
                    {algoritmo.length}/20 comandos
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
                        Você dominou as <strong>CONDIÇÕES</strong>! Aprendeu a fazer o robô tomar decisões
                        usando SE/SENÃO.
                    </p>
                    <div className="conceito-box">
                        <strong>💡 Conceito Aprendido:</strong>
                        <p>
                            CONDIÇÕES (ou Seleções) permitem que o algoritmo tome decisões diferentes
                            baseado em uma situação. SE algo é verdade, faça X. SENÃO, faça Y!
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
import React, { useState } from 'react';
import './RoboSequencias.css';

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
            {/* Corpo do robô */}
            <rect x="-20" y="-25" width="40" height="50" fill="#3b82f6" rx="5" />
            {/* Cabeça */}
            <rect x="-15" y="-35" width="30" height="25" fill="#60a5fa" rx="3" />
            {/* Olhos */}
            <circle cx="-8" cy="-25" r="3" fill="white" />
            <circle cx="8" cy="-25" r="3" fill="white" />
            <circle cx="-8" cy="-25" r="1.5" fill="#1e293b" />
            <circle cx="8" cy="-25" r="1.5" fill="#1e293b" />
            {/* Antena */}
            <line x1="0" y1="-35" x2="0" y2="-42" stroke="#1e293b" strokeWidth="2" />
            <circle cx="0" cy="-42" r="3" fill="#ef4444" />
            {/* Braços */}
            <rect x="-25" y="-15" width="5" height="20" fill="#60a5fa" rx="2" />
            <rect x="20" y="-15" width="5" height="20" fill="#60a5fa" rx="2" />
            {/* Pernas */}
            <rect x="-15" y="25" width="10" height="15" fill="#1e40af" rx="2" />
            <rect x="5" y="25" width="10" height="15" fill="#1e40af" rx="2" />
            {/* Detalhes do corpo */}
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
            {/* Mastro */}
            <rect x="-2" y="-35" width="4" height="60" fill="#78350f" />
            {/* Bandeira */}
            <path d="M 2,-30 L 2,-10 L 25,-20 Z" fill="#ef4444" />
            <path d="M 2,-30 L 2,-10 L 25,-20 Z" fill="none" stroke="#991b1b" strokeWidth="1" />
        </g>
    );
}

// Comandos disponíveis
const COMANDOS = [
    { id: 'avancar', nome: 'Avançar', icone: '⬆️', cor: '#3b82f6' },
    { id: 'direita', nome: 'Virar à Direita', icone: '➡️', cor: '#10b981' },
    { id: 'esquerda', nome: 'Virar à Esquerda', icone: '⬅️', cor: '#f59e0b' }
];

// Níveis do jogo
const NIVEIS = [
    {
        id: 1,
        titulo: 'Nível 1: Caminho Reto',
        grade: 5,
        roboInicio: { x: 0, y: 2, direcao: 'direita' },
        bandeiraPos: { x: 4, y: 2 },
        solucao: ['avancar', 'avancar', 'avancar', 'avancar']
    },
    {
        id: 2,
        titulo: 'Nível 2: Uma Curva',
        grade: 5,
        roboInicio: { x: 0, y: 4, direcao: 'direita' },
        bandeiraPos: { x: 4, y: 0 },
        solucao: ['avancar', 'avancar', 'esquerda', 'avancar', 'avancar', 'avancar', 'avancar']
    },
    {
        id: 3,
        titulo: 'Nível 3: Zigue-Zague',
        grade: 5,
        roboInicio: { x: 0, y: 2, direcao: 'direita' },
        bandeiraPos: { x: 4, y: 4 },
        solucao: ['avancar', 'avancar', 'direita', 'avancar', 'direita', 'avancar', 'avancar']
    }
];

export default function RoboSequencias({ onConcluido }) {
    const [nivelAtual, setNivelAtual] = useState(0);
    const [algoritmo, setAlgoritmo] = useState([]);
    const [roboPos, setRoboPos] = useState(NIVEIS[0].roboInicio);
    const [executando, setExecutando] = useState(false);
    const [venceu, setVenceu] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [niveisCompletos, setNiveisCompletos] = useState([]);

    const nivel = NIVEIS[nivelAtual];

    const resetarNivel = () => {
        setRoboPos(nivel.roboInicio);
        setAlgoritmo([]);
        setVenceu(false);
        setFeedback('');
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

        for (let i = 0; i < algoritmo.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 600));
            posicaoAtual = moverRobo(posicaoAtual, algoritmo[i]);
            setRoboPos(posicaoAtual);
        }

        await new Promise(resolve => setTimeout(resolve, 400));

        if (posicaoAtual.x === nivel.bandeiraPos.x && posicaoAtual.y === nivel.bandeiraPos.y) {
            setVenceu(true);
            setFeedback('🎉 Parabéns! O robô chegou na bandeira!');
            if (!niveisCompletos.includes(nivelAtual)) {
                setNiveisCompletos([...niveisCompletos, nivelAtual]);
            }
            if (nivelAtual === NIVEIS.length - 1 && niveisCompletos.length === NIVEIS.length - 1) {
                setTimeout(() => onConcluido && onConcluido(), 2000);
            }
        } else {
            setFeedback('❌ Ops! O robô não chegou na bandeira. Tente novamente!');
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
        }
    };

    return (
        <div className="robo-container">
            <h2 className="robo-title">🤖 O Robô Coletor - Nível 1: Sequências</h2>
            <p className="robo-subtitle">
                Monte a sequência de comandos para o robô chegar na bandeira!
                <strong> A ordem dos passos é muito importante!</strong>
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

            {/* Comandos Disponíveis */}
            <div className="comandos-section">
                <h4 className="section-title">📦 Comandos Disponíveis:</h4>
                <div className="comandos-grid">
                    {COMANDOS.map(cmd => (
                        <button
                            key={cmd.id}
                            className="comando-btn"
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
                <h4 className="section-title">🎯 Seu Algoritmo (sequência de passos):</h4>
                <div className="algoritmo-lista">
                    {algoritmo.length === 0 ? (
                        <div className="algoritmo-vazio">
                            Clique nos comandos acima para montar seu algoritmo...
                        </div>
                    ) : (
                        algoritmo.map((cmdId, idx) => {
                            const cmd = COMANDOS.find(c => c.id === cmdId);
                            return (
                                <div key={idx} className="algoritmo-item" style={{ background: cmd.cor }}>
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
                    {algoritmo.length}/15 comandos
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
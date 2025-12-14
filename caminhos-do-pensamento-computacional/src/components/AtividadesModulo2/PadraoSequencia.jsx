// Atividade 1 do Módulo 2: Reconhecimento de Padrões

import React, { useState, useEffect } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import './PadraoSequencia.css';

// Desafios com linguagem simplificada
const DESAFIOS = [
    {
        id: 1,
        titulo: 'Padrão de Formas',
        sequencia: ['💠', '🟡', '💠', '🟡', '💠', '?'],
        opcoes: ['💠', '🟡', '🔺'],
        resposta: '🟡',
        dica: 'Veja as cores: Azul, Amarelo, Azul, Amarelo...',
        explicacao: 'Isso mesmo! Um azul, depois um amarelo. O padrão se repete!'
    },
    {
        id: 2,
        titulo: 'Padrão de Cores',
        sequencia: ['🔴', '🔴', '🟢', '🔴', '🔴', '?'],
        opcoes: ['🔴', '🟢', '🟡'],
        resposta: '🟢',
        dica: 'Temos dois vermelhos e depois um verde...',
        explicacao: 'Exato! A regra é: dois vermelhos, um verde.'
    },
    {
        id: 3,
        titulo: 'Padrão de Números',
        sequencia: ['1️⃣', '2️⃣', '1️⃣', '2️⃣', '1️⃣', '?'],
        opcoes: ['1️⃣', '2️⃣', '3️⃣'],
        resposta: '2️⃣',
        dica: 'Eles vão trocando a vez: 1, depois 2, depois 1...',
        explicacao: 'Perfeito! Os números vão trocando um pelo outro.'
    },
    {
        id: 4,
        titulo: 'Desafio das Estrelas',
        sequencia: ['⭐', '⭐', '❤️', '⭐', '⭐', '❤️', '⭐', '?'],
        opcoes: ['⭐', '❤️', '🌙'],
        resposta: '⭐',
        dica: 'Duas estrelas, um coração. O que vem depois do coração?',
        explicacao: 'Muito bem! Depois do coração, o padrão começa de novo com estrela.'
    },
    {
        id: 5,
        titulo: 'Padrão de 3 Cores',
        sequencia: ['🔵', '🟡', '🔴', '🔵', '🟡', '🔴', '🔵', '?'],
        opcoes: ['🔵', '🟡', '🔴'],
        resposta: '🟡',
        dica: 'Azul, amarelo, vermelho... E começa tudo de novo!',
        explicacao: 'Isso! São três cores que se repetem sempre na mesma ordem.'
    }
];

// Função para embaralhar array (Fisher-Yates)
function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Componente de item arrastável
function DraggableItem({ id, emoji, isUsed }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id,
        disabled: isUsed
    });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        opacity: isUsed ? 0.3 : 1,
        cursor: isUsed ? 'not-allowed' : 'grab'
    };

    return (
        <div
            ref={setNodeRef}
            className={`opcao-emoji ${isDragging ? 'dragging' : ''} ${isUsed ? 'usado' : ''}`}
            style={style}
            {...(isUsed ? {} : listeners)}
            {...(isUsed ? {} : attributes)}
        >
            {emoji}
        </div>
    );
}

// Componente da caixa de destino
function DropZone({ children, isOver }) {
    const { setNodeRef } = useDroppable({ id: 'resposta-slot' });

    return (
        <div
            ref={setNodeRef}
            className={`slot-resposta ${isOver ? 'over' : ''}`}
        >
            {children}
        </div>
    );
}

export default function PadraoSequencia({ onConcluido }) {
    const [desafioAtual, setDesafioAtual] = useState(0);
    const [respostaColocada, setRespostaColocada] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [mostrarDica, setMostrarDica] = useState(false);
    const [mostrarExplicacao, setMostrarExplicacao] = useState(false);
    const [acertos, setAcertos] = useState(0);
    const [tentativas, setTentativas] = useState(0);
    const [shake, setShake] = useState(false);
    const [concluido, setConcluido] = useState(false);
    
    // Estado para as opções embaralhadas
    const [opcoesEmbaralhadas, setOpcoesEmbaralhadas] = useState([]);

    const desafio = DESAFIOS[desafioAtual];
    const ultimoDesafio = desafioAtual === DESAFIOS.length - 1;

    // Embaralha as opções sempre que o desafio mudar
    useEffect(() => {
        if (desafio) {
            setOpcoesEmbaralhadas(shuffle(desafio.opcoes));
        }
    }, [desafioAtual]);

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over || over.id !== 'resposta-slot') {
            return;
        }

        const emojiArrastado = active.id;
        setRespostaColocada(emojiArrastado);
        setTentativas(prev => prev + 1);

        if (emojiArrastado === desafio.resposta) {
            setFeedback('correct');
            setAcertos(prev => prev + 1);
            setMostrarExplicacao(true);
        } else {
            setFeedback('incorrect');
            setShake(true);
            setTimeout(() => {
                setShake(false);
                setRespostaColocada(null);
                setFeedback('');
            }, 800);
        }
    };

    const proximoDesafio = () => {
        if (ultimoDesafio) {
            setConcluido(true);
            onConcluido && onConcluido();
        } else {
            setDesafioAtual(prev => prev + 1);
            setRespostaColocada(null);
            setFeedback('');
            setMostrarDica(false);
            setMostrarExplicacao(false);
        }
    };

    return (
        <div className="atividade-container padrao-sequencia-container">
            <h3>🔍🔢 Complete a Sequência</h3>
            <p className="instrucoes">
                Descubra o padrão e arraste a forma correta para o quadrado vazio para completar a sequência!
            </p>

            {!concluido ? (
                <>
                    <div className="desafio-header">
                        <h4>{desafio.titulo}</h4>
                        <div className="contador-desafios">
                            Desafio {desafioAtual + 1} de {DESAFIOS.length}
                        </div>
                    </div>

                    <DndContext onDragEnd={handleDragEnd}>
                        {/* Trilho da sequência */}
                        <div className="trilho-sequencia">
                            {desafio.sequencia.map((item, i) => (
                                <div
                                    key={i}
                                    className={`item-sequencia ${item === '?' ? 'slot-vazio' : ''} ${shake && item === '?' ? 'shake' : ''
                                        }`}
                                >
                                    {item === '?' ? (
                                        <DropZone>
                                            {respostaColocada ? (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className={`resposta-colocada ${feedback}`}
                                                >
                                                    {respostaColocada}
                                                </motion.div>
                                            ) : (
                                                <span className="interrogacao">?</span>
                                            )}
                                        </DropZone>
                                    ) : (
                                        item
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Caixa de ferramentas (Opções Embaralhadas) */}
                        <div className="caixa-ferramentas">
                            <h5>Arraste a resposta:</h5>
                            <div className="opcoes-grid">
                                {opcoesEmbaralhadas.map((opcao, i) => (
                                    <DraggableItem
                                        key={i}
                                        id={opcao}
                                        emoji={opcao}
                                        isUsed={respostaColocada === opcao && feedback === 'correct'}
                                    />
                                ))}
                            </div>
                        </div>
                    </DndContext>

                    {/* Botão de dica */}
                    {!mostrarDica && feedback !== 'correct' && (
                        <button
                            className="btn-dica1"
                            onClick={() => setMostrarDica(true)}
                        >
                            💡 Precisa de uma dica?
                        </button>
                    )}

                    {/* Dica */}
                    {mostrarDica && feedback !== 'correct' && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="dica-box"
                        >
                            <strong>💡 Dica:</strong> {desafio.dica}
                        </motion.div>
                    )}

                    {/* Explicação após acerto */}
                    {mostrarExplicacao && feedback === 'correct' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="explicacao-box"
                        >
                            <div className="explicacao-header">
                                <span className="check-icon">✅</span>
                                <strong>Muito bem!</strong>
                            </div>
                            <p>{desafio.explicacao}</p>
                            <button className="btn" onClick={proximoDesafio}>
                                {ultimoDesafio ? 'Finalizar' : 'Próximo Desafio'}
                            </button>
                        </motion.div>
                    )}

                    {/* Estatísticas */}
                    <div className="estatisticas">
                        <div className="stat">
                            <span className="stat-label">Acertos:</span>
                            <span className="stat-valor">{acertos}/{desafioAtual + 1}</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Tentativas:</span>
                            <span className="stat-valor">{tentativas}</span>
                        </div>
                    </div>
                </>
            ) : (
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="feedback sucesso"
                    >
                        <h3>🎉 Parabéns!</h3>
                        <p>
                            Você completou todos os desafios de sequência!
                        </p>
                        <p>
                            <strong>Desempenho:</strong> {acertos} acertos em {tentativas} tentativas
                        </p>
                        <p>
                            Você demonstrou excelente habilidade em reconhecer padrões!
                            <br></br>Você é um <strong>Mestre dos Padrões!</strong> 🌟
                        </p>
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
}
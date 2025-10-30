// Atividade 1 do Módulo 3: Abstração - O Mapa do Bairro

import React, { useState } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import './MapaBairro.css';

// Elementos disponíveis
const ELEMENTOS = [
    { id: 'escola', emoji: '🏫', nome: 'Escola', essencial: true },
    { id: 'padaria', emoji: '🥖', nome: 'Padaria', essencial: true },
    { id: 'hospital', emoji: '🏥', nome: 'Hospital', essencial: true },
    { id: 'parque', emoji: '🌳', nome: 'Parque', essencial: true },
    { id: 'arvore', emoji: '🌲', nome: 'Árvore', essencial: false },
    { id: 'carro', emoji: '🚗', nome: 'Carro', essencial: false },
    { id: 'nuvem', emoji: '☁️', nome: 'Nuvem', essencial: false },
    { id: 'pessoa', emoji: '🚶', nome: 'Pessoa', essencial: false },
];

// Posições corretas no mapa (grade 3x3)
const POSICOES_CORRETAS = {
    escola: { row: 0, col: 0 },
    hospital: { row: 0, col: 2 },
    padaria: { row: 1, col: 1 },
    parque: { row: 2, col: 1 }
};

// Elemento arrastável
function DraggableIcon({ elemento, isUsed }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: elemento.id,
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
            className={`icone-item ${isDragging ? 'dragging' : ''} ${isUsed ? 'usado' : ''}`}
            style={style}
            {...(isUsed ? {} : listeners)}
            {...(isUsed ? {} : attributes)}
            title={elemento.nome}
        >
            <div className="icone-emoji">{elemento.emoji}</div>
            <div className="icone-nome">{elemento.nome}</div>
        </div>
    );
}

// Slot da grade
function MapSlot({ row, col, children, isOver }) {
    const { setNodeRef } = useDroppable({ id: `slot-${row}-${col}` });

    return (
        <div
            ref={setNodeRef}
            className={`map-slot ${isOver ? 'over' : ''}`}
        >
            {children}
        </div>
    );
}

export default function MapaBairro({ onConcluido }) {
    const [elementosColocados, setElementosColocados] = useState({});
    const [shake, setShake] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [tentativasErradas, setTentativasErradas] = useState(0);
    const [concluido, setConcluido] = useState(false);

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over) return;

        const elementoId = active.id;
        const elemento = ELEMENTOS.find(el => el.id === elementoId);

        if (!elemento) return;

        // Verifica se é essencial
        if (!elemento.essencial) {
            // Elemento não essencial - feedback de erro
            setShake(elementoId);
            setFeedback(`${elemento.nome} não é essencial para o mapa! Pense: um turista precisa saber disso?`);
            setTentativasErradas(prev => prev + 1);

            setTimeout(() => {
                setShake(null);
                setFeedback('');
            }, 2500);
            return;
        }

        // Elemento essencial - adiciona ao mapa
        const slotId = over.id;
        const [, rowStr, colStr] = slotId.split('-');
        const row = parseInt(rowStr);
        const col = parseInt(colStr);

        setElementosColocados(prev => ({
            ...prev,
            [elementoId]: { row, col }
        }));

        setFeedback(`Ótimo! ${elemento.nome} é importante para o mapa! ✅`);
        setTimeout(() => setFeedback(''), 2000);
    };

    // Verifica se completou
    const elementosEssenciais = ELEMENTOS.filter(el => el.essencial);
    const todosColocados = elementosEssenciais.every(el => elementosColocados[el.id]);

    React.useEffect(() => {
        if (todosColocados && !concluido) {
            setConcluido(true);
            onConcluido && onConcluido();
        }
    }, [todosColocados, concluido, onConcluido]);

    return (
        <div className="atividade-container mapa-bairro-container">
            <h3>🗺️ Atividade: O Mapa do Bairro</h3>
            <p className="instrucoes">
                Você é um cartógrafo! Crie um mapa para turistas arrastando apenas os
                <strong> locais importantes</strong>. Ignore detalhes desnecessários!
            </p>

            <DndContext onDragEnd={handleDragEnd}>
                <div className="mapa-principal">
                    {/* Lado Esquerdo: Bairro Realista */}
                    <div className="bairro-realista">
                        <div className="bairro-header">
                            <h4>🏙️ Bairro Real (cheio de detalhes)</h4>
                        </div>
                        <div className="bairro-ilustracao">
                            <div className="bairro-background">
                                {/* Rua horizontal no meio */}
                                <div className="rua-horizontal"></div>
                                <div className="linha-rua"></div>

                                {/* Elementos essenciais em posições que fazem sentido */}
                                <div className="elemento-fixo escola-pos">🏫</div>
                                <div className="elemento-fixo hospital-pos">🏥</div>
                                <div className="elemento-fixo padaria-pos">🥖</div>
                                <div className="elemento-fixo parque-pos">🌳</div>

                                {/* Elementos decorativos */}
                                <div className="elemento-decorativo nuvem-pos">☁️</div>
                                <div className="elemento-decorativo carro-pos">🚗</div>
                                <div className="elemento-decorativo pessoa-pos">🚶</div>
                                <div className="elemento-decorativo arvore-pos">🌲</div>
                            </div>
                        </div>
                    </div>

                    {/* Lado Direito: Mapa Abstrato */}
                    <div className="mapa-abstrato">
                        <div className="mapa-header">
                            <h4>🗺️ Seu Mapa (apenas o essencial)</h4>
                        </div>
                        <div className="grade-mapa">
                            {/* Rua no mapa abstrato também */}
                            <div className="rua-mapa-horizontal"></div>
                            <div className="linha-rua-mapa"></div>

                            {[0, 1, 2].map(row => (
                                [0, 1, 2].map(col => {
                                    const elementoNaGrade = Object.entries(elementosColocados)
                                        .find(([, pos]) => pos.row === row && pos.col === col);

                                    return (
                                        <MapSlot key={`${row}-${col}`} row={row} col={col}>
                                            {elementoNaGrade && (
                                                <motion.div
                                                    initial={{ scale: 0, rotate: -180 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    className="elemento-no-mapa"
                                                >
                                                    {ELEMENTOS.find(el => el.id === elementoNaGrade[0])?.emoji}
                                                </motion.div>
                                            )}
                                        </MapSlot>
                                    );
                                })
                            ))}
                        </div>
                    </div>
                </div>

                {/* Barra de Ícones */}
                <div className="barra-icones">
                    <h5>📦 Arraste os elementos para o mapa:</h5>
                    <div className="icones-grid">
                        {ELEMENTOS.map(elemento => (
                            <DraggableIcon
                                key={elemento.id}
                                elemento={elemento}
                                isUsed={!!elementosColocados[elemento.id]}
                            />
                        ))}
                    </div>
                </div>
            </DndContext>

            {/* Feedback */}
            {feedback && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`feedback-mapa ${feedback.includes('não é essencial') ? 'erro' : 'sucesso'}`}
                >
                    {feedback}
                </motion.div>
            )}

            {/* Dica */}
            {tentativasErradas >= 2 && !concluido && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="dica-box"
                >
                    <strong>💡 Dica:</strong> Pense: o que um turista PRECISA encontrar?
                    Escola, Padaria, Hospital e Parque são locais. Nuvens, carros e árvores são apenas decoração!
                </motion.div>
            )}

            {/* Progresso */}
            <div className="progresso-mapa">
                <div className="progresso-texto">
                    Locais essenciais no mapa: {Object.keys(elementosColocados).length} / {elementosEssenciais.length}
                </div>
                <div className="progresso-bar-container">
                    <div
                        className="progresso-bar-fill"
                        style={{ width: `${(Object.keys(elementosColocados).length / elementosEssenciais.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Conclusão */}
            {concluido && (
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="feedback sucesso"
                    >
                        <h3>🎉 Parabéns, Cartógrafo!</h3>
                        <p>
                            Você criou um mapa perfeito! Entendeu que um mapa é uma <strong>abstração</strong>
                            — ele ignora detalhes desnecessários e foca apenas nos locais importantes.
                        </p>
                        <p className="destaque-conceito">
                            💡 <strong>Abstração é filtrar o que não importa e focar no essencial!</strong>
                        </p>
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
}
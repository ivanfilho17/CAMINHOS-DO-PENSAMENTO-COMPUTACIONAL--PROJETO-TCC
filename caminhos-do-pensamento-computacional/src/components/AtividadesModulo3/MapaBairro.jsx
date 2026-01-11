// Atividade 1 do Módulo 3: Abstração - O Mapa do Bairro

import React, { useState, useEffect } from 'react';
// 1. IMPORTAR O HOOK
import { useLocalStorage } from "../../hooks/useLocalStorage";
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

// Função para embaralhar array
function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

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
    // 2. SUBSTITUIR useState POR useLocalStorage
    const [elementosColocados, setElementosColocados] = useLocalStorage("mod3_mapa_colocados", {});
    const [concluido, setConcluido] = useLocalStorage("mod3_mapa_concluido", false);
    const [tentativasErradas, setTentativasErradas] = useLocalStorage("mod3_mapa_tentativas", 0);
    
    // Persistir a ordem embaralhada para consistência visual no F5
    const [elementosEmbaralhados, setElementosEmbaralhados] = useLocalStorage("mod3_mapa_embaralhado", []);

    // Estados visuais temporários (não precisam persistir)
    const [shake, setShake] = useState(null);
    const [feedback, setFeedback] = useState('');
    
    // Embaralha ao iniciar SE não houver dados salvos
    useEffect(() => {
        if (elementosEmbaralhados.length === 0) {
            setElementosEmbaralhados(shuffle(ELEMENTOS));
        }
    }, [elementosEmbaralhados.length]);

    // Se já estiver concluído ao montar, avisa o pai
    useEffect(() => {
        if (concluido) {
            onConcluido?.();
        }
    }, [concluido, onConcluido]);

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
            setFeedback(`Opa! ${elemento.nome} é só um detalhe. Um mapa precisa ser simples!`);
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

        setFeedback(`Isso aí! ${elemento.nome} é um lugar importante! ✅`);
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
            <h2>🗺️ Criando o Mapa do Bairro</h2>
            <p className="instrucoes">
                Ajude o turista! Arraste para o mapa apenas os <strong>lugares importantes</strong> que ele precisa encontrar.
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
                            <h4>🗺️ Seu Mapa (apenas o importante)</h4>
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

                {/* Barra de Ícones (Usando o array embaralhado salvo) */}
                <div className="barra-icones">
                    <h5>📦 Arraste apenas o que deve ir para o mapa:</h5>
                    <div className="icones-grid">
                        {elementosEmbaralhados.map(elemento => (
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
                    className={`feedback-mapa ${feedback.includes('detalhe') ? 'erro' : 'sucesso'}`}
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
                    <strong>💡 Dica:</strong> O que ajuda a encontrar o caminho? Prédios e lugares fixos! Carros, pessoas e nuvens mudam de lugar, então não servem para o mapa.
                </motion.div>
            )}

            {/* Progresso */}
            <div className="progresso-mapa">
                <div className="progresso-texto">
                    Locais importantes no mapa: {Object.keys(elementosColocados).length} / {elementosEssenciais.length}
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
                        <h3>🎉 Parabéns!</h3>
                        <p>
                            Você criou um mapa perfeito! Entendeu que um mapa é uma <strong>abstração </strong>
                            — ele ignora detalhes desnecessários e foca apenas nos locais importantes.
                        </p>
                        <p className="destaque-conceito">
                            💡 <strong>Abstração é filtrar o que não importa e focar no essencial!</strong> <br></br> Você ignorou os detalhes e focou só no que era importante!
                        </p>
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
}
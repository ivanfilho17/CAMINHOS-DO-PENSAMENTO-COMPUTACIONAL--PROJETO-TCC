// Atividade 2 do Módulo 2: Classificação por Padrões

import React, { useState, useEffect } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import './DetetiveObjetos.css';

// Desafios de classificação
const DESAFIOS = [
    {
        id: 1,
        titulo: 'Veículos com Rodas',
        regra: 'Somente o que tem RODAS',
        objetos: [
            { id: 'carro', emoji: '🚗', correto: true, nome: 'Carro' },
            { id: 'moto', emoji: '🏍️', correto: true, nome: 'Moto' },
            { id: 'aviao', emoji: '✈️', correto: false, nome: 'Avião' },
            { id: 'barco', emoji: '⛵', correto: false, nome: 'Barco' },
            { id: 'bicicleta', emoji: '🚲', correto: true, nome: 'Bicicleta' },
            { id: 'trem', emoji: '🚂', correto: true, nome: 'Trem' },
            { id: 'helicoptero', emoji: '🚁', correto: false, nome: 'Helicóptero' },
            { id: 'patinete', emoji: '🛴', correto: true, nome: 'Patinete' }
        ]
    },
    {
        id: 2,
        titulo: 'Alimentos Doces',
        regra: 'Somente DOCES',
        objetos: [
            { id: 'bolo', emoji: '🍰', correto: true, nome: 'Bolo' },
            { id: 'pizza', emoji: '🍕', correto: false, nome: 'Pizza' },
            { id: 'sorvete', emoji: '🍦', correto: true, nome: 'Sorvete' },
            { id: 'hamburguer', emoji: '🍔', correto: false, nome: 'Hambúrguer' },
            { id: 'donut', emoji: '🍩', correto: true, nome: 'Donut' },
            { id: 'chocolate', emoji: '🍫', correto: true, nome: 'Chocolate' },
            { id: 'batata', emoji: '🍟', correto: false, nome: 'Batata Frita' },
            { id: 'cupcake', emoji: '🧁', correto: true, nome: 'Cupcake' }
        ]
    },
    {
        id: 3,
        titulo: 'Animais que Voam',
        regra: 'Somente o que VOA',
        objetos: [
            { id: 'passaro', emoji: '🐦', correto: true, nome: 'Pássaro' },
            { id: 'cachorro', emoji: '🐕', correto: false, nome: 'Cachorro' },
            { id: 'borboleta', emoji: '🦋', correto: true, nome: 'Borboleta' },
            { id: 'peixe', emoji: '🐠', correto: false, nome: 'Peixe' },
            { id: 'aguia', emoji: '🦅', correto: true, nome: 'Águia' },
            { id: 'gato', emoji: '🐈', correto: false, nome: 'Gato' },
            { id: 'abelha', emoji: '🐝', correto: true, nome: 'Abelha' },
            { id: 'coelho', emoji: '🐰', correto: false, nome: 'Coelho' }
        ]
    }
];

// Componente de objeto arrastável
function DraggableObject({ objeto, isPlaced }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: objeto.id,
        disabled: isPlaced
    });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        opacity: isPlaced ? 0 : 1,
        cursor: isPlaced ? 'default' : 'grab'
    };

    return (
        <div
            ref={setNodeRef}
            className={`objeto-item ${isDragging ? 'dragging' : ''}`}
            style={style}
            {...(isPlaced ? {} : listeners)}
            {...(isPlaced ? {} : attributes)}
            title={objeto.nome}
        >
            <div className="objeto-emoji">{objeto.emoji}</div>
            <div className="objeto-nome">{objeto.nome}</div>
        </div>
    );
}

// Componente de zona de soltar
function DropZone({ id, titulo, children, isOver, count }) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className={`drop-zone ${id} ${isOver ? 'over' : ''}`}
        >
            <div className="drop-zone-header">
                <h5>{titulo}</h5>
                <span className="drop-count">{count}</span>
            </div>
            <div className="drop-zone-content">
                {children}
            </div>
        </div>
    );
}

export default function DetetiveObjetos({ onConcluido }) {
    const [desafioAtual, setDesafioAtual] = useState(0);
    const [objetosColocados, setObjetosColocados] = useState({ garagem: [], descarte: [] });
    const [feedback, setFeedback] = useState(null);
    const [shake, setShake] = useState(null);
    const [concluido, setConcluido] = useState(false);
    const [acertos, setAcertos] = useState(0);

    const desafio = DESAFIOS[desafioAtual];
    const ultimoDesafio = desafioAtual === DESAFIOS.length - 1;

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over || !active) return;

        const objetoId = active.id;
        const zona = over.id; // 'garagem' ou 'descarte'
        const objeto = desafio.objetos.find(obj => obj.id === objetoId);

        if (!objeto) return;

        // Adiciona o objeto à zona
        setObjetosColocados(prev => ({
            ...prev,
            [zona]: [...prev[zona], objeto]
        }));

        // Verifica se a classificação está correta
        const correto = (zona === 'garagem' && objeto.correto) ||
            (zona === 'descarte' && !objeto.correto);

        if (!correto) {
            setShake(objetoId);
            setTimeout(() => setShake(null), 600);
        }
    };

    // Verifica se o desafio foi completado
    useEffect(() => {
        const totalColocados = objetosColocados.garagem.length + objetosColocados.descarte.length;

        if (totalColocados === desafio.objetos.length) {
            // Verifica se todos estão corretos
            const todosCorretos =
                objetosColocados.garagem.every(obj => obj.correto) &&
                objetosColocados.descarte.every(obj => !obj.correto);

            if (todosCorretos) {
                setFeedback('sucesso');
                setAcertos(prev => prev + 1);
            } else {
                setFeedback('erro');
            }
        }
    }, [objetosColocados, desafio.objetos.length]);

    const proximoDesafio = () => {
        if (ultimoDesafio) {
            setConcluido(true);
            onConcluido && onConcluido();
        } else {
            setDesafioAtual(prev => prev + 1);
            setObjetosColocados({ garagem: [], descarte: [] });
            setFeedback(null);
        }
    };

    const reiniciarDesafio = () => {
        setObjetosColocados({ garagem: [], descarte: [] });
        setFeedback(null);
    };

    const objetosDisponiveis = desafio.objetos.filter(
        obj => !objetosColocados.garagem.includes(obj) &&
            !objetosColocados.descarte.includes(obj)
    );

    return (
        <div className="atividade-container detetive-objetos-container">
            <h3>🔎 Atividade: O Detetive dos Objetos</h3>
            <p className="instrucoes">
                Classifique os objetos seguindo a regra! Arraste para a garagem ou para o descarte.
            </p>

            {!concluido ? (
                <>
                    <div className="desafio-header">
                        <h4>{desafio.titulo}</h4>
                        <div className="contador-desafios">
                            Desafio {desafioAtual + 1} de {DESAFIOS.length}
                        </div>
                    </div>

                    {/* Regra do desafio */}
                    <div className="regra-box">
                        <div className="regra-icon">📋</div>
                        <div className="regra-texto">
                            <strong>Regra:</strong> {desafio.regra}
                        </div>
                    </div>

                    <DndContext onDragEnd={handleDragEnd}>
                        {/* Área de objetos disponíveis */}
                        <div className="area-objetos">
                            <h5>Objetos para classificar:</h5>
                            <div className="objetos-grid">
                                {objetosDisponiveis.map(objeto => (
                                    <DraggableObject
                                        key={objeto.id}
                                        objeto={objeto}
                                        isPlaced={false}
                                    />
                                ))}
                            </div>
                            {objetosDisponiveis.length === 0 && !feedback && (
                                <p className="texto-vazio">Todos os objetos foram classificados!</p>
                            )}
                        </div>

                        {/* Zonas de classificação */}
                        <div className="zonas-classificacao">
                            <DropZone
                                id="garagem"
                                titulo="✅ Garagem (Segue a regra)"
                                count={objetosColocados.garagem.length}
                            >
                                {objetosColocados.garagem.map(objeto => (
                                    <div
                                        key={objeto.id}
                                        className={`objeto-colocado ${shake === objeto.id ? 'shake' : ''}`}
                                    >
                                        <div className="objeto-emoji">{objeto.emoji}</div>
                                        <div className="objeto-nome-mini">{objeto.nome}</div>
                                    </div>
                                ))}
                            </DropZone>

                            <DropZone
                                id="descarte"
                                titulo="❌ Descarte (Não segue a regra)"
                                count={objetosColocados.descarte.length}
                            >
                                {objetosColocados.descarte.map(objeto => (
                                    <div
                                        key={objeto.id}
                                        className={`objeto-colocado ${shake === objeto.id ? 'shake' : ''}`}
                                    >
                                        <div className="objeto-emoji">{objeto.emoji}</div>
                                        <div className="objeto-nome-mini">{objeto.nome}</div>
                                    </div>
                                ))}
                            </DropZone>
                        </div>
                    </DndContext>

                    {/* Feedback */}
                    {feedback === 'sucesso' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="feedback-box sucesso"
                        >
                            <div className="feedback-icon">🎉</div>
                            <h4>Perfeito, Detetive!</h4>
                            <p>Você classificou todos os objetos corretamente!</p>
                            <button className="btn" onClick={proximoDesafio}>
                                {ultimoDesafio ? 'Finalizar' : 'Próximo Desafio'}
                            </button>
                        </motion.div>
                    )}

                    {feedback === 'erro' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="feedback-box erro"
                        >
                            <div className="feedback-icon">😕</div>
                            <h4>Ops! Alguns objetos estão no lugar errado.</h4>
                            <p>Revise a regra e tente novamente!</p>
                            <button className="btn" onClick={reiniciarDesafio}>
                                Tentar Novamente
                            </button>
                        </motion.div>
                    )}

                    {/* Progresso */}
                    <div className="progresso-classificacao">
                        <div className="progresso-bar-container">
                            <div
                                className="progresso-bar-fill"
                                style={{
                                    width: `${(objetosColocados.garagem.length + objetosColocados.descarte.length) / desafio.objetos.length * 100}%`
                                }}
                            />
                        </div>
                        <p className="progresso-texto">
                            {objetosColocados.garagem.length + objetosColocados.descarte.length} / {desafio.objetos.length} classificados
                        </p>
                    </div>
                </>
            ) : (
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="feedback sucesso"
                    >
                        <h3>🏆 Detetive Expert!</h3>
                        <p>
                            Você completou todos os desafios de classificação!
                        </p>
                        <p>
                            <strong>Desempenho:</strong> {acertos} de {DESAFIOS.length} perfeitos
                        </p>
                        <p>
                            Você demonstrou excelente habilidade em identificar padrões e classificar objetos! 🌟
                        </p>
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
}
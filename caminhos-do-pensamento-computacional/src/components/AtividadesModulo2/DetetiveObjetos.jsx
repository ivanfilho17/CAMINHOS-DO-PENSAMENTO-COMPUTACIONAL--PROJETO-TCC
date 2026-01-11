// Atividade 2 do Módulo 2: Classificação por Padrões

import React, { useState, useEffect } from 'react';
// 1. IMPORTAR O HOOK
import { useLocalStorage } from "../../hooks/useLocalStorage";
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

// Função para embaralhar
function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

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
    // 2. SUBSTITUIR useState POR useLocalStorage
    const [desafioAtual, setDesafioAtual] = useLocalStorage("mod2_detetive_desafio", 0);
    const [objetosColocados, setObjetosColocados] = useLocalStorage("mod2_detetive_colocados", { zonaCerta: [], zonaErrada: [] });
    const [concluido, setConcluido] = useLocalStorage("mod2_detetive_concluido", false);
    const [acertos, setAcertos] = useLocalStorage("mod2_detetive_acertos", 0);

    // Estados visuais temporários (não persistidos)
    const [feedback, setFeedback] = useState(null);
    const [shake, setShake] = useState(null);
    const [objetosDaFase, setObjetosDaFase] = useState([]);

    const desafio = DESAFIOS[desafioAtual] || DESAFIOS[0]; // Proteção contra índice inválido
    const ultimoDesafio = desafioAtual === DESAFIOS.length - 1;

    // Se já estiver concluído ao montar, avisa o pai
    useEffect(() => {
        if (concluido) {
            onConcluido?.();
        }
    }, [concluido, onConcluido]);

    // Embaralha os objetos sempre que mudar de desafio
    useEffect(() => {
        if (desafio) {
            setObjetosDaFase(shuffle(desafio.objetos));
        }
    }, [desafioAtual]); // Simplificado para depender apenas do índice

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over || !active) return;

        const objetoId = active.id;
        const zona = over.id; // 'zonaCerta' ou 'zonaErrada'

        // Busca o objeto na lista original para garantir integridade
        const objeto = desafio.objetos.find(obj => obj.id === objetoId);

        if (!objeto) return;

        // Adiciona o objeto à zona (persiste automaticamente)
        setObjetosColocados(prev => ({
            ...prev,
            [zona]: [...(prev[zona] || []), objeto] // Proteção caso o array esteja undefined
        }));

        // Verifica se a classificação está correta (apenas visual por enquanto)
        const correto = (zona === 'zonaCerta' && objeto.correto) ||
            (zona === 'zonaErrada' && !objeto.correto);

        if (!correto) {
            setShake(objetoId);
            setTimeout(() => setShake(null), 600);
        }
    };

    // Verifica se o desafio foi completado
    useEffect(() => {
        // Proteção contra estado inicial undefined
        const zonaCerta = objetosColocados?.zonaCerta || [];
        const zonaErrada = objetosColocados?.zonaErrada || [];
        const totalColocados = zonaCerta.length + zonaErrada.length;

        if (totalColocados > 0 && totalColocados === desafio.objetos.length) {
            // Verifica se todos estão corretos
            const todosCorretos =
                zonaCerta.every(obj => obj.correto) &&
                zonaErrada.every(obj => !obj.correto);

            if (todosCorretos) {
                setFeedback('sucesso');
            } else {
                setFeedback('erro');
            }
        }
    }, [objetosColocados, desafio.objetos.length]);

    const proximoDesafio = () => {
        // Incrementa acertos apenas ao clicar para avançar (mais seguro contra loops)
        if (feedback === 'sucesso') {
            setAcertos(prev => prev + 1);
        }

        if (ultimoDesafio) {
            setConcluido(true);
            onConcluido && onConcluido();
        } else {
            setDesafioAtual(prev => prev + 1);
            setObjetosColocados({ zonaCerta: [], zonaErrada: [] });
            setFeedback(null);
        }
    };

    const reiniciarDesafio = () => {
        setObjetosColocados({ zonaCerta: [], zonaErrada: [] });
        setFeedback(null);
        // Opcional: Re-embaralhar ao tentar novamente
        setObjetosDaFase(shuffle(desafio.objetos));
    };

    // Filtra os objetos disponíveis a partir da lista embaralhada
    const objetosDisponiveis = objetosDaFase.filter(
        obj => {
            const zonaCerta = objetosColocados?.zonaCerta || [];
            const zonaErrada = objetosColocados?.zonaErrada || [];
            return !zonaCerta.some(c => c.id === obj.id) &&
                !zonaErrada.some(c => c.id === obj.id);
        }
    );

    return (
        <div className="atividade-container detetive-objetos-container">
            <h3>🕵🏽 O Detetive dos Objetos</h3>
            {/* Instrução simplificada */}
            <p className="instrucoes">
                Separe os objetos! Coloque o que segue a regra na caixa certa e o que não segue na outra.
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
                            <strong>A Regra é:</strong> {desafio.regra}
                        </div>
                    </div>

                    <DndContext onDragEnd={handleDragEnd}>
                        {/* Área de objetos disponíveis */}
                        <div className="area-objetos">
                            <h5>Objetos misturados:</h5>
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
                                <p className="texto-vazio">Tudo separado!</p>
                            )}
                        </div>

                        {/* Zonas de classificação */}
                        <div className="zonas-classificacao">
                            <DropZone
                                id="zonaCerta"
                                titulo="✅ Segue a Regra"
                                count={(objetosColocados?.zonaCerta || []).length}
                            >
                                {(objetosColocados?.zonaCerta || []).map(objeto => (
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
                                id="zonaErrada"
                                titulo="❌ Não Segue"
                                count={(objetosColocados?.zonaErrada || []).length}
                            >
                                {(objetosColocados?.zonaErrada || []).map(objeto => (
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

                    {/* Feedback Sucesso */}
                    {feedback === 'sucesso' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="feedback-box sucesso"
                        >
                            <div className="feedback-icon">🎉</div>
                            <h4>Muito bem, Detetive!</h4>
                            <p>Você separou tudo corretamente seguindo a regra!</p>
                            <button className="btn" onClick={proximoDesafio}>
                                {ultimoDesafio ? 'Finalizar' : 'Próximo Desafio'}
                            </button>
                        </motion.div>
                    )}

                    {/* Feedback Erro */}
                    {feedback === 'erro' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="feedback-box erro"
                        >
                            <div className="feedback-icon">😕</div>
                            <h4>Ops! Algo ficou no lugar errado.</h4>
                            <p>Olhe a regra novamente e tente de novo!</p>
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
                                    width: `${((objetosColocados?.zonaCerta?.length || 0) + (objetosColocados?.zonaErrada?.length || 0)) / desafio.objetos.length * 100}%`
                                }}
                            />
                        </div>
                        <p className="progresso-texto">
                            {(objetosColocados?.zonaCerta?.length || 0) + (objetosColocados?.zonaErrada?.length || 0)} / {desafio.objetos.length} classificados
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
                            Você completou todos os desafios!
                        </p>
                        <p>
                            <strong>Desempenho:</strong> {acertos} de {DESAFIOS.length} perfeitos!
                        </p>
                        <p>
                            Você é muito bom e demonstrou excelente habilidade em identificar padrões e regras! 🌟
                        </p>
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
}
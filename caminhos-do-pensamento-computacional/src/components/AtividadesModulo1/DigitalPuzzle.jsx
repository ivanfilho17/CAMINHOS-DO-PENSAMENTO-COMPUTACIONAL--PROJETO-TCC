import React, { useState, useEffect, useMemo, useRef } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage"; // AJUSTE: Importando o hook
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";
// Certifique-se que o caminho para sua imagem está correto
import leaoImg from "../../assets/rei-leao3.png";
import "./DigitalPuzzle.css";

const IMAGE = leaoImg;
const GRID_COLS = 4;
const GRID_ROWS = 4;
const PIECE_SIZE = 100; // Tamanho de cada peça

// --- 1. DEFINIÇÃO DAS CATEGORIAS ---
const CATEGORIAS = [
    { id: 'ceu', title: 'Céu 🌤️' }, 
    { id: 'leao', title: 'Leão 🦁' },
    { id: 'vegetacao', title: 'Vegetação 🌿' } 
];

// --- 2. MAPEAMENTO DAS PEÇAS ---
const PIECE_CATEGORIES = {
    // Linha 0
    '0-0': 'ceu', '1-0': 'ceu', '2-0': 'ceu', '3-0': 'ceu',
    // Linha 1
    '0-1': 'ceu', '1-1': 'leao', '2-1': 'leao', '3-1': 'ceu',
    // Linha 2
    '0-2': 'vegetacao', '1-2': 'leao', '2-2': 'leao', '3-2': 'vegetacao',
    // Linha 3
    '0-3': 'vegetacao', '1-3': 'leao', '2-3': 'leao', '3-3': 'vegetacao',
};

// --- COMPONENTE PEÇA ARRASTÁVEL ---
// AJUSTE: Recebe a prop 'disabled' para desativar o arrasto
function DraggablePiece({ id, piece, disabled }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({ 
            id,
            disabled: disabled // Passa a configuração para o hook
        });

    const style = {
        width: PIECE_SIZE,
        height: PIECE_SIZE,
        backgroundImage: `url(${IMAGE})`,
        backgroundPosition: `${piece.x * -PIECE_SIZE}px ${piece.y * -PIECE_SIZE}px`,
        backgroundSize: `${PIECE_SIZE * GRID_COLS}px ${PIECE_SIZE * GRID_ROWS}px`,
        transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
        zIndex: isDragging ? 1000 : 1,
        cursor: disabled ? 'default' : 'grab', // Feedback visual
        opacity: disabled && !isDragging ? 1 : undefined // Mantém opacidade total se desabilitado
    };

    return (
        <div
            ref={setNodeRef}
            className={`puzzle-piece ${isDragging ? "dragging" : ""}`}
            style={style}
            {...listeners}
            {...attributes}
        />
    );
}

// --- COMPONENTE SLOT DA GRADE ---
function DroppableSlot({ id, children }) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div ref={setNodeRef} className={`puzzle-slot ${isOver ? "over" : ""}`}>
            {children}
        </div>
    );
}

// --- COMPONENTE CAIXA DE CATEGORIA ---
function DroppableCategoryBox({ id, title, children }) {
    const { setNodeRef, isOver } = useDroppable({ id });
    return (
        <div ref={setNodeRef} className={`pb-category ${isOver ? 'over' : ''}`}>
            <div className="pb-category-title">{title}</div>
            <div className="pb-category-content">
                {children}
            </div>
        </div>
    );
}

// --- COMPONENTE PRINCIPAL MODIFICADO ---
export default function DigitalPuzzle({ onConcluido }) {
    // AJUSTE: Substituindo useState por useLocalStorage para persistir o progresso
    const [etapa, setEtapa] = useLocalStorage("mod1_puzzle_etapa", 1);
    const [pecasCategorizadas, setPecasCategorizadas] = useLocalStorage("mod1_puzzle_categorizadas", { ceu: [], leao: [], vegetacao: [] });
    const [slotsMontagem, setSlotsMontagem] = useLocalStorage("mod1_puzzle_montagem", {});
    const [completed, setCompleted] = useLocalStorage("mod1_puzzle_concluido", false);

    // Estados visuais (não precisam de persistência)
    const [pecaAgitando, setPecaAgitando] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [feedbackType, setFeedbackType] = useState('');

    // 2. Ref para o timer do feedback temporário
    const feedbackTimer = useRef(null);

    // Limpa o timer se o componente for desmontado
    useEffect(() => {
        return () => {
            if (feedbackTimer.current) {
                clearTimeout(feedbackTimer.current);
            }
        };
    }, []);

    const pieces = useMemo(() => {
        const result = [];
        for (let y = 0; y < GRID_ROWS; y++) {
            for (let x = 0; x < GRID_COLS; x++) {
                const id = `${x}-${y}`;
                result.push({
                    id,
                    x,
                    y,
                    correctCategory: PIECE_CATEGORIES[id] || 'vegetacao'
                });
            }
        }
        return result;
    }, []);

    const shuffledPieces = useMemo(
        () => [...pieces].sort(() => Math.random() - 0.5),
        [pieces]
    );

    const pecasDisponiveis = useMemo(() => {
        // AJUSTE: Garantir que arrays existam para evitar erro ao ler do localStorage
        const catCeu = pecasCategorizadas?.ceu || [];
        const catLeao = pecasCategorizadas?.leao || [];
        const catVegetacao = pecasCategorizadas?.vegetacao || [];
        const slotsUsados = Object.values(slotsMontagem || {});

        const todasCategorizadasOuMontadas = [
            ...catCeu,
            ...catLeao,
            ...catVegetacao,
            ...slotsUsados
        ];
        return shuffledPieces.filter(p => !todasCategorizadasOuMontadas.includes(p.id));
    }, [shuffledPieces, pecasCategorizadas, slotsMontagem]);


    const findSlotForPiece = (id) => {
        return Object.keys(slotsMontagem).find(slot => slotsMontagem[slot] === id);
    };

    const handleDragStart = (event) => {
        if (etapa === 2) {
            const { active } = event;
            const slot = findSlotForPiece(active.id);
            active.data.current = { fromSlot: slot };
        }
    };

    // 3. Handler da Etapa 1 com feedback temporário
    const handleDragEndEtapa1 = (event) => {
        const { active, over } = event;
        if (!over) return;

        const pieceId = active.id;
        const categoryId = over.id;
        const piece = pieces.find(p => p.id === pieceId);

        if (!piece || !CATEGORIAS.some(c => c.id === categoryId)) return;

        // Limpa o timer anterior antes de definir um novo
        if (feedbackTimer.current) {
            clearTimeout(feedbackTimer.current);
        }

        if (piece.correctCategory === categoryId) {
            setPecasCategorizadas(prev => ({
                ...prev,
                [categoryId]: [...(prev[categoryId] || []), pieceId]
            }));
            setFeedback('Isso! Peça guardada na caixa certa. ✅');
            setFeedbackType('sucesso');
            feedbackTimer.current = setTimeout(() => {
                setFeedback('');
                setFeedbackType('');
            }, 2000); // Some após 2 segundos
        } else {
            setPecaAgitando(pieceId);
            const catTitle = CATEGORIAS.find(c => c.id === categoryId)?.title || "esta caixa";
            setFeedback(`Ops! Essa peça não parece ser do grupo "${catTitle}". Tente outra!`);
            setFeedbackType('erro');
            setTimeout(() => setPecaAgitando(null), 500);
            feedbackTimer.current = setTimeout(() => {
                setFeedback('');
                setFeedbackType('');
            }, 2500); // Some após 2.5 segundos
        }
    };

    // 4. Handler da Etapa 2 com lógica de troca/retorno CORRIGIDA
    const handleDragEndEtapa2 = (event) => {
        const { active, over } = event;
        const pieceId = active.id; // Peça A (arrastada)
        const piece = pieces.find(p => p.id === pieceId);
        const slotId = over?.id; // Slot B (destino)
        const fromSlot = active.data.current?.fromSlot; // Slot A (origem)

        // Se o jogo acabou, não faz nada (segurança extra além do disabled)
        if (completed) return;

        // Cenário 1: Soltou fora da grade
        if (!slotId || !slotId.includes('-')) {
            if (fromSlot) {
                // Veio da grade -> Devolve para a caixa
                setSlotsMontagem(prev => {
                    const updated = { ...prev };
                    delete updated[fromSlot]; // Remove da grade
                    return updated;
                });
                setPecasCategorizadas(prevCat => ({
                    ...prevCat,
                    [piece.correctCategory]: [...(prevCat[piece.correctCategory] || []), pieceId]
                }));
            }
            return;
        }

        // Cenário 2: Soltou em um slot válido (slotId)
        const pieceInOverSlotId = slotsMontagem[slotId]; // Peça B (que já estava lá)

        // Inicia atualizações de estado
        let newSlots = { ...slotsMontagem };
        let newCategorias = { ...pecasCategorizadas };

        // 3. Remove Peça A da sua origem
        if (fromSlot) {
            // Veio de outro slot
            delete newSlots[fromSlot];
        } else {
            // Veio da categoria
            newCategorias[piece.correctCategory] = newCategorias[piece.correctCategory].filter(id => id !== pieceId);
        }

        // 4. Lida com o slot de destino
        if (!pieceInOverSlotId) {
            // 4a. Destino VAZIO
            newSlots[slotId] = pieceId;
        } else {
            // 4b. Destino OCUPADO (com Peça B)
            newSlots[slotId] = pieceId; // Coloca Peça A no Slot B

            if (fromSlot) {
                // Veio de outro slot (SWAP)
                newSlots[fromSlot] = pieceInOverSlotId; // Coloca Peça B no Slot A
            } else {
                // Veio da categoria (DEVOLVE Peça B)
                const pieceToReturn = pieces.find(p => p.id === pieceInOverSlotId);
                newCategorias[pieceToReturn.correctCategory] = [
                    ...(newCategorias[pieceToReturn.correctCategory] || []),
                    pieceInOverSlotId
                ];
            }
        }

        // 5. Commita os estados
        setSlotsMontagem(newSlots);
        setPecasCategorizadas(newCategorias);
    };

    // Handler Principal
    const handleDragEnd = (event) => {
        // Limpa o timer de feedback da Etapa 1
        if (feedbackTimer.current) {
            clearTimeout(feedbackTimer.current);
            feedbackTimer.current = null;
        }
        // Limpa feedback de aviso (não-timer) da Etapa 2
        if (etapa === 2 && feedbackType === 'aviso') {
            setFeedback('');
            setFeedbackType('');
        }
        
        // Limpa feedback geral antes de processar
        setFeedback('');
        setFeedbackType('');

        if (etapa === 1) {
            handleDragEndEtapa1(event);
        } else {
            handleDragEndEtapa2(event);
        }
    };

    // 5. LÓGICA DE TRANSIÇÃO
    const totalPecas = pieces.length;
    // AJUSTE: Proteção contra undefined ao somar
    const totalCategorizado = (pecasCategorizadas?.ceu?.length || 0) + (pecasCategorizadas?.leao?.length || 0) + (pecasCategorizadas?.vegetacao?.length || 0);

    useEffect(() => {
        if (etapa === 1 && totalCategorizado === totalPecas) {
            // Se um timer de feedback ("Boa!") estiver rodando, cancela
            if (feedbackTimer.current) {
                clearTimeout(feedbackTimer.current);
                feedbackTimer.current = null;
            }
            // Define o feedback persistente de transição
            setFeedback('Muito bem! Separar as peças ajuda a organizar. Agora vamos montar!');
            setFeedbackType('sucesso');
            // setSlotsMontagem({}); // REMOVIDO: Não resetar aqui, pois o usuário pode já ter começado a etapa 2 e dado F5
        }
    }, [etapa, totalCategorizado, totalPecas]); // Depende de 'etapa'

    // LÓGICA DE CONCLUSÃO (ETAPA 2)
    useEffect(() => {
        if (etapa === 2) {
            const allPlacedOnGrid = Object.keys(slotsMontagem).length === pieces.length;
            if (allPlacedOnGrid && !completed) {
                const isCorrect = pieces.every((p) => slotsMontagem[p.id] === p.id);
                if (isCorrect) {
                    setCompleted(true);
                    setFeedback('');
                    setFeedbackType('');
                    onConcluido?.();
                } else {
                    setFeedback("Quase lá! Algumas peças estão no lugar errado. Tente de novo!");
                    setFeedbackType('aviso');
                }
            } else if (completed) {
                // Se já estiver completo (vindo do storage), avisa o pai
                onConcluido?.();
            }
        }
    }, [slotsMontagem, pieces, completed, onConcluido, etapa, setCompleted]);


    // --- RENDERIZAÇÃO ---
    return (
        <div className="atividade-container puzzle-container">
            <h3 className="puzzle-title">🧩 Quebra-Cabeça do Leão</h3>      
            <p className="puzzle-instructions">
                {etapa === 1
                    ? "Montar um quebra-cabeça pode ser uma tarefa muito grande! Vamos separar as peças por grupos para ficar mais fácil."
                    : "Agora que separamos, ficou mais fácil! Arraste as peças das caixas para montar o desenho."
                }
            </p>

            {/* O feedback agora é controlado pelo estado */}
            {feedback && (
                <div className={`feedback ${feedbackType}`}>
                    {feedback}
                </div>
            )}

            <DndContext key={`puzzle-dnd-${etapa}`} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>

                {/* === ETAPA 1: CATEGORIZAR === */}
                {etapa === 1 && (
                    <div className="puzzle-content">
                        {/* Caixas de Categoria */}
                        <div className="puzzle-categories">
                            {CATEGORIAS.map(cat => (
                                <DroppableCategoryBox key={cat.id} id={cat.id} title={cat.title}>
                                    {(pecasCategorizadas[cat.id] || []).map(pieceId => {
                                        const piece = pieces.find(p => p.id === pieceId);
                                        // AJUSTE: Peças que já estão na caixa correta agora ficam desabilitadas (disabled={true})
                                        return (
                                            <div key={pieceId} className="puzzle-piece-wrapper">
                                                <DraggablePiece id={pieceId} piece={piece} disabled={true} />
                                            </div>
                                        );
                                    })}
                                </DroppableCategoryBox>
                            ))}
                        </div>

                        {/* Esteira de Peças */}
                        <div className="puzzle-shuffled">
                            {pecasDisponiveis.length === 0
                                ? <p>Todas as peças separadas!</p>
                                : pecasDisponiveis.map((piece) => (
                                    <div key={piece.id} className={`shuffled-piece-wrapper ${pecaAgitando === piece.id ? 'shake' : ''}`}>
                                        <DraggablePiece id={piece.id} piece={piece} />
                                    </div>
                                ))}
                        </div>

                        {totalCategorizado === totalPecas && !completed && (
                            <button className="btn" onClick={() => {
                                setEtapa(2);
                                setFeedback(''); // Limpa o feedback de transição ao clicar
                                setFeedbackType('');
                            }} style={{ marginTop: '1rem' }}>
                                Vamos Montar!
                            </button>
                        )}
                    </div>
                )}

                {/* === ETAPA 2: MONTAR (COM REFERÊNCIA VISUAL) === */}
                {etapa === 2 && (
                    // 1. Container Principal Flex (Coluna)
                    <div className="puzzle-content-horizontal"> 
                        
                        {/* Wrapper: Imagem + Grade lado a lado */}
                        <div className="referencia-e-grade">
                            {/* 1. Imagem de Referência Fixo (o "mini-mapa") */}
                            <div className="referencia-mini">
                                <h4>Imagem Completa</h4>
                                <img src={IMAGE} alt="Imagem de Referência Completa" style={{ width: '150px', height: '150px', border: '1px solid black', borderRadius: '8px' }} />
                            </div>
                            
                            {/* 2. Área de Montagem (Grade apenas) */}
                            <div className="montagem-grade">
                                {/* Grade de Montagem */}
                                <div
                                    className="puzzle-grid"
                                    style={{
                                        gridTemplateColumns: `repeat(${GRID_COLS}, ${PIECE_SIZE}px)`,
                                        gridTemplateRows: `repeat(${GRID_ROWS}, ${PIECE_SIZE}px)`,
                                    }}
                                >
                                    {pieces.map((piece) => (
                                        <DroppableSlot key={piece.id} id={piece.id}>
                                            {slotsMontagem[piece.id] && (
                                                <DraggablePiece
                                                    id={slotsMontagem[piece.id]}
                                                    piece={pieces.find((p) => p.id === slotsMontagem[piece.id])}
                                                    // AJUSTE: Desabilita arrasto se o puzzle estiver completo
                                                    disabled={completed}
                                                />
                                            )}
                                        </DroppableSlot>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 3. Caixas de Peças (Fonte) - Abaixo e Centralizadas */}
                        <div className="puzzle-categories puzzle-categories-flex">
                            {CATEGORIAS.map(cat => (
                                <div key={cat.id} className="pb-category">
                                    <div className="pb-category-title">{cat.title}</div>
                                    <div className="pb-category-content"> 
                                        {(pecasCategorizadas[cat.id] || []).map(pieceId => {
                                            const piece = pieces.find(p => p.id === pieceId);
                                            // AJUSTE: Desabilita arrasto se o puzzle estiver completo
                                            return <DraggablePiece key={pieceId} id={pieceId} piece={piece} disabled={completed} />
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </DndContext>

            {/* Feedback de Sucesso Final */}
            <AnimatePresence>
                {completed && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="feedback sucesso"
                    >
                        ✨ <strong>Incrível!</strong> Você resolveu um problema grande dividindo-o em partes menores!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
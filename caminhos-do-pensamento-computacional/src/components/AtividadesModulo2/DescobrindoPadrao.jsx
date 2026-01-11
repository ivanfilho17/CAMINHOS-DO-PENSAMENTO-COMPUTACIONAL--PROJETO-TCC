// Atividade 3 do Módulo 2: Descoberta do Padrão

import React, { useState, useEffect } from 'react';
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { motion, AnimatePresence } from 'framer-motion';
import './DescobrindoPadrao.css';

// Desafios de descoberta de padrão com linguagem ajustada
const DESAFIOS = [
    {
        id: 1,
        titulo: 'Círculo Secreto #1',
        dentroCirculo: [
            { emoji: '🍎', nome: 'Maçã' },
            { emoji: '🍅', nome: 'Tomate' },
            { emoji: '🚗', nome: 'Carro Vermelho' }
        ],
        foraCirculo: [
            { emoji: '🍌', nome: 'Banana' },
            { emoji: '🚙', nome: 'Carro Azul' },
            { emoji: '🍃', nome: 'Folha' }
        ],
        pergunta: 'Qual é o segredo dos itens dentro do círculo?',
        opcoes: [
            { texto: 'São frutas', correto: false, explicacao: 'Olhe bem! O carro não é uma fruta.' },
            { texto: 'São vermelhos', correto: true, explicacao: 'Isso mesmo! Todos são da cor vermelha.' },
            { texto: 'São veículos', correto: false, explicacao: 'Ops! A maçã e o tomate não são veículos.' }
        ]
    },
    {
        id: 2,
        titulo: 'Círculo Secreto #2',
        dentroCirculo: [
            { emoji: '⚽', nome: 'Bola' },
            { emoji: '🍊', nome: 'Laranja' },
            { emoji: '🌕', nome: 'Lua Cheia' }
        ],
        foraCirculo: [
            { emoji: '📦', nome: 'Caixa' },
            { emoji: '🔺', nome: 'Triângulo' },
            { emoji: '📱', nome: 'Celular' }
        ],
        pergunta: 'O que eles têm em comum?',
        opcoes: [
            { texto: 'São redondos', correto: true, explicacao: 'Perfeito! Todos têm forma de círculo.' },
            { texto: 'São amarelos', correto: false, explicacao: 'Quase! A bola não é amarela.' },
            { texto: 'São de comer', correto: false, explicacao: 'Cuidado! Não dá para comer a lua nem a bola!' }
        ]
    },
    {
        id: 3,
        titulo: 'Círculo Secreto #3',
        dentroCirculo: [
            { emoji: '🐶', nome: 'Cachorro' },
            { emoji: '🐱', nome: 'Gato' },
            { emoji: '🐰', nome: 'Coelho' }
        ],
        foraCirculo: [
            { emoji: '🚗', nome: 'Carro' },
            { emoji: '🌳', nome: 'Árvore' },
            { emoji: '⚽', nome: 'Bola' }
        ],
        pergunta: 'Qual é a característica do grupo?',
        opcoes: [
            { texto: 'São animais', correto: true, explicacao: 'Isso aí! Todos são bichinhos.' },
            { texto: 'São brinquedos', correto: false, explicacao: 'Eles parecem fofos, mas são animais de verdade!' },
            { texto: 'São grandes', correto: false, explicacao: 'O tamanho não é o segredo aqui.' }
        ]
    },
    {
        id: 4,
        titulo: 'Círculo Secreto #4',
        dentroCirculo: [
            { emoji: '🎸', nome: 'Guitarra' },
            { emoji: '🎹', nome: 'Piano' },
            { emoji: '🥁', nome: 'Bateria' }
        ],
        foraCirculo: [
            { emoji: '⚽', nome: 'Bola' },
            { emoji: '📚', nome: 'Livros' },
            { emoji: '🍕', nome: 'Pizza' }
        ],
        pergunta: 'O que todos eles são?',
        opcoes: [
            { texto: 'Comida', correto: false, explicacao: 'Não dá para comer um piano!' },
            { texto: 'Instrumentos musicais', correto: true, explicacao: 'Correto! Todos fazem música.' },
            { texto: 'Esportes', correto: false, explicacao: 'Tocar música é legal, mas não é um esporte.' }
        ]
    },
    {
        id: 5,
        titulo: 'Círculo Secreto #5',
        dentroCirculo: [
            { emoji: '✈️', nome: 'Avião' },
            { emoji: '🦅', nome: 'Águia' },
            { emoji: '🦋', nome: 'Borboleta' }
        ],
        foraCirculo: [
            { emoji: '🚗', nome: 'Carro' },
            { emoji: '🐕', nome: 'Cachorro' },
            { emoji: '⛵', nome: 'Barco' }
        ],
        pergunta: 'O que todos eles conseguem fazer?',
        opcoes: [
            { texto: 'Nadar', correto: false, explicacao: 'O avião e a borboleta não nadam.' },
            { texto: 'Voar', correto: true, explicacao: 'Excelente! Todos voam pelo céu.' },
            { texto: 'Rodar', correto: false, explicacao: 'A águia e a borboleta não têm rodas.' }
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

export default function PadraoSecreto({ onConcluido }) {
    // ESTADOS PERSISTENTES
    const [desafioAtual, setDesafioAtual] = useLocalStorage("mod2_padrao_desafio", 0);
    const [acertos, setAcertos] = useLocalStorage("mod2_padrao_acertos", 0);
    const [tentativas, setTentativas] = useLocalStorage("mod2_padrao_tentativas", 0);
    const [concluido, setConcluido] = useLocalStorage("mod2_padrao_concluido", false);

    const [respostaSelecionada, setRespostaSelecionada] = useLocalStorage("mod2_padrao_resposta", null);
    const [feedback, setFeedback] = useLocalStorage("mod2_padrao_feedback", null);
    const [opcoesEmbaralhadas, setOpcoesEmbaralhadas] = useLocalStorage("mod2_padrao_opcoes", []);

    // Estados visuais temporários
    const [mostrarDica, setMostrarDica] = useState(false);
    
    const desafio = DESAFIOS[desafioAtual] || DESAFIOS[0];
    const ultimoDesafio = desafioAtual === DESAFIOS.length - 1;

    useEffect(() => {
        if (concluido) {
            onConcluido?.();
        }
    }, [concluido, onConcluido]);

    useEffect(() => {
        if (desafio) {
            // Gera embaralhamento inicial se não existir
            if (opcoesEmbaralhadas.length === 0) {
                setOpcoesEmbaralhadas(shuffle(desafio.opcoes));
            }
        }
    }, [desafioAtual, opcoesEmbaralhadas.length]); 

    const handleSelectOpcao = (index) => {
        if (respostaSelecionada !== null) return;

        setRespostaSelecionada(index);
        setTentativas(prev => prev + 1);

        // Busca a opção correta dentro do array embaralhado usando o índice clicado
        const opcao = opcoesEmbaralhadas[index];

        if (opcao.correto) {
            setFeedback({ tipo: 'sucesso', mensagem: opcao.explicacao });
            setAcertos(prev => prev + 1);
        } else {
            setFeedback({ tipo: 'erro', mensagem: opcao.explicacao });
        }
    };

    const proximoDesafio = () => {
        if (ultimoDesafio) {
            setConcluido(true);
            onConcluido && onConcluido();
        } else {
            setDesafioAtual(prev => prev + 1);
            setRespostaSelecionada(null);
            setFeedback(null);
            setOpcoesEmbaralhadas([]); // Limpa para gerar novo embaralhamento no useEffect
            setMostrarDica(false);
        }
    };

    const tentarNovamente = () => {
        setRespostaSelecionada(null);
        setFeedback(null);
        
        // AJUSTE: Re-embaralha as opções ao errar para dar dinâmica ao "Tentar Novamente"
        if (desafio) {
            setOpcoesEmbaralhadas(shuffle(desafio.opcoes));
        }
    };

    return (
        <div className="atividade-container padrao-secreto-container">
            <h3>🔮 O Padrão Secreto</h3>
            <p className="instrucoes">
                Olhe para os objetos dentro do círculo. O que eles têm em comum? Descubra o segredo!
            </p>

            {!concluido ? (
                <>
                    <div className="desafio-header">
                        <h4>{desafio.titulo}</h4>
                        <div className="contador-desafios">
                            Desafio {desafioAtual + 1} de {DESAFIOS.length}
                        </div>
                    </div>

                    {/* Círculo Secreto */}
                    <div className="circulo-secreto-area">
                        <div className="circulo-secreto">
                            <div className="circulo-label">Círculo Secreto</div>
                            <div className="objetos-dentro">
                                {desafio.dentroCirculo.map((obj, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="objeto-circulo"
                                        title={obj.nome}
                                    >
                                        <div className="objeto-emoji-grande">{obj.emoji}</div>
                                        <div className="objeto-nome-pequeno">{obj.nome}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Objetos Fora do Círculo */}
                        <div className="objetos-fora">
                            <div className="fora-label">Objetos Fora</div>
                            {desafio.foraCirculo.map((obj, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className="objeto-fora"
                                    title={obj.nome}
                                >
                                    <div className="objeto-emoji-medio">{obj.emoji}</div>
                                    <div className="objeto-nome-pequeno">{obj.nome}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Pergunta */}
                    <div className="pergunta-box">
                        <div className="pergunta-icon">❓</div>
                        <h4>{desafio.pergunta}</h4>
                    </div>

                    {/* Opções de Resposta (Renderiza o array embaralhado) */}
                    <div className="opcoes-container">
                        {opcoesEmbaralhadas.map((opcao, index) => {
                            let className = 'opcao-btn';

                            if (respostaSelecionada !== null) {
                                if (opcao.correto) {
                                    className += ' correto';
                                } else if (index === respostaSelecionada) {
                                    className += ' incorreto';
                                } else {
                                    className += ' desabilitado';
                                }
                            }

                            return (
                                <button
                                    key={index}
                                    className={className}
                                    onClick={() => handleSelectOpcao(index)}
                                    disabled={respostaSelecionada !== null}
                                >
                                    <span className="opcao-letra">
                                        {String.fromCharCode(65 + index)}
                                    </span>
                                    <span className="opcao-texto">{opcao.texto}</span>
                                    {respostaSelecionada === index && !opcao.correto && (
                                        <span className="opcao-icon">❌</span>
                                    )}
                                    {opcao.correto && respostaSelecionada !== null && (
                                        <span className="opcao-icon">✅</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Botão de Dica */}
                    {!mostrarDica && respostaSelecionada === null && tentativas > 0 && (
                        <button className="btn-dica1" onClick={() => setMostrarDica(true)}>
                            💡 Precisa de uma dica?
                        </button>
                    )}

                    {/* Dica */}
                    {mostrarDica && respostaSelecionada === null && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="dica-box"
                        >
                            <strong>💡 Dica:</strong> Veja o que TODOS os itens de dentro têm igual, mas que os de fora NÃO têm!
                        </motion.div>
                    )}

                    {/* Feedback */}
                    {feedback && (
                        <AnimatePresence>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`feedback-explicacao ${feedback.tipo}`}
                            >
                                <div className="feedback-icon-grande">
                                    {feedback.tipo === 'sucesso' ? '🎉' : '😕'}
                                </div>
                                <p className="feedback-mensagem">{feedback.mensagem}</p>

                                {feedback.tipo === 'sucesso' ? (
                                    <button className="btn" onClick={proximoDesafio}>
                                        {ultimoDesafio ? 'Finalizar' : 'Próximo Desafio'}
                                    </button>
                                ) : (
                                    <button className="btn" onClick={tentarNovamente}>
                                        Tentar Novamente
                                    </button>
                                )}
                            </motion.div>
                        </AnimatePresence>
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
                        <h3>🎊 Parabéns!</h3>
                        <p>Você descobriu todos os segredos!</p>
                        <p>
                            <strong>Desempenho:</strong> {acertos} acertos em {tentativas} tentativas
                        </p>
                        <p>
                            Você é ótimo em encontrar o que as coisas têm em comum! 🔍✨
                        </p>
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
}
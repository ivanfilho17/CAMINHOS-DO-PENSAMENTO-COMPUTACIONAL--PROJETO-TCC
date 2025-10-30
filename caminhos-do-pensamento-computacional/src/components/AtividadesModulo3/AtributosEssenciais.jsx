// Atividade 2 do Módulo 3: Identificar Atributos Essenciais

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AtributosEssenciais.css';

// Desafios com diferentes conceitos
const DESAFIOS = [
    {
        id: 1,
        conceito: 'PÁSSARO',
        emoji: '🐦',
        atributos: [
            { id: 'bico', texto: 'Tem bico', essencial: true },
            { id: 'amarelo', texto: 'É amarelo', essencial: false },
            { id: 'penas', texto: 'Tem penas', essencial: true },
            { id: 'sementes', texto: 'Gosta de sementes', essencial: false },
            { id: 'ovos', texto: 'Bota ovos', essencial: true },
            { id: 'gaiola', texto: 'Mora em gaiola', essencial: false }
        ],
        explicacao: 'Um pássaro PRECISA ter bico, penas e botar ovos. A cor (amarelo) ou onde mora (gaiola) são detalhes que mudam de pássaro para pássaro!'
    },
    {
        id: 2,
        conceito: 'CARRO',
        emoji: '🚗',
        atributos: [
            { id: 'rodas', texto: 'Tem rodas', essencial: true },
            { id: 'vermelho', texto: 'É vermelho', essencial: false },
            { id: 'motor', texto: 'Tem motor', essencial: true },
            { id: 'luxo', texto: 'É de luxo', essencial: false },
            { id: 'transporte', texto: 'Serve para transportar', essencial: true },
            { id: '4portas', texto: 'Tem 4 portas', essencial: false }
        ],
        explicacao: 'Um carro PRECISA ter rodas, motor e servir para transporte. A cor, o luxo ou o número de portas são características que variam!'
    },
    {
        id: 3,
        conceito: 'LIVRO',
        emoji: '📚',
        atributos: [
            { id: 'paginas', texto: 'Tem páginas', essencial: true },
            { id: 'capa-dura', texto: 'Tem capa dura', essencial: false },
            { id: 'texto', texto: 'Contém texto/imagens', essencial: true },
            { id: 'romance', texto: 'É de romance', essencial: false },
            { id: 'ler', texto: 'Serve para ler', essencial: true },
            { id: 'cheiro', texto: 'Tem cheiro de novo', essencial: false }
        ],
        explicacao: 'Um livro PRECISA ter páginas, conteúdo (texto/imagens) e servir para leitura. O tipo (romance) ou o cheiro são detalhes secundários!'
    }
];

export default function AtributosEssenciais({ onConcluido }) {
    const [desafioAtual, setDesafioAtual] = useState(0);
    const [selecionados, setSelecionados] = useState([]);
    const [verificado, setVerificado] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [acertos, setAcertos] = useState(0);
    const [concluido, setConcluido] = useState(false);

    const desafio = DESAFIOS[desafioAtual];
    const ultimoDesafio = desafioAtual === DESAFIOS.length - 1;

    const handleToggleAtributo = (atributoId) => {
        if (verificado) return;

        setSelecionados(prev =>
            prev.includes(atributoId)
                ? prev.filter(id => id !== atributoId)
                : [...prev, atributoId]
        );
    };

    const handleVerificar = () => {
        const atributosEssenciais = desafio.atributos
            .filter(a => a.essencial)
            .map(a => a.id);

        const todosEssenciaisSelecionados = atributosEssenciais.every(id =>
            selecionados.includes(id)
        );

        const nenhumDesnecessarioSelecionado = selecionados.every(id =>
            atributosEssenciais.includes(id)
        );

        const correto = todosEssenciaisSelecionados && nenhumDesnecessarioSelecionado;

        setVerificado(true);

        if (correto) {
            setFeedback({ tipo: 'sucesso', mensagem: desafio.explicacao });
            setAcertos(prev => prev + 1);
        } else {
            const faltou = atributosEssenciais.filter(id => !selecionados.includes(id));
            const sobrou = selecionados.filter(id => !atributosEssenciais.includes(id));

            let mensagem = '';
            if (faltou.length > 0) {
                mensagem += 'Você esqueceu atributos essenciais! ';
            }
            if (sobrou.length > 0) {
                mensagem += 'Você selecionou atributos que não são essenciais.';
            }

            setFeedback({ tipo: 'erro', mensagem });
        }
    };

    const proximoDesafio = () => {
        if (ultimoDesafio) {
            setConcluido(true);
            onConcluido && onConcluido();
        } else {
            setDesafioAtual(prev => prev + 1);
            setSelecionados([]);
            setVerificado(false);
            setFeedback(null);
        }
    };

    const tentarNovamente = () => {
        setSelecionados([]);
        setVerificado(false);
        setFeedback(null);
    };

    return (
        <div className="atividade-container atributos-essenciais-container">
            <h3>🎯 Atividade: O que define um...?</h3>
            <p className="instrucoes">
                Identifique os atributos ESSENCIAIS! Marque apenas o que define o conceito,
                não detalhes que podem variar.
            </p>

            {!concluido ? (
                <>
                    <div className="desafio-header">
                        <div className="conceito-box">
                            <div className="conceito-emoji">{desafio.emoji}</div>
                            <h4>O que é essencial para um<br /><strong>{desafio.conceito}</strong>?</h4>
                        </div>
                        <div className="contador-desafios">
                            Desafio {desafioAtual + 1} de {DESAFIOS.length}
                        </div>
                    </div>

                    {/* Lista de Atributos */}
                    <div className="atributos-lista">
                        {desafio.atributos.map((atributo) => {
                            const selecionado = selecionados.includes(atributo.id);
                            let className = 'atributo-item';

                            if (selecionado) className += ' selecionado';
                            if (verificado) {
                                if (atributo.essencial && selecionado) {
                                    className += ' correto';
                                } else if (!atributo.essencial && selecionado) {
                                    className += ' incorreto';
                                } else if (atributo.essencial && !selecionado) {
                                    className += ' faltou';
                                }
                            }

                            return (
                                <motion.div
                                    key={atributo.id}
                                    className={className}
                                    onClick={() => handleToggleAtributo(atributo.id)}
                                    whileHover={!verificado ? { scale: 1.02 } : {}}
                                    whileTap={!verificado ? { scale: 0.98 } : {}}
                                >
                                    <div className="checkbox">
                                        {selecionado && <span className="checkmark">✓</span>}
                                    </div>
                                    <span className="atributo-texto">{atributo.texto}</span>
                                    {verificado && atributo.essencial && (
                                        <span className="badge-essencial">Essencial!</span>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Feedback */}
                    <AnimatePresence>
                        {feedback && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={`feedback-box ${feedback.tipo}`}
                            >
                                {feedback.tipo === 'sucesso' ? '🎉' : '🤔'} {feedback.mensagem}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Botões */}
                    <div className="botoes-acao">
                        {!verificado ? (
                            <button
                                className="btn-verificar"
                                onClick={handleVerificar}
                                disabled={selecionados.length === 0}
                            >
                                Verificar Resposta
                            </button>
                        ) : (
                            <>
                                {feedback.tipo === 'erro' && (
                                    <button className="btn-tentar" onClick={tentarNovamente}>
                                        Tentar Novamente
                                    </button>
                                )}
                                <button className="btn-proximo" onClick={proximoDesafio}>
                                    {ultimoDesafio ? 'Finalizar Atividade' : 'Próximo Desafio →'}
                                </button>
                            </>
                        )}
                    </div>
                </>
            ) : (
                <div className="resultado-final">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="resultado-conteudo"
                    >
                        <div className="resultado-emoji">🏆</div>
                        <h3>Atividade Concluída!</h3>
                        <p className="resultado-texto">
                            Você acertou {acertos} de {DESAFIOS.length} desafios!
                        </p>
                        <p className="resultado-mensagem">
                            {acertos === DESAFIOS.length
                                ? 'Perfeito! Você entendeu muito bem o que são atributos essenciais!'
                                : 'Bom trabalho! Você está aprendendo a identificar o que é essencial.'}
                        </p>
                        <div className="conceito-aprendido">
                            <strong>💡 Conceito Aprendido:</strong>
                            <p>
                                Abstração é focar no que é ESSENCIAL e ignorar detalhes que variam.
                                Isso é fundamental para criar modelos e resolver problemas!
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
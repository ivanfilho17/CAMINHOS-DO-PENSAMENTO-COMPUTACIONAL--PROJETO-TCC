// Atividade 3 do Módulo 3: Jogo Cara a cara ou "Quem é o Personagem Secreto?"

import React, { useState, useEffect } from 'react';
import { useLocalStorage } from "../../hooks/useLocalStorage";
import './CaraCaraGame.css';

// Personagens do jogo (15 personagens com características visuais claras)
const PERSONAGENS = [
  { id: 1, nome: 'Ana', oculos: true, cabelo: 'loiro', chapeu: false, bigode: false, descricao: 'Loira com óculos' },
  { id: 2, nome: 'Bruno', oculos: false, cabelo: 'preto', chapeu: true, bigode: true, descricao: 'Moreno de chapéu com barba' },
  { id: 3, nome: 'Clara', oculos: true, cabelo: 'ruivo', chapeu: false, bigode: false, descricao: 'Ruiva com óculos' },
  { id: 4, nome: 'Diego', oculos: false, cabelo: 'preto', chapeu: false, bigode: false, descricao: 'Moreno sem acessórios' },
  { id: 5, nome: 'Elisa', oculos: false, cabelo: 'loiro', chapeu: true, bigode: false, descricao: 'Loira de chapéu' },
  { id: 6, nome: 'Fabio', oculos: true, cabelo: 'castanho', chapeu: false, bigode: true, descricao: 'Castanho com óculos e barba' },
  { id: 7, nome: 'Gabi', oculos: false, cabelo: 'ruivo', chapeu: true, bigode: false, descricao: 'Ruiva de chapéu' },
  { id: 8, nome: 'Hugo', oculos: true, cabelo: 'loiro', chapeu: true, bigode: false, descricao: 'Loiro com óculos e chapéu' },
  { id: 9, nome: 'Iris', oculos: false, cabelo: 'castanho', chapeu: false, bigode: false, descricao: 'Castanha sem acessórios' },
  { id: 10, nome: 'João', oculos: false, cabelo: 'preto', chapeu: false, bigode: true, descricao: 'Moreno com barba' },
  { id: 11, nome: 'Karla', oculos: true, cabelo: 'castanho', chapeu: true, bigode: false, descricao: 'Castanha com óculos e chapéu' },
  { id: 12, nome: 'Lucas', oculos: false, cabelo: 'loiro', chapeu: false, bigode: false, descricao: 'Loiro sem acessórios' },
  { id: 13, nome: 'Mário', oculos: false, cabelo: 'preto', chapeu: true, bigode: false, descricao: 'Moreno de chapéu' },
  { id: 14, nome: 'Nina', oculos: true, cabelo: 'ruivo', chapeu: true, bigode: false, descricao: 'Ruiva de óculos e chapéu' },
  { id: 15, nome: 'Otávio', oculos: true, cabelo: 'castanho', chapeu: false, bigode: true, descricao: 'Castanho com óculos e barba' }
];

const PERGUNTAS = [
  { id: 'oculos', texto: 'Usa óculos?', atributo: 'oculos' },
  { id: 'cabelo-loiro', texto: 'Tem cabelo loiro?', atributo: 'cabelo', valor: 'loiro' },
  { id: 'cabelo-preto', texto: 'Tem cabelo preto?', atributo: 'cabelo', valor: 'preto' },
  { id: 'cabelo-ruivo', texto: 'Tem cabelo ruivo?', atributo: 'cabelo', valor: 'ruivo' },
  { id: 'cabelo-castanho', texto: 'Tem cabelo castanho?', atributo: 'cabelo', valor: 'castanho' },
  { id: 'chapeu', texto: 'Usa chapéu?', atributo: 'chapeu' },
  { id: 'bigode', texto: 'Tem barba?', atributo: 'bigode' }
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

// Componente para renderizar o personagem com características visuais
function PersonagemAvatar({ personagem }) {
  const getCabeloCor = (cabelo) => {
    switch (cabelo) {
      case 'loiro': return '#FFD700';
      case 'preto': return '#2C2C2C';
      case 'ruivo': return '#D2691E';
      case 'castanho': return '#8B4513';
      default: return '#8B4513';
    }
  };

  return (
    <svg width="100" height="120" viewBox="0 0 100 120">
      {/* Chapéu */}
      {personagem.chapeu && (
        <>
          <ellipse cx="50" cy="35" rx="30" ry="8" fill="#4A5568" />
          <rect x="35" y="20" width="30" height="15" rx="5" fill="#2D3748" />
        </>
      )}

      {/* Cabelo */}
      <circle cx="50" cy="45" r="25" fill={getCabeloCor(personagem.cabelo)} />

      {/* Rosto */}
      <circle cx="50" cy="50" r="20" fill="#d19d70ff" />

      {/* Óculos */}
      {personagem.oculos && (
        <g>
          <circle cx="43" cy="48" r="6" fill="none" stroke="#333" strokeWidth="2" />
          <circle cx="57" cy="48" r="6" fill="none" stroke="#333" strokeWidth="2" />
          <line x1="49" y1="48" x2="51" y2="48" stroke="#333" strokeWidth="2" />
        </g>
      )}

      {/* Olhos */}
      <circle cx="43" cy="48" r="2" fill="#000" />
      <circle cx="57" cy="48" r="2" fill="#000" />

      {/* Nariz */}
      <circle cx="50" cy="53" r="1.5" fill="#000" />

      {/* Boca */}
      <path d="M 45 58 Q 50 61 55 58" stroke="#000" strokeWidth="1.5" fill="none" />

      {/* Barba/Bigode */}
      {personagem.bigode && (
        <g>
          <ellipse cx="50" cy="56" rx="8" ry="3" fill="#2C2C2C" />
          <path d="M 42 65 Q 50 75 58 65" fill="#2C2C2C" />
        </g>
      )}

      {/* Corpo/Pescoço */}
      <rect x="42" y="68" width="16" height="12" fill="#87CEEB" rx="3" />
    </svg>
  );
}

export default function JogoCaraACara({ onConcluido }) {
  // ESTADOS PERSISTIDOS
  const [personagemSecreto, setPersonagemSecreto] = useLocalStorage("mod3_caracara_secreto", null);
  const [personagensVisiveis, setPersonagensVisiveis] = useLocalStorage("mod3_caracara_visiveis", []);
  const [gridPersonagens, setGridPersonagens] = useLocalStorage("mod3_caracara_grid", []);
  const [perguntasFeitas, setPerguntasFeitas] = useLocalStorage("mod3_caracara_historico", []);
  const [venceu, setVenceu] = useLocalStorage("mod3_caracara_venceu", false);
  const [jaConcluido, setJaConcluido] = useLocalStorage("mod3_caracara_concluido", false);
  
  // Persistindo seleção e feedback
  const [perguntaSelecionada, setPerguntaSelecionada] = useLocalStorage("mod3_caracara_pergunta_selecionada", '');
  const [feedback, setFeedback] = useLocalStorage("mod3_caracara_feedback", null); // <--- AGORA PERSISTIDO

  // Inicializa o jogo APENAS se não houver dados salvos
  useEffect(() => {
    if (!personagemSecreto || gridPersonagens.length === 0) {
      iniciarJogo();
    }
  }, [personagemSecreto, gridPersonagens.length]);

  useEffect(() => {
    if (jaConcluido) {
        onConcluido?.();
    }
  }, [jaConcluido, onConcluido]);

  const iniciarJogo = () => {
    // Escolhe um secreto aleatoriamente da lista completa
    const personagemAleatorio = PERSONAGENS[Math.floor(Math.random() * PERSONAGENS.length)];
    setPersonagemSecreto(personagemAleatorio);

    const personagensEmbaralhados = shuffle(PERSONAGENS);
    setGridPersonagens(personagensEmbaralhados);
    
    // Inicialmente, todos os personagens (na ordem embaralhada) estão visíveis
    setPersonagensVisiveis(personagensEmbaralhados);

    setPerguntasFeitas([]);
    setPerguntaSelecionada('');
    setFeedback(null);
    setVenceu(false);
  };

  const fazerPergunta = () => {
    if (!perguntaSelecionada) return;

    const pergunta = PERGUNTAS.find(p => p.id === perguntaSelecionada);
    let respostaDoComputador;

    if (pergunta.valor) {
      respostaDoComputador = personagemSecreto[pergunta.atributo] === pergunta.valor;
    } else {
      respostaDoComputador = personagemSecreto[pergunta.atributo] === true;
    }

    const novosFiltrados = personagensVisiveis.filter(p => {
      if (pergunta.valor) {
        return respostaDoComputador ? p[pergunta.atributo] === pergunta.valor : p[pergunta.atributo] !== pergunta.valor;
      } else {
        return respostaDoComputador ? p[pergunta.atributo] === true : p[pergunta.atributo] === false;
      }
    });

    setPersonagensVisiveis(novosFiltrados);

    // ATUALIZAÇÃO DO FEEDBACK (Lógica nova de resposta automática)
    if (novosFiltrados.length === 1) {
      // Caso só reste 1 personagem (feedback especial)
      setFeedback({
        tipo: 'info',
        mensagem: '🎯 Só resta 1 personagem! Parabéns, você descobriu o personagem secreto. Clique nele para fazer seu palpite final!'
      });
    } else {
      const textoSimOuNao = respostaDoComputador ? "Sim! ✅" : "Não ❌";
      const textoComplementar = respostaDoComputador
        ? `O personagem secreto TEM essa característica.`
        : `O personagem secreto NÃO TEM essa característica.`;

      let mensagemFinal = `${textoSimOuNao} ${textoComplementar} (Restam ${novosFiltrados.length})`;

      // Se restarem 3 ou menos, avisa que pode "chutar" (Lógica nova)
      if (novosFiltrados.length <= 3 && novosFiltrados.length > 1) {
        mensagemFinal += " Você já pode tentar chutar clicando no personagem!";
      }

      setFeedback({
        tipo: respostaDoComputador ? 'sucesso' : 'erro',
        mensagem: mensagemFinal
      });
    }

    setPerguntasFeitas([...perguntasFeitas, {
      pergunta: pergunta.texto,
      resposta: respostaDoComputador ? 'Sim' : 'Não',
      isYes: respostaDoComputador
    }]);

    setPerguntaSelecionada('');
  };

  // Lógica de "chute" quando restam poucos personagens
  const podeChutar = personagensVisiveis.length <= 3;

  const tentarAdivinhar = (personagem) => {
    // Só permite chutar se a condição for atendida
    if (!podeChutar) return;

    if (personagem.id === personagemSecreto.id) {
      setVenceu(true);
      setFeedback({
        tipo: 'vitoria',
        mensagem: `🎉 PARABÉNS! Você descobriu! Era ${personagemSecreto.nome}!`
      });

      if (!jaConcluido) {
        onConcluido && onConcluido();
        setJaConcluido(true);
      }

    } else {
      // Feedback de erro ao chutar, sem reiniciar o jogo imediatamente
      setFeedback({
        tipo: 'erro',
        mensagem: `❌ Não é ${personagem.nome}! O jogo continua. Tente outra pergunta ou outro palpite.`
      });
    }
  };

  return (
    <div className="cara-cara-container">
      <div className="cara-cara-header">
        <h2 className="cara-cara-title">🎮 Quem é o Personagem Secreto?</h2>

        <p className="cara-cara-subtitle" style={{ marginTop: '1rem', fontWeight: 'bold' }}>
          Objetivo: Descobrir quem é o personagem secreto!
        </p>

        <div style={{
          background: 'rgba(255,255,255,0.2)',
          padding: '15px',
          borderRadius: '10px',
          margin: '15px auto',
          maxWidth: '600px',
          textAlign: 'left',
          color: 'white'
        }}>
          <h4 style={{ margin: '0 0 10px 0', textDecoration: 'underline' }}>Como jogar:</h4>
          <ol style={{ paddingLeft: '20px', lineHeight: '1.5' }}>
            <li>Escolha uma pergunta na lista abaixo (ex: "Usa chapéu?").</li>
            <li>O jogo vai responder <strong>Sim</strong> ou <strong>Não</strong> e remover os personagens errados.</li>
            <li><strong>Quando restarem 3 ou menos personagens</strong>, você pode clicar neles para dar seu palpite final!</li>
          </ol>
        </div>
      </div>

      {!venceu && (
        <>
          {/* Grade de Personagens */}
          <div className="grade-personagens-container">
            <h3 className="section-title">
              Personagens ({personagensVisiveis.length} restantes)
            </h3>
            <div className="grade-personagens">
              {/* CORREÇÃO: Usando gridPersonagens (lista embaralhada e fixa para a rodada) para renderizar a grade */}
              {gridPersonagens.map(p => {
                // Verifica se este personagem ainda é um "suspeito" válido
                const visivel = personagensVisiveis.some(pv => pv.id === p.id);
                const isClickable = visivel && podeChutar;

                return (
                  <div
                    key={p.id}
                    className={`personagem-card ${!visivel ? 'eliminado' : ''} ${isClickable ? 'pode-clicar' : ''}`}
                    onClick={() => isClickable && tentarAdivinhar(p)}
                    title={isClickable ? "Clique para chutar!" : ""}
                  >
                    <div className="avatar-container">
                      <PersonagemAvatar personagem={p} />
                    </div>
                    <div className="personagem-nome">{p.nome}</div>
                    <div className="personagem-descricao">{p.descricao}</div>
                    {!visivel && <div className="eliminado-badge">❌</div>}
                    {isClickable && <div className="clique-badge">👆 Palpite?</div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fazer Pergunta */}
          <div className="pergunta-container">
            <h3 className="section-title">Faça uma pergunta:</h3>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <select
                className="pergunta-select"
                style={{ marginBottom: 0, maxWidth: '400px' }}
                value={perguntaSelecionada}
                onChange={(e) => setPerguntaSelecionada(e.target.value)}
              >
                <option value="">Selecione uma pergunta...</option>
                {PERGUNTAS.map(p => (
                  <option key={p.id} value={p.id}>{p.texto}</option>
                ))}
              </select>

              <button
                className="btn-resposta btn-sim"
                style={{ background: '#3b82f6', padding: '10px 20px', minWidth: '120px' }}
                disabled={!perguntaSelecionada}
                onClick={fazerPergunta}
              >
                🔍 Perguntar
              </button>
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`feedback-box ${feedback.tipo}`}>
              {feedback.mensagem}
            </div>
          )}

          {/* Histórico de Perguntas */}
          {perguntasFeitas.length > 0 && (
            <div className="historico-container">
              <h3 className="section-title">📋 Perguntas Feitas:</h3>
              <div className="historico-lista">
                {perguntasFeitas.map((item, idx) => (
                  <div key={idx} className="historico-item">
                    <span className="historico-numero">{idx + 1}</span>
                    <span className="historico-pergunta">{item.pergunta}</span>
                    <span className={`historico-resposta ${item.isYes ? 'correta' : 'incorreta'}`}>
                      {item.resposta}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Tela de Vitória */}
      {venceu && (
        <div className="vitoria-container">
          <div className="vitoria-emoji">🏆</div>
          <h2 className="vitoria-title">Você Venceu!</h2>
          <div className="vitoria-personagem">
            {personagemSecreto && (
                <>
                    <PersonagemAvatar personagem={personagemSecreto} />
                    <div className="vitoria-personagem-nome">{personagemSecreto.nome}</div>
                    <div className="vitoria-personagem-desc">{personagemSecreto.descricao}</div>
                </>
            )}
          </div>
          <p className="vitoria-texto">
            Você usou <strong>{perguntasFeitas.length} perguntas</strong> para descobrir!
          </p>
          <div className="conceito-box-end">
            <h3><strong>💡 O que aprendemos?</strong></h3><br></br>
            <p>
              Isso foi <strong>Abstração</strong>! Você usou as características mais importantes (cabelo, óculos, chapéu...) para filtrar e encontrar o personagem secreto.
            </p>
          </div>
          <button className="btn-jogar-novamente" onClick={iniciarJogo}>
            🔄 Jogar Novamente
          </button>
        </div>
      )}
    </div>
  );
}
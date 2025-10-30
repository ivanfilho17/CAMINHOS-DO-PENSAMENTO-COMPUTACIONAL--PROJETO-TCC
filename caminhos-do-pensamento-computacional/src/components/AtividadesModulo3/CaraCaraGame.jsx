import React, { useState, useEffect } from 'react';
import './CaraCaraGame.css';

// Personagens do jogo (12 personagens com características visuais claras)
const PERSONAGENS = [
  {
    id: 1,
    nome: 'Ana',
    oculos: true,
    cabelo: 'loiro',
    chapeu: false,
    bigode: false,
    descricao: 'Loira com óculos'
  },
  {
    id: 2,
    nome: 'Bruno',
    oculos: false,
    cabelo: 'preto',
    chapeu: true,
    bigode: true,
    descricao: 'Moreno de chapéu com barba'
  },
  {
    id: 3,
    nome: 'Clara',
    oculos: true,
    cabelo: 'ruivo',
    chapeu: false,
    bigode: false,
    descricao: 'Ruiva com óculos'
  },
  {
    id: 4,
    nome: 'Diego',
    oculos: false,
    cabelo: 'preto',
    chapeu: false,
    bigode: false,
    descricao: 'Moreno sem acessórios'
  },
  {
    id: 5,
    nome: 'Elisa',
    oculos: false,
    cabelo: 'loiro',
    chapeu: true,
    bigode: false,
    descricao: 'Loira de chapéu'
  },
  {
    id: 6,
    nome: 'Fabio',
    oculos: true,
    cabelo: 'castanho',
    chapeu: false,
    bigode: true,
    descricao: 'Castanho com óculos e barba'
  },
  {
    id: 7,
    nome: 'Gabi',
    oculos: false,
    cabelo: 'ruivo',
    chapeu: true,
    bigode: false,
    descricao: 'Ruiva de chapéu'
  },
  {
    id: 8,
    nome: 'Hugo',
    oculos: true,
    cabelo: 'loiro',
    chapeu: true,
    bigode: false,
    descricao: 'Loiro com óculos e chapéu'
  },
  {
    id: 9,
    nome: 'Iris',
    oculos: false,
    cabelo: 'castanho',
    chapeu: false,
    bigode: false,
    descricao: 'Castanha sem acessórios'
  },
  {
    id: 10,
    nome: 'João',
    oculos: false,
    cabelo: 'preto',
    chapeu: false,
    bigode: true,
    descricao: 'Moreno com barba'
  },
  {
    id: 11,
    nome: 'Karla',
    oculos: true,
    cabelo: 'castanho',
    chapeu: true,
    bigode: false,
    descricao: 'Castanha com óculos e chapéu'
  },
  {
    id: 12,
    nome: 'Lucas',
    oculos: false,
    cabelo: 'loiro',
    chapeu: false,
    bigode: false,
    descricao: 'Loiro sem acessórios'
  }
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
  const [personagemSecreto, setPersonagemSecreto] = useState(null);
  const [personagensVisiveis, setPersonagensVisiveis] = useState(PERSONAGENS);
  const [perguntasFeitas, setPerguntasFeitas] = useState([]);
  const [perguntaSelecionada, setPerguntaSelecionada] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [venceu, setVenceu] = useState(false);
  const [tentativaFinal, setTentativaFinal] = useState(false);

  useEffect(() => {
    iniciarJogo();
  }, []);

  const iniciarJogo = () => {
    const personagemAleatorio = PERSONAGENS[Math.floor(Math.random() * PERSONAGENS.length)];
    setPersonagemSecreto(personagemAleatorio);
    setPersonagensVisiveis(PERSONAGENS);
    setPerguntasFeitas([]);
    setPerguntaSelecionada('');
    setFeedback(null);
    setVenceu(false);
    setTentativaFinal(false);
  };

  const fazerPergunta = (resposta) => {
    if (!perguntaSelecionada) return;

    const pergunta = PERGUNTAS.find(p => p.id === perguntaSelecionada);
    let respostaCorreta;

    if (pergunta.valor) {
      respostaCorreta = personagemSecreto[pergunta.atributo] === pergunta.valor;
    } else {
      respostaCorreta = personagemSecreto[pergunta.atributo] === true;
    }

    const acertou = resposta === respostaCorreta;

    setPerguntasFeitas([...perguntasFeitas, {
      pergunta: pergunta.texto,
      resposta: resposta ? 'Sim' : 'Não',
      correta: acertou
    }]);

    if (acertou) {
      const novosFiltrados = personagensVisiveis.filter(p => {
        if (pergunta.valor) {
          return resposta ? p[pergunta.atributo] === pergunta.valor : p[pergunta.atributo] !== pergunta.valor;
        } else {
          return resposta ? p[pergunta.atributo] === true : p[pergunta.atributo] === false;
        }
      });

      setPersonagensVisiveis(novosFiltrados);
      setFeedback({ tipo: 'sucesso', mensagem: `✅ Correto! Restam ${novosFiltrados.length} personagens.` });

      if (novosFiltrados.length === 1) {
        setTimeout(() => {
          setFeedback({
            tipo: 'info',
            mensagem: '🎯 Só resta 1 personagem! Clique nele para fazer seu palpite final!'
          });
          setTentativaFinal(true);
        }, 1500);
      }
    } else {
      setFeedback({ tipo: 'erro', mensagem: '❌ Essa não era a resposta correta. Tente outra pergunta!' });
    }

    setPerguntaSelecionada('');
  };

  const tentarAdivinhar = (personagem) => {
    if (!tentativaFinal) return;

    if (personagem.id === personagemSecreto.id) {
      setVenceu(true);
      setFeedback({
        tipo: 'vitoria',
        mensagem: `🎉 PARABÉNS! Você descobriu! Era ${personagemSecreto.nome}!`
      });
      onConcluido && onConcluido();
    } else {
      setFeedback({
        tipo: 'erro',
        mensagem: `😢 Não era ${personagem.nome}... O personagem secreto era ${personagemSecreto.nome}. Tente novamente!`
      });
      setTimeout(() => {
        iniciarJogo();
      }, 3000);
    }
  };

  return (
    <div className="cara-cara-container">
      <div className="cara-cara-header">
        <h2 className="cara-cara-title">🎮 Jogo Cara a Cara</h2>
        <p className="cara-cara-subtitle">
          Use atributos para filtrar e descobrir o personagem secreto!
        </p>
      </div>

      {!venceu && (
        <>
          {/* Grade de Personagens */}
          <div className="grade-personagens-container">
            <h3 className="section-title">
              Personagens ({personagensVisiveis.length} restantes)
            </h3>
            <div className="grade-personagens">
              {PERSONAGENS.map(p => {
                const visivel = personagensVisiveis.some(pv => pv.id === p.id);
                const podeClicar = tentativaFinal && visivel;

                return (
                  <div
                    key={p.id}
                    className={`personagem-card ${!visivel ? 'eliminado' : ''} ${podeClicar ? 'pode-clicar' : ''}`}
                    onClick={() => podeClicar && tentarAdivinhar(p)}
                  >
                    <div className="avatar-container">
                      <PersonagemAvatar personagem={p} />
                    </div>
                    <div className="personagem-nome">{p.nome}</div>
                    <div className="personagem-descricao">{p.descricao}</div>
                    {!visivel && <div className="eliminado-badge">❌</div>}
                    {podeClicar && <div className="clique-badge">👆 Clique aqui!</div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fazer Pergunta */}
          {!tentativaFinal && (
            <div className="pergunta-container">
              <h3 className="section-title">Faça uma pergunta:</h3>
              <select
                className="pergunta-select"
                value={perguntaSelecionada}
                onChange={(e) => setPerguntaSelecionada(e.target.value)}
              >
                <option value="">Selecione uma pergunta...</option>
                {PERGUNTAS.map(p => (
                  <option key={p.id} value={p.id}>{p.texto}</option>
                ))}
              </select>

              {perguntaSelecionada && (
                <div className="botoes-resposta">
                  <button
                    className="btn-resposta btn-sim"
                    onClick={() => fazerPergunta(true)}
                  >
                    👍 Sim
                  </button>
                  <button
                    className="btn-resposta btn-nao"
                    onClick={() => fazerPergunta(false)}
                  >
                    👎 Não
                  </button>
                </div>
              )}
            </div>
          )}

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
                    <span className={`historico-resposta ${item.correta ? 'correta' : 'incorreta'}`}>
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
            <PersonagemAvatar personagem={personagemSecreto} />
            <div className="vitoria-personagem-nome">{personagemSecreto.nome}</div>
            <div className="vitoria-personagem-desc">{personagemSecreto.descricao}</div>
          </div>
          <p className="vitoria-texto">
            Você usou <strong>{perguntasFeitas.length} perguntas</strong> para descobrir!
          </p>
          <div className="conceito-box">
            <strong>💡 Você aplicou Abstração!</strong>
            <p>
              Você usou ATRIBUTOS (óculos, cabelo, chapéu, barba) para FILTRAR informações
              e resolver o problema. Isso é abstração em ação!
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
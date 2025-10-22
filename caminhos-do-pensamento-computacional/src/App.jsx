import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import Module from './pages/Module';
import IntroPage from './pages/IntroPage';
import AboutModal from './components/AboutModal';
import AlertModal from './components/AlertModal';
import ProgressBar from './components/ProgressBar';

// Dados dos módulos
// NOVOS DADOS DOS MÓDULOS (4 Pilares)
const MODULES = [
  {
    id: 1,
    title: 'Módulo 1: Decomposição',
    keyPoints: ['Aprenda a quebrar problemas grandes em partes menores.'],
    character: { face: '🧩' },
    teoria: {
      tituloPrincipal: 'Módulo 1: Decomposição',
      subtitulo: 'O Poder de "Quebrar" o Problema!',
      introducao: 'Bem-vindo ao primeiro caminho! A Decomposição é a primeira e mais importante técnica para resolver problemas.',
      explicacao: 'É bem simples: se um problema parece muito grande ou complexo, "quebre-o" em partes menores e mais fáceis de gerir. São os "subproblemas".',
      exemploPrincipal: {
        titulo: 'Pense em arrumar o seu quarto:',
        tarefa: 'A tarefa "Arrumar o quarto" é grande! Mas você pode decompor em:',
        subproblemas: [
          'Subproblema 1: Guardar os brinquedos.',
          'Subproblema 2: Arrumar a cama.',
          'Subproblema 3: Colocar as roupas sujas no cesto.',
        ],
        conclusao: 'Depois de resolver cada parte menor, o problema original (o quarto bagunçado) está resolvido!',
      },
      exemplosReais: {
           titulo: "Mais Exemplos da Vida Real",
           itens: [
                { titulo: "Fazer um Sanduíche🥪", desc: "A tarefa 'fazer um lanche' pode ser dividida em 'preparar o sumo' e 'fazer um sanduíche'. O sanduíche em si decompõe-se em: pegar o pão, passar manteiga, colocar o queijo." },
                { titulo: "Construir com Blocos🧱", desc: "Você não faz um castelo de Lego de uma vez. Decompõe em: 1. Fazer a base; 2. Fazer as torres; 3. Fazer o portão." },
                { titulo: "Trabalho da Escola📝", desc: "Decompor em: 1. Pesquisar o tema; 2. Escrever o texto; 3. Fazer os desenhos; 4. Criar a capa." }
           ]
      }
    },
    video: 'https://www.youtube.com/embed/s4qHp_ca420',
    quiz: [
      { q: 'O que significa "Decomposição"?', options: ['Juntar partes de um problema', 'Quebrar um problema em partes menores', 'Ignorar o problema'], answer: 1 },
      { q: 'Qual destes NÃO é um subproblema da tarefa "Fazer um bolo"?', options: ['Misturar os ingredientes', 'Assar a massa', 'Comer o bolo'], answer: 2 },
      { q: 'Ao planejar uma viagem, "comprar passagens" e "reservar hotel" são exemplos de?', options: ['Abstração', 'Decomposição', 'Padrões'], answer: 1 },
      { q: 'Por que decompor um problema ajuda?', options: ['Porque as partes menores são mais fáceis de solucionar', 'Porque deixa o problema mais complicado', 'Porque elimina partes do problema'], answer: 0 },
      { q: 'Organizar os brinquedos é um subproblema de qual tarefa maior?', options: ['Jogar futebol', 'Arrumar o quarto', 'Fazer a lição de casa'], answer: 1 },
    ],
    atividades: ['puzzle', 'mochila', 'carro']
  },
  { id: 2, title: 'Módulo 2: Padrões', keyPoints: ['Descubra como encontrar semelhanças.'], character: { face: '🎨' }, quiz: [] },
  { id: 3, title: 'Módulo 3: Abstração', keyPoints: ['Concentre-se no que é importante.'], character: { face: '🎯' }, quiz: [] },
  { id: 4, title: 'Módulo 4: Algoritmos', keyPoints: ['Crie uma sequência de passos organizados.'], character: { face: '👣' }, quiz: [] },
];

// 3. DADOS PARA O QUIZ DA INTRODUÇÃO

const INTRO_DATA = {
  quiz: [
    {
      q: 'O que é Pensamento Computacional?',
      options: ['Pensar exatamente como um robô.', 'Uma forma de organizar ideias para resolver problemas.', 'Usar o computador o dia todo.'],
      answer: 1, // Resposta: b
    },
    {
      q: 'Quais são os 4 pilares do Pensamento Computacional?',
      options: ['Decomposição, Reconhecimento de Padrões, Abstração e Algoritmos.', 'Ler, Escrever, Contar e Desenhar.', 'Sequências, Condições, Repetições e Robôs.'],
      answer: 0, // Resposta: a
    },
  ]
};

export default function App() {
  const [route, setRoute] = useState({ name: 'home' });
  const [progress, setProgress] = useState({});
  const [aboutOpen, setAboutOpen] = useState(false);
  const [alert, setAlert] = useState({ isOpen: false, message: '' });

  // Este efeito executa sempre que a 'route' mudar.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  const openModule = (moduleId) => setRoute({ name: 'module', moduleId });
  const goHome = () => setRoute({ name: 'home' });

  const startIntro = () => setRoute({ name: 'intro' });

  // marca concluído e garante percent = 100
  const completeModule = (moduleId) => {
    setProgress((p) => ({
      ...p,
      [moduleId]: {
        ...(p[moduleId] || {}),
        completed: true,    // Marca como completo na sessão atual
        percent: 100,
        everCompleted: true, // <<< MARCA QUE JÁ FOI COMPLETADO ALGUMA VEZ
        badges: Array.from(new Set([...(p[moduleId]?.badges || []), `badge-module-${moduleId}`])),
      },
    }));
  };

  // atualiza progresso percentual temporário (não marca concluído automaticamente)
  const updateModuleProgress = (moduleId, percent) => {
    setProgress((p) => ({
      ...p,
      [moduleId]: {
        ...(p[moduleId] || {}), // Mantém o everCompleted se já existir
        percent,
        completed: p[moduleId]?.completed || percent === 100, // Não muda completed aqui, só se chegar a 100
        badges: p[moduleId]?.badges || [],
      },
    }));
  };

  const resetModule = (moduleId) => {
    setProgress((p) => ({
      ...p,
      [moduleId]: {
        ...p[moduleId], // Mantém badges e everCompleted
        completed: false, // Permite entrar novamente
        percent: 0,       // Reseta o progresso da sessão atual
      },
    }));
  };

  const badges = useMemo(() => Object.values(progress).flatMap((m) => m.badges || []), [progress]);

  return (
    <div className="app-root">
      <Header
        onOpenAbout={() => setAboutOpen(true)}
        onOpenForm={() => window.open('https://forms.gle/', '_blank')}
        showHomeButtons={route.name === 'home'}
      />

      <main className={`container ${route.name === 'home' ? 'home-bg' : ''}`}>
        {route.name === 'home' && (
          <Home
            modules={MODULES}
            onStart={startIntro}
            onOpenModule={openModule}
            progress={progress}
            onShowAlert={(message) => setAlert({ isOpen: true, message })}
          />
        )}

        {/* BLOCO PARA RENDERIZAR IntroPage */}
        {route.name === 'intro' && (
            <IntroPage
                quizData={INTRO_DATA.quiz}
                onBackHome={goHome}
                // Após completar o quiz da intro, vai para o Módulo 1 (Decomposição)
                onCompleteIntro={() => openModule(1)}
            />
        )}

        {route.name === 'module' && (
          <Module
            moduleData={MODULES.find((m) => m.id === route.moduleId)}
            onComplete={() => completeModule(route.moduleId)}
            onBackHome={() => goHome()}
            onAdvance={() => {
              const currentModule = MODULES.find(m => m.id === route.moduleId);
              const nextModuleIndex = MODULES.findIndex(m => m.id === route.moduleId) + 1;
              if (nextModuleIndex < MODULES.length) {
                const nextModule = MODULES[nextModuleIndex];
                // Verifica se o próximo módulo está desbloqueado ANTES de navegar
                const prevModuleId = nextModule.id - 1;
                if (progress[prevModuleId]?.everCompleted) {
                  setRoute({ name: 'module', moduleId: nextModule.id });
                } else {
                  setAlert({ isOpen: true, message: 'Você precisa completar o módulo anterior primeiro!' });
                }
              } else {
                goHome(); // Volta para home se for o último módulo
              }
            }}
            onReset={resetModule} // Passar a função correta
            progress={progress[route.moduleId] || {}} // Passa o objeto de progresso
            onProgressUpdate={(percent) => updateModuleProgress(route.moduleId, percent)}
          />
        )}
      </main>

      {route.name === 'home' && (
        <footer className="footer">
          <div>© 2025 — Projeto TCC • Desenvolvido em React</div>
          <div className="badge-row">{badges.map((b) => <span key={b} className="mini-badge">🏅</span>)}</div>
        </footer>
      )}

      {aboutOpen && <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />}

      {/* Renderizar o novo modal de alerta */}
      {aboutOpen && <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />}
      <AlertModal
        isOpen={alert.isOpen}
        message={alert.message}
        onClose={() => setAlert({ isOpen: false, message: '' })}
      />

    </div>
  );
}
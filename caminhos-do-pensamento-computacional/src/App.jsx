import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import Module from './pages/Module';
import AboutModal from './components/AboutModal';
import AlertModal from './components/AlertModal';
import ProgressBar from './components/ProgressBar';


// Dados dos módulos
const MODULES = [
  {
    id: 1,
    title: 'Módulo 1: Sequências',
    keyPoints: [
      'Entenda como instruções em ordem geram ações lógicas.',
      'Representação passo a passo',
      'Exercícios práticos de sequência lógica',
    ],
    character: { name: 'Byte', face: '👣' },
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    quiz: [
      {
        q: 'O que melhor define um algoritmo?',
        options: ['Uma fórmula matemática complexa', 'Uma lista de passos para resolver um problema', 'Um componente de computador'],
        answer: 1,
      },
      {
        q: 'Qual característica garante que um algoritmo tenha um fim?',
        options: ['Ser Claro', 'Ser Preciso', 'Ser Finito'],
        answer: 2,
      },
      {
        q: 'Para fazer um sanduíche, qual passo vem PRIMEIRO?',
        options: ['Colocar o recheio', 'Pegar o pão', 'Passar manteiga'],
        answer: 1,
      },
      {
        q: 'Se um algoritmo não for "Preciso", o que pode acontecer?',
        options: ['Ele pode ser entendido de várias maneiras e dar errado', 'Ele nunca termina', 'Ele funciona, mas demora muito'],
        answer: 0,
      },
      {
        q: 'Qual dos exemplos abaixo NÃO é um algoritmo do dia a dia?',
        options: ['As regras de um jogo de futebol', 'Uma receita de macarrão', 'Pensar sobre o que sonhou na noite passada'],
        answer: 2,
      },
      {
        q: 'A ordem dos passos em um algoritmo de sequência é importante?',
        options: ['Não, a ordem não importa', 'Sim, a ordem é fundamental para o resultado correto', 'Apenas em algoritmos de computador'],
        answer: 1,
      },
      {
        q: 'Qual é o objetivo principal de um algoritmo ser "Eficiente"?',
        options: ['Ser o mais bonito', 'Resolver o problema da melhor e mais rápida forma', 'Funcionar apenas uma vez'],
        answer: 1,
      },
    ],
  },
  {
    id: 2,
    title: 'Módulo 2: Condições',
    keyPoints: [
      'Aprenda como tomar decisões em algoritmos.',
      'Fluxos alternativos',
      'Exercícios com escolhas condicionais',
    ],
    character: { name: 'Ifa', face: '🚦' },
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    quiz: [
      {
        q: 'Se estiver chovendo, o que fazemos?',
        options: ['Vamos à praia', 'Pegamos um guarda-chuva', 'Cortamos grama'],
        answer: 1,
      },
    ],
  },
  {
    id: 3,
    title: 'Módulo 3: Repetições',
    keyPoints: [
      'Descubra como simplificar ações repetitivas com loops.',
      'Repetir até condição',
      'Problemas que se resolvem com repetições',
    ],
    character: { name: 'Loopi', face: '🔁' },
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    quiz: [
      {
        q: 'Qual estrutura repete ações várias vezes?',
        options: ['Condição', 'Loop/Repetição', 'Variável'],
        answer: 1,
      },
    ],
  },
];

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
            onStart={() => openModule(1)}
            onOpenModule={openModule}
            progress={progress}
            onShowAlert={(message) => setAlert({ isOpen: true, message })}
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
      <AlertModal
        isOpen={alert.isOpen}
        message={alert.message}
        onClose={() => setAlert({ isOpen: false, message: '' })}
      />

    </div>
  );
}
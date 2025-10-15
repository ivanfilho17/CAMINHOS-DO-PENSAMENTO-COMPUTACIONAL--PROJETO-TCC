import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import Module from './pages/Module';
import AboutModal from './components/AboutModal';
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
    character: { name: 'Byte', face: '🤖' },
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    quiz: [
      {
        q: 'Qual é o próximo passo numa receita: cortar legumes ou assar o bolo?',
        options: ['Assar o bolo', 'Cortar legumes', 'Servir'],
        answer: 1,
      },
      {
        q: 'Sequência correta para lavar mãos: molhar -> ensaboar -> enxaguar?',
        options: ['Não', 'Sim'],
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

  const openModule = (moduleId) => setRoute({ name: 'module', moduleId });
  const goHome = () => setRoute({ name: 'home' });

  // marca concluído e garante percent = 100
  const completeModule = (moduleId) => {
    setProgress((p) => ({
      ...p,
      [moduleId]: {
        ...(p[moduleId] || {}),
        completed: true,
        percent: 100,
        badges: Array.from(new Set([...(p[moduleId]?.badges || []), `badge-module-${moduleId}`])),
      },
    }));
  };

  // atualiza progresso percentual temporário (não marca concluído automaticamente)
  const updateModuleProgress = (moduleId, percent) => {
    setProgress((p) => ({
      ...p,
      [moduleId]: {
        ...(p[moduleId] || {}),
        percent,
        completed: p[moduleId]?.completed || percent === 100,
        badges: p[moduleId]?.badges || [],
      },
    }));
  };

  const resetModule = (moduleId) => {
    setProgress((p) => ({ ...p, [moduleId]: { completed: false, percent: 0, badges: [] } }));
  };

  const badges = useMemo(() => Object.values(progress).flatMap((m) => m.badges || []), [progress]);

  return(
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
          />
        )}

        {route.name === 'module' && (
          <Module
            moduleData={MODULES.find((m) => m.id === route.moduleId)}
            onComplete={() => completeModule(route.moduleId)}
            onBackHome={() => goHome()}
            onAdvance={() => {
              const nextId = route.moduleId + 1;
              if (nextId <= MODULES.length) setRoute({ name: 'module', moduleId: nextId });
              else setRoute({ name: 'home' });
            }}
            onReset={() => resetModule(route.moduleId)}
            progress={progress[route.moduleId] || { percent: 0 }}
            onProgressUpdate={(percent) => updateModuleProgress(route.moduleId, percent)}
          />
        )}
      </main>

      <footer className="footer">
        <div>© 2025 — Projeto TCC • Desenvolvido em React</div>
        <div className="badge-row">{badges.map((b) => <span key={b} className="mini-badge">🏅</span>)}</div>
      </footer>

      {aboutOpen && <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />}
    </div>
  );
}
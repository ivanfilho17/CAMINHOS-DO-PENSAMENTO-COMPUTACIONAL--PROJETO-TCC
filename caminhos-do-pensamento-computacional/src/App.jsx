import React, { useState, useMemo, useEffect, lazy, Suspense } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import ModulesHomePage from "./pages/ModulesHomePage";
import { useLocalStorage } from "./hooks/useLocalStorage";
import ProgressBar from "./components/ProgressBar";

// Componentes pesados com lazy loading
const Module = lazy(() => import("./pages/Module"));
const IntroPage = lazy(() => import("./pages/IntroPage"));
const AboutModal = lazy(() => import("./components/AboutModal"));
const AlertModal = lazy(() => import("./components/AlertModal"));

// Componente de loading
function LoadingFallback() {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Carregando...</p>
    </div>
  );
}

// Dados dos módulos
const MODULES = [
  // MÓDULO 1: DECOMPOSIÇÃO
  {
    id: 1,
    nameModule: "Decomposição",
    title: "Decomposição",
    keyPoints: ["Aprenda a quebrar problemas grandes em partes menores."],
    character: { face: "🧩" },
    teoria: {
      tituloPrincipal: "Decomposição",
      subtitulo: 'O Poder de "Quebrar" o Problema!',
      introducao:
        "Bem-vindo ao primeiro caminho! A Decomposição é a primeira e mais importante técnica para resolver problemas.",
      explicacao:
        'É bem simples: se um problema parece muito grande ou complexo, "quebre-o" em partes menores e mais fáceis de gerir. São os "subproblemas".',
      exemploPrincipal: {
        titulo: "Pense em arrumar o seu quarto:",
        tarefa:
          'A tarefa "Arrumar o quarto" é grande! Mas você pode decompor em:',
        subproblemas: [
          "Subproblema 1: Guardar os brinquedos.",
          "Subproblema 2: Arrumar a cama.",
          "Subproblema 3: Colocar as roupas sujas no cesto.",
        ],
        conclusao:
          "Depois de resolver cada parte menor, o problema original (o quarto bagunçado) está resolvido!",
      },
      exemplosReais: {
        titulo: "Mais Exemplos da Vida Real",
        itens: [
          {
            titulo: "Fazer um Sanduíche🥪",
            desc: "A tarefa 'fazer um lanche' pode ser dividida em 'preparar o sumo' e 'fazer um sanduíche'. O sanduíche em si decompõe-se em: pegar o pão, passar manteiga, colocar o queijo.",
          },
          {
            titulo: "Construir com Blocos🧱",
            desc: "Você não faz um castelo de Lego de uma vez. Decompõe em: 1. Fazer a base; 2. Fazer as torres; 3. Fazer o portão.",
          },
          {
            titulo: "Trabalho da Escola📝",
            desc: "Decompor em: 1. Pesquisar o tema; 2. Escrever o texto; 3. Fazer os desenhos; 4. Criar a capa.",
          },
          {
            titulo: "Planejar um Jogo de Futebol⚽",
            desc: "Decompor a atividade em: 1. Montar os times. 2. Definir as regras. 3. Marcar o campo. Assim, a organização fica mais fácil!",
          },
        ],
      },
    },
    video: "https://www.youtube.com/embed/VIDEO_DECOMPOSICAO",
    atividades: ["mochila", "carro", "puzzle"],
    quiz: [
      {
        q: 'O que significa "Decomposição"?',
        options: [
          "Juntar partes de um problema",
          "Quebrar um problema em partes menores",
          "Ignorar o problema",
        ],
        answer: 1,
      },
      {
        q: 'Qual destes NÃO é um subproblema da tarefa "Fazer um bolo"?',
        options: ["Misturar os ingredientes", "Assar a massa", "Comer o bolo"],
        answer: 2,
      },
      {
        q: 'Ao planejar uma viagem, "comprar passagens" e "reservar hotel" são exemplos de?',
        options: ["Abstração", "Decomposição", "Padrões"],
        answer: 1,
      },
      {
        q: "Por que decompor um problema ajuda?",
        options: [
          "Porque as partes menores são mais fáceis de solucionar",
          "Porque deixa o problema mais complicado",
          "Porque elimina partes do problema",
        ],
        answer: 0,
      },
      {
        q: "Organizar os brinquedos é um subproblema de qual tarefa maior?",
        options: ["Jogar futebol", "Arrumar o quarto", "Fazer a lição de casa"],
        answer: 1,
      },
    ],
    finalMessage:
      "Você dominou a habilidade de quebrar problemas maiores em partes menores para resolver problemas ou realizar tarefas!",
  },

  // MÓDULO 2: PADRÕES
  {
    id: 2,
    nameModule: "Reconhecimento de Padrões",
    title: "Padrões",
    keyPoints: ["Descubra como encontrar semelhanças para resolver problemas."],
    character: { face: "🎨" },
    teoria: {
      tituloPrincipal: "Reconhecimento de Padrões",
      subtitulo: "Encontrando Semelhanças!",
      introducao:
        "Bem vindo, esse é o segundo caminho! Você já reparou que muitas coisas se repetem? Os dias da semana, as estações do ano, até mesmo a sua rotina! Tudo isso são Padrões.",
      explicacao:
        "Reconhecer padrões significa identificar o que se repete ou é parecido. Isso nos ajuda a prever o que vem a seguir e a resolver problemas mais rapidamente.",
      exemploPrincipal: {
        titulo: "Pense no seu dia na escola:",
        tarefa: "Toda semana é parecida:",
        subproblemas: [
          "Segunda: Aula de Matemática de manhã",
          "Terça: Aula de Matemática de manhã",
          "Padrão identificado: Matemática sempre de manhã!",
        ],
        conclusao:
          "Ao reconhecer esse padrão, você já sabe o que esperar e pode se preparar melhor!",
      },
      exemplosReais: {
        titulo: "Mais Exemplos da Vida Real",
        itens: [
          {
            titulo: "Músicas 🎵",
            desc: "As músicas têm padrões: refrão que se repete, versos que rimam. Identificar o padrão ajuda a memorizar a letra!",
          },
          {
            titulo: "Matemática 🧮",
            desc: "As sequências numéricas (como 2, 4, 6, 8, 10...) seguem uma lógica repetitiva.",
          },
          {
            titulo: "Natureza 🌿",
            desc: "As folhas de uma árvore têm formatos parecidos. As zebras têm listras. Tudo segue padrões!",
          },
          {
            titulo: "Rotina Semanal 🗓️",
            desc: "Perceber que a aula de Artes é sempre na quinta-feira após o recreio é um padrão que se repete, permitindo que você se prepare apenas para esse dia.",
          },
        ],
      },
    },
    video: "https://www.youtube.com/embed/VIDEO_PADROES",
    atividades: ["completeSequencias", "detetiveObjetos", "padraoSecreto"],
    quiz: [
      {
        q: 'O que significa "Reconhecer Padrões"?',
        options: [
          "Ignorar as diferenças",
          "Identificar o que se repete",
          "Criar algo novo",
        ],
        answer: 1,
      },
      {
        q: "Qual é o padrão na sequência: 2, 4, 6, 8, ...?",
        options: ["Números ímpares", "Números pares", "Números aleatórios"],
        answer: 1,
      },
      {
        q: "Por que reconhecer padrões é útil?",
        options: [
          "Ajuda a prever o que vem depois",
          "Complica as coisas",
          "Não tem utilidade prática",
        ],
        answer: 0,
      },
      {
        q: "Qual destes NÃO é um exemplo de padrão?",
        options: ["Os dias da semana", "O alfabeto", "Um número aleatório"],
        answer: 2,
      },
      {
        q: "Em que situação você usaria reconhecimento de padrões?",
        options: [
          "Ao decorar a letra de uma música que tem refrão",
          "Ao comer um lanche aleatoriamente",
          "Ao dormir sem horário fixo",
        ],
        answer: 0,
      },
    ],
    finalMessage:
      "Você aprendeu a identificar semelhanças e padrões entre problemas para encontrar soluções mais eficientes!",
  },

  // MÓDULO 3: ABSTRAÇÃO
  {
    id: 3,
    nameModule: "Abstração",
    title: "Abstração",
    keyPoints: [
      "Aprenda a focar no essencial e ignorar o que é desnecessário.",
    ],
    character: { face: "🎯" },
    teoria: {
      tituloPrincipal: "Abstração",
      subtitulo: "Entenda o que realmente importa, foque no essencial!",
      introducao:
        'Bem vindo, agora estamos no terceiro caminho! A Abstração é a arte de "filtrar" os detalhes desnecessários e focar apenas no que é essencial para resolver o problema.',
      explicacao:
        "É criar um modelo ou uma representação simplificada. Imagine um mapa de metrô: ele ignora as ruas, prédios e árvores, mostrando apenas as estações e conexões — o essencial.",
      exemploPrincipal: {
        titulo: "Exemplo: O Mapa de Metrô 🗺️",
        tarefa:
          "Ele é uma abstração! Ignora o que não é relevante e mostra só o necessário para navegar: as estações e as linhas.",
        subproblemas: [
          "Não mostra prédios, ruas ou árvores.",
          "Mostra apenas estações e conexões.",
          "Foca no que é útil para o usuário — o essencial.",
        ],
        conclusao:
          "Assim como no pensamento computacional, abstrair é decidir o que é importante e o que pode ser ignorado.",
      },
      exemplosReais: {
        titulo: "Mais Exemplos da Vida Real",
        itens: [
          {
            titulo: "Emojis 🙂",
            desc: "São abstrações perfeitas! Ignoram detalhes como cabelo ou formato do nariz e mostram apenas a emoção essencial.",
          },
          {
            titulo: "Ficha de Cadastro 🧾",
            desc: "Mostra apenas o essencial sobre uma pessoa: nome, data de nascimento, matrícula. Ignora preferências pessoais.",
          },
          {
            titulo: "Agrupar veículos 🚗🚜",
            desc: 'Ao agrupar por "possuem motor", você abstrai cor, tamanho ou marca — foca apenas na característica essencial.',
          },
          {
            titulo: "Mapa de Estradas 🛣️",
            desc: "Um mapa rodoviário ignora detalhes como a cor das casas ou árvores e mostra apenas as cidades e as estradas, focando no caminho essencial.",
          },
        ],
      },
    },
    video: "https://www.youtube.com/embed/VIDEO_ABSTRACAO",
    atividades: ["mapaBairro", "atributosEssenciais", "caraCara"],
    quiz: [
      {
        q: "O que é Abstração?",
        options: [
          "Um desenho muito difícil de fazer.",
          "Focar apenas nos detalhes essenciais e ignorar o resto.",
          "Quebrar um problema em pedaços.",
        ],
        answer: 1,
      },
      {
        q: "Um mapa de metrô é um bom exemplo de abstração porque:",
        options: [
          "Ele mostra todas as ruas e prédios da cidade.",
          "Ele é muito colorido e bonito.",
          "Ele ignora detalhes e mostra só o essencial (estações e linhas).",
        ],
        answer: 2,
      },
      {
        q: '"Identificar atributos essenciais" é uma parte da Abstração.',
        options: ["Verdadeiro.", "Falso."],
        answer: 0,
      },
      {
        q: 'Qual destas é a MELHOR abstração para "aluno" em um sistema de biblioteca?',
        options: [
          "Nome, comida favorita, time que torce.",
          "Nome, número da matrícula, livros que pegou.",
          "Altura, cor dos olhos, nome do cachorro.",
        ],
        answer: 1,
      },
      {
        q: "Quando você usa um emoji 🙂, você está usando...",
        options: [
          "Uma abstração de um rosto feliz.",
          "Uma decomposição de um rosto.",
          "Um padrão de um rosto.",
        ],
        answer: 0,
      },
    ],
    finalMessage:
      "Você desenvolveu a capacidade de focar apenas nos detalhes mais importantes, ignorando o que não é essencial!",
  },

  // MÓDULO 4: ALGORITMOS
  {
    id: 4,
    nameModule: "Algoritmos",
    title: "Algoritmos",
    keyPoints: [
      "Aprenda a criar sequências de passos organizados para resolver problemas.",
    ],
    character: { face: "👣" },
    teoria: {
      tituloPrincipal: "Algoritmos",
      subtitulo: "O Poder de Criar o Plano!",
      introducao:
        "Bem vindo, chegamos ao último caminho! Agora que já quebramos o problema (Decomposição), achamos semelhanças (Padrões) e focamos no essencial (Abstração), estamos prontos para criar o Algoritmo.",
      explicacao:
        'Um algoritmo é a "receita" final! É uma sequência de passos clara e ordenada para resolver o problema.',
      blocosConstrucao: {
        titulo:
          "Para criar algoritmos, precisamos de 3 blocos de construção mágicos:",
        blocos: [
          {
            nome: "Sequências",
            icone: "➡️",
            descricao: "A ordem exata dos passos",
            exemplo: "Ex: 1. Pegar a meia; 2. Calçar a meia. A ordem importa!",
          },
          {
            nome: "Seleções (Condições)",
            icone: "🔀",
            descricao: "A habilidade de fazer escolhas",
            exemplo:
              "Ex: SE o sinal estiver verde, ENTÃO atravesse; SENÃO espere.",
          },
          {
            nome: "Repetições (Laços)",
            icone: "🔁",
            descricao: "A habilidade de fazer algo várias vezes",
            exemplo:
              "Ex: ENQUANTO o prato não estiver limpo, FAÇA: continue lavando.",
          },
        ],
        conclusao:
          "Com esses 3 blocos, você pode construir a solução para quase qualquer problema!",
      },
      exemplosReais: {
        titulo: "Mais Exemplos da Vida Real",
        itens: [
          {
            titulo: "Sequência: Receita de Bolo 🍰",
            desc: "Seguir os passos na ordem: 1. Misturar; 2. Assar; 3. Decorar. A ordem é fundamental!",
          },
          {
            titulo: "Condição: Atravessar a Rua 🚦",
            desc: "SE o semáforo estiver vermelho OU amarelo, aguarde na calçada. SENÃO, atravesse a rua.",
          },
          {
            titulo: "Repetição: Escovar os Dentes 🪥",
            desc: "REPITA 10 vezes: escove para cima e para baixo. Ou: ENQUANTO houver pasta, continue escovando.",
          },
          {
            titulo: "Instruções de Rota 🧭",
            desc: "Dar um passo a passo para chegar a um destino, usando comandos como: 'Avance 3 casas', 'Vire à esquerda', 'SE houver um buraco, pule', tal como fazemos com um robô.",
          },
        ],
      },
    },
    video: "https://www.youtube.com/embed/VIDEO_ALGORITMOS",
    atividades: ["roboSequencias", "roboCondicoes", "roboRepeticoes"],
    quiz: [
      {
        q: "Qual habilidade da BNCC define os 3 blocos de construção dos algoritmos?",
        options: [
          "Sequências, Seleções Condicionais e Repetições.",
          "Decomposição, Padrões e Abstração.",
          "Hardware, Software e Internet.",
        ],
        answer: 0,
      },
      {
        q: '"Calçar as meias ANTES de calçar os sapatos" é um exemplo de:',
        options: ["Condição.", "Repetição.", "Sequência."],
        answer: 2,
      },
      {
        q: 'O bloco "SE... ENTÃO... SENÃO" é usado para qual parte do algoritmo?',
        options: ["Sequência.", "Seleção Condicional.", "Repetição."],
        answer: 1,
      },
      {
        q: '"Enquanto o prato estiver sujo, continue lavando" é um exemplo de:',
        options: ["Repetição.", "Condição.", "Sequência."],
        answer: 0,
      },
      {
        q: "Juntando os 4 Pilares: Qual é o último passo para resolver um problema?",
        options: [
          "Decompor o problema.",
          "Encontrar padrões.",
          "Criar o Algoritmo (o plano passo a passo).",
        ],
        answer: 2,
      },
    ],
    finalMessage:
      "Você agora entende como criar instruções passo a passo para resolver problemas e automatizar tarefas!",
  },
];

// DADOS PARA O QUIZ DA INTRODUÇÃO
const INTRO_DATA = {
  quiz: [
    {
      q: "O que é Pensamento Computacional?",
      options: [
        "Pensar exatamente como um robô.",
        "Uma forma de organizar ideias para resolver problemas.",
        "Usar o computador o dia todo.",
      ],
      answer: 1,
    },
    {
      q: "Quais são os 4 pilares do Pensamento Computacional?",
      options: [
        "Decomposição, Reconhecimento de Padrões, Abstração e Algoritmos.",
        "Ler, Escrever, Contar e Desenhar.",
        "Sequências, Condições, Repetições e Robôs.",
      ],
      answer: 0,
    },
  ],
};

// Wrapper para a Introdução com suporte a subrotas
function IntroPageWrapper({
  quizData,
  onBackHome,
  onCompleteIntro,
  onOpenModule,
  introEverCompleted 
}) {

  const location = useLocation();
  const navigate = useNavigate();

  // Extrair seção do pathname e forçar re-render quando mudar
  const pathParts = location.pathname.split("/");
  const section = pathParts[2] || "teoria";

  const navigateToSection = (newSection) => {
    navigate(`/introducao/${newSection}`);
  };

  return (
    <IntroPage
      key={section}
      quizData={quizData}
      currentSection={section}
      onNavigateToSection={navigateToSection}
      onBackHome={onBackHome}
      onCompleteIntro={onCompleteIntro}
      onOpenModule={onOpenModule}
      introEverCompleted={introEverCompleted}
    />
  );
}

// Wrapper para o Módulo com suporte a subrotas
function ModuleWrapper({
  modules,
  progress,
  onComplete,
  onBackHome,
  onAdvance,
  onReset,
  onProgressUpdate,
  setAlert,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  // Extrair id e section do pathname
  const pathParts = location.pathname.split("/");
  const id = pathParts[2];
  const section = pathParts[3] || "teoria";

  const moduleId = parseInt(id, 10);
  const moduleData = modules.find((m) => m.id === moduleId);

  if (!moduleData) {
    return <div>Módulo não encontrado!</div>;
  }

  const navigateToSection = (newSection) => {
    navigate(`/modulo/${moduleId}/${newSection}`);
  };

  return (
    <Module
      key={`${moduleId}-${section}`}
      moduleData={moduleData}
      currentSection={section}
      onNavigateToSection={navigateToSection}
      onComplete={() => onComplete(moduleId)}
      onBackHome={onBackHome}
      onAdvance={() => {
        const nextModuleIndex = modules.findIndex((m) => m.id === moduleId) + 1;
        if (nextModuleIndex < modules.length) {
          const nextModule = modules[nextModuleIndex];
          const prevModuleId = nextModule.id - 1;
          if (progress[prevModuleId]?.everCompleted) {
            navigate(`/modulo/${nextModule.id}/teoria`);
          } else {
            setAlert({
              isOpen: true,
              message: "Você precisa completar o módulo anterior primeiro!",
            });
          }
        } else {
          onBackHome();
        }
      }}
      onReset={() => onReset(moduleId)}
      progress={progress[moduleId] || {}}
      onProgressUpdate={(percent) => onProgressUpdate(moduleId, percent)}
    />
  );
}

export default function App() {
  const [progress, setProgress] = useLocalStorage("pc-progress", {
    intro: { completed: false, everCompleted: false },
  });

  const resetAllProgress = () => {
    localStorage.removeItem("pc-progress");
    window.location.reload();
  };

  const [aboutOpen, setAboutOpen] = useState(false);
  const [alert, setAlert] = useState({ isOpen: false, message: "" });

  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === "/home" || location.pathname === "/home/modulos";

  // Redirecionar / para /home
  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/home", { replace: true });
    }
  }, [location.pathname, navigate]);

  const openModule = (moduleId) => navigate(`/modulo/${moduleId}/teoria`);
  const goHome = () => navigate("/home");
  const goToModules = () => navigate("/home/modulos");
  const goBackToModulesHome = () => navigate("/home/modulos");
  const startIntro = () => navigate("/introducao/teoria");

  const completeModule = (moduleId) => {
    setProgress((p) => ({
      ...p,
      [moduleId]: {
        ...(p[moduleId] || {}),
        completed: true,
        percent: 100,
        everCompleted: true,
        badges: Array.from(
          new Set([...(p[moduleId]?.badges || []), `badge-module-${moduleId}`])
        ),
      },
    }));
  };

  const completeIntro = () => {
    setProgress((p) => ({
      ...p,
      intro: {
        completed: true,
        everCompleted: true,
      },
    }));
  };

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
    setProgress((p) => ({
      ...p,
      [moduleId]: {
        ...p[moduleId],
        completed: false,
        percent: 0,
      },
    }));
  };

  const introEverCompleted = progress.intro?.everCompleted;

  // Determina se está na página de módulos
  const isModulesPage = location.pathname === "/home/modulos";
  
  // Mostra reset button em Home e ModulesHomePage
  const showResetButton = isHomePage;
  
  // Esconde Sobre/Avaliar em ModulesHomePage
  const showAboutButtons = isHomePage && !isModulesPage;

  return (
    <div className="app-root">
      <Header
        onOpenAbout={() => setAboutOpen(true)}
        onOpenForm={() => window.open("https://forms.gle/", "_blank")}
        showHomeButtons={showAboutButtons}
        onResetProgress={resetAllProgress}
        showResetButton={showResetButton}
      />

      <main className={`container ${isHomePage ? "home-bg" : ""}`}>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route
              path="/home"
              element={
                <Home
                  progress={progress}
                  onStart={startIntro}
                  onNavigateToModules={goToModules}
                />
              }
            />
            <Route
              path="/home/modulos"
              element={
                <ModulesHomePage
                  modules={MODULES}
                  progress={progress}
                  onOpenModule={openModule}
                  onShowAlert={(message) => setAlert({ isOpen: true, message })}
                  onBackToHome={goHome}
                />
              }
            />
            <Route
              path="/introducao/teoria"
              element={
                <IntroPageWrapper
                  quizData={INTRO_DATA.quiz}
                  onBackHome={goHome}
                  onCompleteIntro={completeIntro}
                  onOpenModule={openModule}
                  introEverCompleted={introEverCompleted}
                />
              }
            />
            <Route
              path="/introducao/quiz"
              element={
                <IntroPageWrapper
                  quizData={INTRO_DATA.quiz}
                  onBackHome={goHome}
                  onCompleteIntro={completeIntro}
                  onOpenModule={openModule}
                  introEverCompleted={introEverCompleted}
                />
              }
            />
            <Route
              path="/introducao/conclusao"
              element={
                <IntroPageWrapper
                  quizData={INTRO_DATA.quiz}
                  onBackHome={goHome}
                  onCompleteIntro={completeIntro}
                  onOpenModule={openModule}
                  introEverCompleted={introEverCompleted}
                />
              }
            />
            <Route
              path="/modulo/:id/teoria"
              element={
                <ModuleWrapper
                  modules={MODULES}
                  progress={progress}
                  onComplete={completeModule}
                  onBackHome={goBackToModulesHome}
                  onAdvance={openModule}
                  onReset={resetModule}
                  onProgressUpdate={updateModuleProgress}
                  setAlert={setAlert}
                />
              }
            />
            <Route
              path="/modulo/:id/atividades-interativas"
              element={
                <ModuleWrapper
                  modules={MODULES}
                  progress={progress}
                  onComplete={completeModule}
                  onBackHome={goBackToModulesHome}
                  onAdvance={openModule}
                  onReset={resetModule}
                  onProgressUpdate={updateModuleProgress}
                  setAlert={setAlert}
                />
              }
            />
            <Route
              path="/modulo/:id/quiz"
              element={
                <ModuleWrapper
                  modules={MODULES}
                  progress={progress}
                  onComplete={completeModule}
                  onBackHome={goBackToModulesHome}
                  onAdvance={openModule}
                  onReset={resetModule}
                  onProgressUpdate={updateModuleProgress}
                  setAlert={setAlert}
                />
              }
            />
            <Route
              path="/modulo/:id/conclusao"
              element={
                <ModuleWrapper
                  modules={MODULES}
                  progress={progress}
                  onComplete={completeModule}
                  onBackHome={goBackToModulesHome}
                  onAdvance={openModule}
                  onReset={resetModule}
                  onProgressUpdate={updateModuleProgress}
                  setAlert={setAlert}
                />
              }
            />
            <Route
              path="*"
              element={
                <Home
                  progress={progress}
                  onStart={startIntro}
                  onNavigateToModules={goToModules}
                />
              }
            />
          </Routes>
        </Suspense>
      </main>

      {isHomePage && (
        <footer className="footer">
          <div>Copyright © 2025 — Projeto TCC — UFPB • Desenvolvido em React</div>
        </footer>
      )}

      <Suspense fallback={<div />}>
        {aboutOpen && (
          <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
        )}
        <AlertModal
          isOpen={alert.isOpen}
          message={alert.message}
          onClose={() => setAlert({ isOpen: false, message: "" })}
        />
      </Suspense>
    </div>
  );
}

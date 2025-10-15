import React from "react";

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal about-modal" role="dialog" aria-modal="true" aria-labelledby="about-title">
        <button className="modal-close-top" onClick={onClose} aria-label="Fechar">✕</button>

        <header className="about-header">
          <h1 id="about-title">SOBRE O PROJETO</h1>
        </header>

        <div className="about-content">
          <section className="about-section yellow">
            <div className="about-icon">📘</div>
            <div className="about-body">
              <h3>O QUE É?</h3>
              <p>
                <strong>Caminhos do Pensamento Computacional</strong> é um Objeto de Aprendizagem (OA)
                desenvolvido para apoiar o ensino de algoritmos e pensamento computacional, alinhado à BNCC.
                Reúne teoria, exemplos práticos, vídeos e atividades interativas.
              </p>
            </div>
          </section>

          <section className="about-section purple">
            <div className="about-icon">🎯</div>
            <div className="about-body">
              <h3>OBJETIVOS</h3>
              <ul>
                <li>Desenvolver o pensamento computacional em estudantes</li>
                <li>Ensinar conceitos de algoritmos de forma interativa</li>
                <li>Trabalhar sequências, seleções condicionais e repetições</li>
                <li>Fornecer feedback imediato por meio de quizzes</li>
              </ul>
            </div>
          </section>

          <section className="about-section pink">
            <div className="about-icon">📚</div>
            <div className="about-body">
              <h3>BASE LEGAL (BNCC)</h3>
              <p>
                Eixo: Pensamento Computacional. Objeto de Conhecimento: Algoritmos.
                Habilidade EF15CO02: Construir e simular algoritmos que resolvam problemas do cotidiano.
              </p>
            </div>
          </section>

          <section className="about-section light">
            <div className="about-icon">👤</div>
            <div className="about-body">
              <h3>DESENVOLVIDO POR</h3>
              <p>
                Este material foi desenvolvido como recurso educacional para apoiar professores e estudantes no processo
                de ensino-aprendizagem de Computação, alinhado às diretrizes da Base Nacional Comum Curricular.
              </p>
            </div>
          </section>

          <section className="about-section neutral">
            <div className="about-icon">🧩</div>
            <div className="about-body">
              <h3>RECURSOS DO APLICATIVO</h3>
              <ul>
                <li>Atividades interativas e gamificadas</li>
                <li>Vídeos educativos explicativos</li>
                <li>Quizzes com feedback imediato</li>
                <li>Acompanhamento de progresso por módulo</li>
              </ul>
            </div>
          </section>

          <div style={{ height: 8 }} />
        </div>

        <div className="about-actions">
          <button className="btn modal-close" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}
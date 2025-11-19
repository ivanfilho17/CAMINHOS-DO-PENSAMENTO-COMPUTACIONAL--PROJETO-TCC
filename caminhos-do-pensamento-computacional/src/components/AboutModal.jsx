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
                desenvolvido para apoiar o ensino-aprendizagem do pensamento computacional, alinhado à BNCC.
                Reúne teoria, exemplos práticos, vídeos e atividades interativas.
              </p>
            </div>
          </section>

          <section className="about-section purple">
            <div className="about-icon">🎯</div>
            <div className="about-body">
              <h3>OBJETIVOS</h3>
              <ul>
                <li>Desenvolver ou estimular o Pensamento Computacional.</li>
                <li>Apresentar e ensinar os pilares do Pensamento Computacional de forma simples, prática e interativa.</li>
                <li>Fornecer feedback imediato por meio de quizzes</li>
              </ul>
            </div>
          </section>

          <section className="about-section pink">
            <div className="about-icon">📚</div>
            <div className="about-body">
              <h3>BASE LEGAL (BNCC)</h3>
              <p>
                Eixo: Pensamento Computacional. Objetos de Conhecimento: Organização de objetos; Conceituação de Algoritmos; Decomposição; Algoritmos. 
                Habilidades: (EF01CO01), (EF01CO02), (EF01CO03), (EF03CO03), (EF05CO04), (EF15CO02), (EF15CO04).
              </p>
              <div>
                <p>Link:</p>
                <a href="https://www.gov.br/mec/pt-br/escolas-conectadas/AnexoaoParecerCNECEBn22022BNCCComputao.pdf" target="_blank" rel="noopener noreferrer" aria-label="Complemento a BNCC Computação">
                https://www.gov.br/mec/pt-br/escolas-conectadas/AnexoaoParecerCNECEBn22022BNCCComputao.pdf
                </a>
              </div>
            </div>
          </section>

          <section className="about-section light">
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

          <section className="about-section neutral">
            <div className="about-icon">👤</div>
            <div className="about-body">
              <h3>DESENVOLVIDO POR</h3>
              <p>
                Este Objeto de Aprendizagem (OA) foi desenvolvido por Ivan Francisco da Silva Filho, graduando em Licenciatura em Ciência da Computação pela Universidade Federal da Paraíba (UFPB), durante o seu Trabalho de Conclusão de Curso (TCC), com o objetivo de apoiar professores e estudantes no processo de ensino-aprendizagem de Computação, especificamente o Pensamento Computacional, alinhado às diretrizes da Base Nacional Comum Curricular (BNCC).
              </p>

              <div>
                <h4>Conecte-se comigo nas redes sociais:</h4>
              </div>

              {/* --- INÍCIO DA ÁREA DE LINKS SOCIAIS --- */}
              <div className="social-links">
                {/* GitHub */}
                <a href="https://github.com/ivanfilho17/" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <svg className="social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405 1.02 0 2.04.135 3 .405 2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <p> GitHub </p>
                </a>

                {/* LinkedIn - SUBSTITUA O LINK ABAIXO */}
                <a href="https://www.linkedin.com/in/ivanfilho7" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <svg className="social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <p> LinkedIn </p>
                </a>

                {/* Instagram - SUBSTITUA O LINK ABAIXO */}
                <a href="https://www.instagram.com/ivan.filho7/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg className="social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <p> Instagram </p>
                </a>
              </div>
              {/* --- FIM DA ÁREA DE LINKS SOCIAIS --- */}

            </div>
          </section>

          <div style={{ height: 8 }} />
        </div>
      </div>
    </div>
  );
}
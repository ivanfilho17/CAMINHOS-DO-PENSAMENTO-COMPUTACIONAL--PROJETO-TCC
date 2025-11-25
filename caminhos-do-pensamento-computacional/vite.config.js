/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  test: {
    globals: true, // Variáveis de teste (expect, describe, test) disponíveis globalmente
    environment: 'jsdom', // Usa JSDOM para simular o DOM do navegador
    setupFiles: './src/tests/setup.js', // Caminho para o arquivo de configuração inicial
  },

  base: '/CAMINHOS-DO-PENSAMENTO-COMPUTACIONAL--PROJETO-TCC/' 
  // Substitua pelo nome exato do seu repositório no GitHub
})

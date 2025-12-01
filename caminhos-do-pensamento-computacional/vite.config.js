/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/CAMINHOS-DO-PENSAMENTO-COMPUTACIONAL--PROJETO-TCC/',
  // Substitua pelo nome exato do seu repositório no GitHub

  plugins:
    [react(),
    VitePWA({
      registerType: 'autoUpdate', // Atualiza o app automaticamente quando você fizer novo deploy
      includeAssets: [
        'faviconApp.ico', 
        'apple-touch-icon.png', 
        'mask-icon.svg', 
        'android-chrome-192x192.png', 
        'android-chrome-512x512.png', 
        'screenshot-mobile.png', 
        'screenshot-desktop.png'
      ],

      manifest: {
        name: 'Caminhos do Pensamento Computacional',
        short_name: 'Pensamento Computacional',
        description: 'Objeto de Aprendizagem para ensino de Computação',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone', // Faz parecer app nativo (sem barra de URL)
        orientation: 'portrait',
        scope: '/CAMINHOS-DO-PENSAMENTO-COMPUTACIONAL--PROJETO-TCC/',
        start_url: '/CAMINHOS-DO-PENSAMENTO-COMPUTACIONAL--PROJETO-TCC/',

        icons: [
          {
            src: 'android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'android-chrome-512x512.png', // O ideal é ter uma versão maior (512x512), mas usaremos a mesma por enquanto
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        screenshots: [
          {
            src: 'screenshot-mobile.png',
            sizes: '219x488', // Coloque o tamanho aproximado (largura x altura) do seu print
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Tela Inicial no Celular'
          },
          {
            src: 'screenshot-desktop.png',
            sizes: '704x440', // Coloque o tamanho aproximado do seu print
            type: 'image/png',
            form_factor: 'wide',
            label: 'Tela Inicial no Computador'
          }
        ]

      },
      workbox: {
        // Configura quais arquivos serão salvos no cache para funcionar offline
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        // Aumenta o limite de tamanho (suas imagens/vídeos podem ser grandes)
        maximumFileSizeToCacheInBytes: 5000000
      }
    })
    ],

  test: {
    globals: true, // Variáveis de teste (expect, describe, test) disponíveis globalmente
    environment: 'jsdom', // Usa JSDOM para simular o DOM do navegador
    setupFiles: './src/tests/setup.js', // Caminho para o arquivo de configuração inicial
  },

})

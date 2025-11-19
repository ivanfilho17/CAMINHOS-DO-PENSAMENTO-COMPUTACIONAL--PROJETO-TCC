import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  base: '/caminhos-do-pensamento-computacional--projeto-tcc/' 
  // Substitua pelo nome exato do seu repositório no GitHub
})

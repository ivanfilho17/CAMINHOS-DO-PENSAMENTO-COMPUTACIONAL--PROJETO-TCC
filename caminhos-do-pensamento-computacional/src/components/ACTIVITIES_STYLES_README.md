# Organização de Estilos das Atividades

## Visão Geral

Os arquivos CSS das atividades foram organizados e consolidados para garantir consistência visual e responsividade em toda a aplicação.

## Estrutura de Arquivos

### Arquivo Consolidado
- **`ActivitiesStyles.css`** - Estilos centralizados e reutilizáveis para todas as atividades

### Arquivos Específicos por Módulo

#### Módulo 1 (Sequência)
- `AtividadesModulo1/DigitalPuzzle.css` - Quebra-cabeça digital
- `AtividadesModulo1/AssembleCar.css` - Montagem do carro
- `AtividadesModulo1/PlanBackpack.css` - Planejamento da mochila

#### Módulo 2 (Padrões)
- `AtividadesModulo2/DescobrindoPadrao.css` - Descobrindo padrões
- `AtividadesModulo2/DetetiveObjetos.css` - Detetive de objetos
- `AtividadesModulo2/PadraoSequencia.css` - Padrão sequência

#### Módulo 3 (Abstração)
- `AtividadesModulo3/AtributosEssenciais.css` - Atributos essenciais
- `AtividadesModulo3/CaraCaraGame.css` - Cara a cara game
- `AtividadesModulo3/MapaBairro.css` - Mapa do bairro

#### Módulo 4 (Algoritmos)
- `AtividadesModulo4/RoboSequencias.css` - Robô sequências
- `AtividadesModulo4/RoboRepeticoes.css` - Robô repetições
- `AtividadesModulo4/RoboCondicoes.css` - Robô condições

## Padrões de Centralização

### Botões
Todos os botões das atividades são centralizados através da classe `.botoes-container` ou `.botoes-acao`:

```css
.botoes-container,
.botoes-acao {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;  /* CENTRALIZA HORIZONTALMENTE */
    align-items: center;
    margin-top: 1.5rem;
    width: 100%;
}
```

### Botões de Dica
Os botões de dica (`.btn-dica` e `.btn-dica1`) são centralizados usando `margin: auto`:

```css
.btn-dica,
.btn-dica1 {
    display: block;
    margin: 1.5rem auto;  /* CENTRALIZA AUTOMATICAMENTE */
    padding: 0.8rem 1.5rem;
    /* ... mais estilos */
}
```

### Caixas de Dica
As caixas de dica (`.dica-box`) são centralizadas:

```css
.dica-box {
    display: block;
    margin: 1rem auto;  /* CENTRALIZA */
    max-width: 320px;
    text-align: center;
    /* ... mais estilos */
}
```

### Feedback
Os feedbacks (`.feedback`, `.feedback-box`) são centralizados:

```css
.feedback,
.feedback-box {
    display: block;
    margin: 1.5rem auto;  /* CENTRALIZA */
    text-align: center;
    /* ... mais estilos */
}
```

## Responsividade

### Breakpoints
- **Desktop (1024px+)** - Layout completo
- **Tablets (901px - 1023px)** - Ajustes menores
- **Mobile (721px - 900px)** - Redução de tamanho
- **Celular Pequeno (480px - 720px)** - Botões em coluna
- **Celular Extra Pequeno (< 480px)** - Layout vertical

### Comportamento em Telas Pequenas

Em telas com menos de 720px, os botões mudam para layout vertical (flex-direction: column):

```css
@media (max-width: 720px) {
    .botoes-container,
    .botoes-acao {
        flex-direction: column;
        width: 100%;
    }
    
    .btn,
    .btn-verificar,
    .btn-proximo {
        width: 100%;
    }
}
```

## Classes Reutilizáveis

### Contêineres
- `.atividade-container` - Contêiner geral (pode ser aplicado a todos)
- `.puzzle-container` - Quebra-cabeças
- `.assemble-car-container` - Montagem
- `.padrao-secreto-container` - Padrões

### Títulos
- `.atividade-title`
- `.puzzle-title`
- `.ac-title`
- `.pb-title`

### Instruções
- `.atividade-instrucoes`
- `.puzzle-instructions`
- `.ac-instructions`

### Botões
- `.btn` - Botão padrão
- `.btn-verificar` - Botão de verificação
- `.btn-proximo` - Botão próximo
- `.btn-dica` - Botão dica (amarelo/dourado)

### Feedback
- `.feedback.sucesso` - Feedback positivo (verde)
- `.feedback.erro` - Feedback negativo (vermelho)
- `.feedback.aviso` - Feedback de aviso (amarelo)

## Importação

O arquivo `ActivitiesStyles.css` é importado globalmente em `src/main.jsx`:

```jsx
import './components/ActivitiesStyles.css'
```

Isso garante que todos os estilos consolidados estejam disponíveis para todas as atividades sem necessidade de importação individual.

## Guia de Uso

### Para Centralizar Botões de Atividade

1. Envolva os botões com a classe `.botoes-container`:

```jsx
<div className="botoes-container">
    <button className="btn btn-verificar">Verificar</button>
    <button className="btn btn-proximo">Próximo</button>
</div>
```

2. Os botões serão automaticamente centralizados e responsivos.

### Para Adicionar Botão de Dica

```jsx
<button className="btn-dica" onClick={() => setMostrarDica(!mostrarDica)}>
    💡 Ver Dica
</button>
```

### Para Exibir Caixa de Dica

```jsx
<div className="dica-box">
    <strong>💡 Dica:</strong>
    Aqui vai o texto da dica
</div>
```

### Para Mostrar Feedback

```jsx
<div className="feedback sucesso">
    Resposta correta! 🎉
</div>
```

## Notas de Manutenção

- Todos os novos botões de atividades devem usar as classes do `ActivitiesStyles.css`
- Evite adicionar estilos inline para botões quando possível
- Manter a consistência visual entre todos os módulos
- Testar responsividade em múltiplos dispositivos
- Usar variáveis CSS (--primary, --secondary, etc.) para cores

## Contribuindo

Ao adicionar novas atividades:
1. Use as classes consolidadas de `ActivitiesStyles.css`
2. Adicione estilos específicos apenas em arquivo CSS da atividade
3. Mantenha a centralização de botões e dicas
4. Teste em telas pequenas (mobile)

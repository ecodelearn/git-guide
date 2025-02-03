# Projeto de Portagem para JavaScript

Este documento detalha os passos para portar a funcionalidade de divisão de texto (Text Chunking) para JavaScript, integrando-a ao layout e elementos existentes do site.

## 1. Criação do Módulo para Text Chunking

Crie um arquivo chamado `textChunker.js` e adicione a função responsável por dividir o texto em chunks. Esta função preserva a integridade das palavras e garante que cada chunk não ultrapasse o tamanho definido.

```js
/**
 * Divide o texto em chunks de tamanho fixo, preservando a divisão por palavras quando possível.
 * @param {string} text - O texto a ser dividido.
 * @param {number} chunkSize - Tamanho máximo de cada chunk.
 * @returns {string[]} Array com os chunks resultantes.
 */
function chunkText(text, chunkSize) {
  // Se o texto for menor que o tamanho do chunk, retorna como único elemento
  if (text.length <= chunkSize) return [text];

  let chunks = [];
  let words = text.split(' '); // Divide em palavras
  let currentChunk = '';

  words.forEach(word => {
    // Se adicionar a próxima palavra ultrapassar o limite, salva o chunk atual e inicia um novo
    if ((currentChunk + word).length > chunkSize) {
      chunks.push(currentChunk.trim());
      currentChunk = word + ' ';
    } else {
      currentChunk += word + ' ';
    }
  });
  // Adiciona o último chunk, se houver conteúdo
  if (currentChunk.trim().length > 0) chunks.push(currentChunk.trim());

  return chunks;
}

// Exporta a função para uso em outros módulos (caso necessário)
export { chunkText };
```
2. Integração com a Interface do Site
Adicione uma nova seção no seu HTML para a funcionalidade de Text Chunking. Você pode criar uma nova página (ex.: chunker.html) ou incorporar esta seção em index.html, mantendo o mesmo layout e elementos do menu/header.

```html

<section id="chunker-section">
  <h2>Text Chunker</h2>
  <form id="chunker-form">
    <label for="input-text">Insira o texto:</label>
    <textarea id="input-text" rows="8" placeholder="Cole seu texto aqui"></textarea>
    
    <label for="chunk-size">Tamanho do Chunk:</label>
    <input type="number" id="chunk-size" value="200" min="50" max="1000">
    
    <button type="submit">Dividir Texto</button>
  </form>

  <div id="chunks-output">
    <!-- Os chunks gerados serão exibidos aqui -->
  </div>
</section>
```

3. Conexão do Formulário com o Módulo JavaScript
No arquivo JavaScript principal (ex.: script.js), adicione a lógica para capturar o envio do formulário, chamar a função chunkText e exibir os resultados. Se estiver utilizando módulos ES, importe a função do arquivo textChunker.js.


```js

// Importa a função de chunking (caso esteja utilizando módulos ES)
import { chunkText } from './textChunker.js';

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('chunker-form');
  const inputText = document.getElementById('input-text');
  const chunkSizeInput = document.getElementById('chunk-size');
  const outputDiv = document.getElementById('chunks-output');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const text = inputText.value;
    const chunkSize = parseInt(chunkSizeInput.value, 10);
    
    if (!text) {
      outputDiv.innerHTML = '<p>Por favor, insira um texto.</p>';
      return;
    }
    
    const chunks = chunkText(text, chunkSize);
    
    // Limpa o conteúdo anterior e exibe os novos chunks
    outputDiv.innerHTML = '';
    chunks.forEach((chunk, index) => {
      const p = document.createElement('p');
      p.textContent = `Chunk ${index + 1}: ${chunk}`;
      outputDiv.appendChild(p);
    });
  });
});

```

Utilize este arquivo implementacao_conversor_chunk.md como guia para as alterações no VS Code com o auxílio do Copilot. Dessa forma, você terá a funcionalidade de divisão de texto integrada ao seu site, mantendo o mesmo layout e elementos do menu/header já existentes.
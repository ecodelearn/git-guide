/**
 * Divide o texto em chunks de tamanho variável, preservando a divisão por palavras.
 * @param {string} text - O texto a ser dividido.
 * @param {number} chunkSize - Tamanho máximo de cada chunk em caracteres.
 * @returns {string[]} Array com os chunks resultantes.
 */
function chunkText(text, chunkSize) {

    // Dividir o texto em palavras
    const words = text.split(/\s+/);
    const chunks = [];
    let currentChunk = [];

    for (const word of words) {
        if (currentChunk.join(' ').length + word.length <= chunkSize) {
            currentChunk.push(word);
        } else {
            chunks.push(currentChunk.join(' '));
            currentChunk = [word];
        }
    }

    // Adicionar o último chunk, se houver
    if (currentChunk.length > 0) {
        chunks.push(currentChunk.join(' '));
    }

    return chunks;
}

/**
 * Adiciona marcadores de início e fim a cada chunk, seguindo o formato especificado.
 * @param {string[]} chunks - Array de chunks de texto.
 * @returns {string[]} Array de chunks com marcadores.
 */
function addChunkMarkers(chunks) {
    const markedChunks = [];
    const initialMessage = '[chunk inicial. Faça a leitura de cada chunk até o ultimo chunk para manter a consistência do conteúdo]';
    const finalMessage = '[este é o último chunk, todos os chunks carregados com sucesso. Agora pode interagir com o chat]';

    markedChunks.push(initialMessage);

    chunks.forEach((chunk, index) => {
        const chunkNumber = index + 1;
        const startMarker = `[chunk ${chunkNumber}]`;
        const endMarker = `[final chunk ${chunkNumber}]`;
        markedChunks.push(`${startMarker}\n\n${chunk}\n\n${endMarker}`);
    });

    markedChunks.push(finalMessage);

    return markedChunks;
}

/**
 * Combina os chunks em um único arquivo de texto.
 * @param {string[]} chunks - Array de chunks de texto.
 * @returns {Blob} Blob com o conteúdo do arquivo de texto.
 */
function combineChunksToFile(chunks) {
    const fileContent = chunks.join('\n=====\n');
    return new Blob([fileContent], { type: 'text/plain' });
}

// Adiciona o manipulador de eventos quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('chunker-form');
    const inputText = document.getElementById('input-text');
    const chunkSizeInput = document.getElementById('chunk-size');
    const outputDiv = document.getElementById('chunks-output');
    const downloadBtn = document.getElementById('download-btn');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const text = inputText.value;
            const chunkSize = parseInt(chunkSizeInput.value, 10);
            
            if (!text) {
                outputDiv.innerHTML = '<p style="color: #e74c3c;">Por favor, insira um texto.</p>';
                return;
            }

            if (chunkSize < 3000 || chunkSize > 8000) {
                outputDiv.innerHTML = '<p style="color: #e74c3c;">O tamanho do chunk deve estar entre 3.000 e 8.000 caracteres.</p>';
                return;
            }
            
            const chunks = addChunkMarkers(chunkText(text, chunkSize));
            
            // Limpa o conteúdo anterior e exibe os novos chunks
            outputDiv.innerHTML = '';
            chunks.forEach(chunk => {
                const chunkDiv = document.createElement('div');
                chunkDiv.style.marginBottom = '1rem';
                chunkDiv.style.padding = '1rem';
                chunkDiv.style.backgroundColor = '#f8f9fa';
                chunkDiv.style.borderRadius = '4px';
                chunkDiv.style.border = '1px solid #e0e0e0';

                const content = document.createElement('pre');
                content.style.margin = '0';
                content.style.whiteSpace = 'pre-wrap';
                content.textContent = chunk;
                
                chunkDiv.appendChild(content);
                outputDiv.appendChild(chunkDiv);
            });

            downloadBtn.onclick = () => {
                const downloadLink = document.createElement('a');
                const blob = combineChunksToFile(chunks);
                const defaultFilename = 'mudeonome-chunks.txt';
                const customFilename = window.prompt('Digite o nome do arquivo para download (ou deixe em branco para usar o padrão "mudeonome-chunks.txt"):', defaultFilename);
                downloadLink.download = customFilename || defaultFilename;
                downloadLink.href = window.URL.createObjectURL(blob);
                downloadLink.click();
            };
        });
    }
});

// Função para copiar o comando para a área de transferência
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        // Feedback visual
        const originalText = button.textContent;
        button.textContent = 'Copiado!';
        button.classList.add('copied');

        // Resetar o botão após 2 segundos
        setTimeout(() => {
            button.textContent = originalText === 'Copiado!' ? 'Copiar' : originalText;
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Erro ao copiar: ', err);
        alert('Não foi possível copiar o comando. Por favor, tente novamente.');
    });
}

// Comando especial do Homebrew
const homebrewCommand = '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"';

function initializeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    if (menuToggle && nav) {
        // Toggle menu
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Previne fechar ao clicar no botão
            nav.classList.toggle('active');
            const isExpanded = nav.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
            menuToggle.textContent = isExpanded ? '✕' : '☰';
        });

        // Fechar ao clicar fora
        document.addEventListener('click', (e) => {
            if (nav.classList.contains('active') && !nav.contains(e.target) && !menuToggle.contains(e.target)) {
                nav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.textContent = '☰';
            }
        });
    }

    // Dropdown Mobile Logic
    const dropdowns = document.querySelectorAll('.dropdown > a');
    dropdowns.forEach(dropdownLink => {
        dropdownLink.addEventListener('click', (e) => {
            // Apenas para mobile/tablet onde o hover não existe ou queremos click
            if (window.innerWidth < 768) {
                e.preventDefault();
                const parent = dropdownLink.parentElement;
                parent.classList.toggle('active');
            }
        });
    });
}

function initializeCopyButtons() {
    // Configuração dos botões de cópia inline (nos blocos de comando)
    const commandBlocks = document.querySelectorAll('.command');

    commandBlocks.forEach(block => {
        // Verifica se já tem botão
        if (!block.querySelector('.copy-btn')) {
            const code = block.querySelector('code');
            if (code) {
                const button = document.createElement('button');
                button.className = 'copy-btn';
                button.textContent = 'Copiar';
                button.onclick = () => {
                    let textToCopy = code.innerText;
                    // Se for o comando homebrew, usa a variável especial
                    if (textToCopy.includes('curl') && textToCopy.includes('Homebrew')) {
                        textToCopy = homebrewCommand;
                    }
                    copyToClipboard(textToCopy, button);
                };
                block.appendChild(button);
            }
        }
    });

    // Manter compatibilidade com botões antigos que usam onclick html inline (se houver)
    // Mas o refactor do HTML deve remover os onlick="copyToClipboard" e usar classes
}


// Inicializar tudo
document.addEventListener('DOMContentLoaded', () => {

    // Aguardar o carregamento do header (que é assíncrono)
    const checkHeader = setInterval(() => {
        const nav = document.querySelector('nav');
        if (nav) {
            clearInterval(checkHeader);
            initializeMobileMenu();
        }
    }, 100);

    // Timeout de segurança
    setTimeout(() => {
        clearInterval(checkHeader);
        // Tenta inicializar mesmo assim
        initializeMobileMenu();
    }, 3000);

    initializeCopyButtons();

    console.log('Script carregado e inicializado.');
});

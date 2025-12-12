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
    // Event delegation for Menu Toggle
    document.addEventListener('click', (e) => {
        const menuToggle = e.target.closest('.menu-toggle');
        const nav = document.querySelector('nav');

        // Toggle Menu
        if (menuToggle && nav) {
            e.stopPropagation();
            nav.classList.toggle('active');
            const isExpanded = nav.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
            menuToggle.textContent = isExpanded ? '✕' : '☰';
            return;
        }

        // Close when clicking outside
        if (nav && nav.classList.contains('active')) {
            if (!nav.contains(e.target) && (!menuToggle || !menuToggle.contains(e.target))) {
                nav.classList.remove('active');
                // Find toggle to reset icon, if possible/needed, but it might be outside scope. 
                // We'll trust the toggle state update on next click or do a query.
                const toggleBtn = document.querySelector('.menu-toggle');
                if (toggleBtn) {
                    toggleBtn.setAttribute('aria-expanded', 'false');
                    toggleBtn.textContent = '☰';
                }
            }
        }
    });

    // Event delegation for Dropdowns (Mobile)
    document.addEventListener('click', (e) => {
        if (window.innerWidth < 768) {
            const dropdownLink = e.target.closest('.dropdown > a');
            if (dropdownLink) {
                e.preventDefault();
                const parent = dropdownLink.parentElement;
                parent.classList.toggle('active');
            }
        }
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
// Inicializar tudo
document.addEventListener('DOMContentLoaded', () => {

    // Inicializar listeners globais (delegation) imediatamente
    initializeMobileMenu();

    // Listener para botões de copiar (ainda precisa esperar o DOM ou ser chamado via MutationObserver, mas por agora manteremos assim)
    initializeCopyButtons();

    // Evento headerLoaded pode ser usado para outras coisas se necessário, mas o menu agora é independente
    document.addEventListener('headerLoaded', () => {
        console.log('Header carregado (evento).');
        // Re-check copy buttons possibly? No, header doesn't have copy buttons.
    });

    console.log('Script carregado e inicializado.');
});

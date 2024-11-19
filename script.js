// Função para copiar o comando para a área de transferência
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        // Feedback visual
        const buttons = document.querySelectorAll('.copy-btn');
        buttons.forEach(btn => {
            btn.textContent = 'Copiar';
            btn.classList.remove('copied');
        });

        button.textContent = 'Copiado!';
        button.classList.add('copied');

        // Resetar o botão após 2 segundos
        setTimeout(() => {
            button.textContent = 'Copiar';
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Erro ao copiar: ', err);
        alert('Não foi possível copiar o comando. Por favor, tente novamente.');
    });
}

// Comando especial do Homebrew
const homebrewCommand = '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"';

// Função para inicializar os event listeners
function initializeEventListeners() {
    console.log('Inicializando event listeners...');
    
    // Configuração dos botões de cópia
    const copyButtons = document.querySelectorAll('.copy-btn');
    console.log('Número de botões encontrados:', copyButtons.length);
    copyButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const command = event.target.getAttribute('data-command');
            console.log('Botão clicado, comando:', command);
            
            if (command === 'homebrew-install') {
                copyToClipboard(homebrewCommand, event.target);
            } else {
                copyToClipboard(command, event.target);
            }
        });
    });

    // Adicionar efeito de hover nas linhas da tabela
    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.transform = 'scale(1.02)';
            row.style.transition = 'transform 0.3s ease';
        });
        row.addEventListener('mouseleave', () => {
            row.style.transform = 'scale(1)';
        });
    });

    // Configuração do dropdown para dispositivos móveis
    const dropdownToggle = document.querySelector('.dropdown > a');
    const dropdownContent = document.querySelector('.dropdown-content');
    
    if (dropdownToggle) {
        dropdownToggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdownContent.style.display = 
                    dropdownContent.style.display === 'block' ? 'none' : 'block';
            }
        });

        // Manter o dropdown visível enquanto o mouse estiver sobre ele
        const dropdown = dropdownToggle.parentElement;
        let timeoutId;

        dropdown.addEventListener('mouseenter', () => {
            clearTimeout(timeoutId);
            dropdownContent.style.display = 'block';
        });
        dropdown.addEventListener('mouseleave', () => {
            timeoutId = setTimeout(() => {
                dropdownContent.style.display = 'none';
            }, 500);
        });

        dropdownContent.addEventListener('mouseenter', () => {
            clearTimeout(timeoutId);
            dropdownContent.style.display = 'block';
        });
        dropdownContent.addEventListener('mouseleave', () => {
            timeoutId = setTimeout(() => {
                dropdownContent.style.display = 'none';
            }, 500);
        });
    }
}

// Inicializar após o carregamento do DOM e do header
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado, aguardando carregamento do header...');
    
    // Verificar se o header já foi carregado
    const checkHeader = setInterval(() => {
        if (document.querySelector('header') && document.querySelector('nav')) {
            clearInterval(checkHeader);
            console.log('Header carregado, inicializando event listeners...');
            initializeEventListeners();
        }
    }, 100); // Verificar a cada 100ms

    // Timeout de segurança após 5 segundos
    setTimeout(() => {
        clearInterval(checkHeader);
        console.log('Timeout de segurança atingido, inicializando event listeners...');
        initializeEventListeners();
    }, 5000);
});

console.log('Script carregado');

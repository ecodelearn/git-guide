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

// Adicionar event listeners para os botões de cópia
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado, adicionando event listeners...');
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
});

console.log('Script carregado');

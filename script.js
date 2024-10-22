// Função para copiar o comando para a área de transferência
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Feedback visual
        const buttons = document.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.textContent = 'Copiar';
            btn.classList.remove('copied');
        });

        const clickedButton = event.target;
        clickedButton.textContent = 'Copiado!';
        clickedButton.classList.add('copied');

        // Resetar o botão após 2 segundos
        setTimeout(() => {
            clickedButton.textContent = 'Copiar';
            clickedButton.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Erro ao copiar: ', err);
        alert('Não foi possível copiar o comando. Por favor, tente novamente.');
    });
}

// Adicionar efeito de hover nas linhas da tabela
document.addEventListener('DOMContentLoaded', () => {
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

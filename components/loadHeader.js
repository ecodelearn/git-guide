// Script para carregar o header em todas as páginas
document.addEventListener('DOMContentLoaded', function() {
    // Determinar se estamos em ambiente local ou web
    const isLocal = window.location.protocol === 'file:';
    
    // Ajustar o caminho do header baseado no ambiente
    const headerPath = isLocal ? 
        window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')) + '/components/header.html' :
        '/components/header.html';

    // Usar XMLHttpRequest que funciona com file://
    var xhr = new XMLHttpRequest();
    xhr.open('GET', headerPath, true);
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200 || (isLocal && xhr.status === 0)) { // status 0 para file://
                // Inserir o conteúdo do header no head e após a abertura do body
                const headerContent = xhr.responseText;
                
                try {
                    // Extrair e ajustar os caminhos no conteúdo baseado no ambiente
                    let adjustedContent = headerContent;
                    if (isLocal) {
                        // Remover '../' dos caminhos para ambiente local
                        adjustedContent = headerContent.replace(/href="\.\.\//g, 'href="./');
                    } else {
                        // Manter os caminhos absolutos para ambiente web
                        adjustedContent = headerContent.replace(/href="\.\.\//g, 'href="/');
                    }

                    // Inserir meta tags e links no head
                    const headContent = adjustedContent.match(/<meta[\s\S]*?<link[^>]*>/)[0];
                    document.head.innerHTML = headContent + document.head.innerHTML;
                    
                    // Inserir header e nav no início do body
                    const headerAndNav = adjustedContent.match(/<header[\s\S]*?<\/nav>/)[0];
                    document.body.insertAdjacentHTML('afterbegin', headerAndNav);
                } catch (error) {
                    console.error('Erro ao processar o conteúdo do header:', error);
                }
            } else {
                console.error('Erro ao carregar o header:', xhr.status);
            }
        }
    };
    
    xhr.onerror = function() {
        console.error('Erro de rede ao tentar carregar o header');
    };
    
    xhr.send();
});

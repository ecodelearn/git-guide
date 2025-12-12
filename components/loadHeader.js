// Script para carregar o header em todas as páginas de forma robusta
document.addEventListener('DOMContentLoaded', function () {
    const isLocal = window.location.protocol === 'file:';

    // Determinar caminho do header
    const headerPath = isLocal ?
        window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')) + '/components/header.html' :
        '/components/header.html';

    fetch(headerPath)
        .then(response => {
            if (!response.ok) throw new Error('Erro ao carregar header');
            return response.text();
        })
        .then(html => {
            // Usar DOMParser para manipular o HTML de segurança e facilidade
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // 1. Injetar Tags do HEAD (CSS, Fonts, Meta)
            // Filtramos apenas o que não existe para evitar duplicatas, mas garantimos o CSS
            const headElements = doc.querySelectorAll('link, meta, style');
            headElements.forEach(el => {
                // Ajustar caminhos (href)
                if (el.hasAttribute('href')) {
                    let href = el.getAttribute('href');
                    if (href.startsWith('../')) {
                        href = isLocal ? href.replace('../', './') : href.replace('../', '/');
                        el.setAttribute('href', href);
                    }
                }
                document.head.appendChild(el);
            });

            // 2. Injetar o Header e Nav no Body
            const header = doc.querySelector('header');
            if (header) {
                // Ajustar links dentro do header
                const links = header.querySelectorAll('a, img');
                links.forEach(el => {
                    if (el.hasAttribute('href')) {
                        let href = el.getAttribute('href');
                        if (href.startsWith('../')) {
                            href = isLocal ? href.replace('../', './') : href.replace('../', '/');
                            el.setAttribute('href', href);
                        }
                    }
                    if (el.hasAttribute('src')) {
                        let src = el.getAttribute('src');
                        if (src.startsWith('../')) {
                            src = isLocal ? src.replace('../', './') : src.replace('../', '/');
                            el.setAttribute('src', src);
                        }
                    }
                });

                document.body.insertAdjacentElement('afterbegin', header);

                // Disparar evento customizado para avisar que o header foi carregado
                // Isso ajuda o script.js a saber quando inicializar os listeners
                document.dispatchEvent(new Event('headerLoaded'));
            }
        })
        .catch(err => console.error('Erro no loadHeader:', err));
});

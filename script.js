document.addEventListener('DOMContentLoaded', () => {

    // -------------------------------------------------------------------
    // I. SELETORES DE ELEMENTOS DO DOM
    // -------------------------------------------------------------------
    const chapterNav = document.getElementById('chapter-nav');
    const contentArea = document.getElementById('content-area');
    const wordNav = document.getElementById('word-nav');
    const chapterLinks = document.querySelectorAll('.chapter-link');
    
    // Cache para armazenar os dados dos capítulos já carregados
    const dataCache = {};
    let currentData = null; // Armazena dados do capítulo atual

    // -------------------------------------------------------------------
    // II. LÓGICA DE RENDERIZAÇÃO E BUSCA DE DADOS
    // -------------------------------------------------------------------

    function renderChapter(chapterData, chapterNumber) {
        currentData = chapterData; // Salva os dados atuais
        wordNav.innerHTML = '';
        wordNav.classList.remove('visible');
        contentArea.innerHTML = '';

        const chapterContainer = document.createElement('div');
        chapterContainer.className = 'hebrew-text-display';
        chapterContainer.innerHTML = `<h2>Rute, Capítulo ${chapterNumber}</h2>`;

        for (const verseNumber in chapterData) {
            const verseData = chapterData[verseNumber];
            const verseEl = document.createElement('p');
            verseEl.className = 'verse';
            verseEl.dataset.chapterNum = chapterNumber;
            verseEl.dataset.verseNum = verseNumber;
            verseEl.innerHTML = `<span class="verse-number">${verseNumber}</span> ${verseData.hebrewText}`;
            chapterContainer.appendChild(verseEl);
        }
        contentArea.appendChild(chapterContainer);
    }
    
    async function fetchAndDisplayChapter(chapterNumber) {
        // Atualiza link ativo
        chapterLinks.forEach(link => link.classList.remove('active'));
        document.querySelector(`.chapter-link[data-chapter='${chapterNumber}']`).classList.add('active');

        // Reseta a view
        wordNav.classList.remove('visible');
        contentArea.innerHTML = '<p>Carregando capítulo...</p>';

        if (dataCache[chapterNumber]) {
            renderChapter(dataCache[chapterNumber], chapterNumber);
            return;
        }

        try {
            const response = await fetch(`./data/ruth-ch${chapterNumber}.json`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const chapterData = await response.json();
            dataCache[chapterNumber] = chapterData;
            renderChapter(chapterData, chapterNumber);
        } catch (error) {
            console.error("Falha ao carregar capítulo:", error);
            contentArea.innerHTML = '<p>Erro ao carregar os dados deste capítulo. Verifique o console para mais detalhes.</p>';
        }
    }

    function displayVerseAnalysisView(chapterNumber, verseNumber) {
        const verseData = currentData?.[verseNumber];
        if (!verseData) return;

        // Atualiza a URL sem recarregar a página
        const newUrl = `?capitulo=${chapterNumber}&versiculo=${verseNumber}`;
        history.pushState({ chapter: chapterNumber, verse: verseNumber }, '', newUrl);

        // Limpa a área de conteúdo e a navegação de palavras
        contentArea.innerHTML = '<h2>Análise do Versículo</h2><p>Selecione uma palavra no menu à direita para ver sua análise detalhada.</p>';
        wordNav.innerHTML = `<h2>Versículo ${chapterNumber}:${verseNumber}</h2>`;

        // Popula a navegação de palavras
        verseData.words.forEach((word, index) => {
            const btn = document.createElement('button');
            btn.className = 'word-btn';
            btn.dataset.wordIndex = index;
            btn.innerHTML = `
                <div class="hebrew-word">${word.hebrew}</div>
                <div class="transliteration">${word.transliteration}</div>
                <div class="translation">${word.briefTranslation}</div>
            `;
            wordNav.appendChild(btn);
        });
        
        wordNav.classList.add('visible');
    }

    function displayWordAnalysis(verseNumber, wordIndex) {
        const wordData = currentData?.[verseNumber]?.words[wordIndex];
        if (!wordData) {
            contentArea.innerHTML = "<p>Dados da palavra não encontrados.</p>";
            return;
        }
        
        // ... (A função de renderização da análise da palavra permanece a mesma da versão anterior)
        // Por brevidade, não será repetida aqui. O código da versão anterior para
        // `displayWordAnalysis` pode ser colado aqui, removendo os argumentos
        // `chapterNumber` e `verseNumber` que agora são gerenciados por `currentData`.
        contentArea.innerHTML = `<div class="word-analysis"><h3>${wordData.hebrew}</h3><p>${wordData.contextualTranslation}</p><p>Análise detalhada para esta palavra seria exibida aqui.</p></div>`;

        // Atualiza botão ativo
        document.querySelectorAll('#word-nav .word-btn').forEach(btn => btn.classList.remove('active'));
        event.currentTarget.classList.add('active');
    }
    
    // -------------------------------------------------------------------
    // III. MANIPULADORES DE EVENTOS E INICIALIZAÇÃO
    // -------------------------------------------------------------------
    chapterNav.addEventListener('click', (e) => {
        if (e.target.matches('.chapter-link')) {
            e.preventDefault();
            fetchAndDisplayChapter(e.target.dataset.chapter);
        }
    });

    contentArea.addEventListener('click', (e) => {
        const verseEl = e.target.closest('.verse');
        if (verseEl) {
            e.preventDefault();
            const { chapterNum, verseNum } = verseEl.dataset;
            displayVerseAnalysisView(chapterNum, verseNum);
        }
    });
    
    wordNav.addEventListener('click', (e) => {
        const wordBtn = e.target.closest('.word-btn');
        if (wordBtn) {
            e.preventDefault();
            // Precisamos saber o versículo atual. Podemos pegar do título ou, melhor,
            // adicionar ao dataset do wordNav quando a view do versículo é criada.
            const verseNumber = document.querySelector('#word-nav h2').textContent.split(' ')[1].split(':')[1];
            displayWordAnalysis(verseNumber, wordBtn.dataset.wordIndex);
        }
    });

    // Função para carregar estado a partir da URL
    function loadStateFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const chapter = params.get('capitulo');
        const verse = params.get('versiculo');

        if (chapter) {
            fetchAndDisplayChapter(chapter).then(() => {
                if (verse && currentData[verse]) {
                    displayVerseAnalysisView(chapter, verse);
                }
            });
        }
    }

    // Carrega o estado inicial
    loadStateFromUrl();
});

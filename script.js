document.addEventListener('DOMContentLoaded', () => {

    // -------------------------------------------------------------------
    // I. SELETORES DE ELEMENTOS DO DOM E ESTADO DA APLICAÇÃO
    // -------------------------------------------------------------------
    const chapterNav = document.getElementById('chapter-nav');
    const contentArea = document.getElementById('content-area');
    const wordNav = document.getElementById('word-nav');
    const chapterLinks = document.querySelectorAll('.chapter-link');
    
    const dataCache = {};
    let grammarLibrary = null; 
    let currentData = null; 
    let currentChapterNumber = null;
    let currentVerseNumber = null;

    // -------------------------------------------------------------------
    // II. LÓGICA DE RENDERIZAÇÃO E BUSCA DE DADOS
    // -------------------------------------------------------------------

    async function loadGrammarLibrary() {
        if (grammarLibrary) return; 
        try {
            const response = await fetch('./data/grammar-library.json');
            if (!response.ok) throw new Error('Falha ao carregar a biblioteca de gramática.');
            grammarLibrary = await response.json();
        } catch (error) {
            console.error("ERRO CRÍTICO:", error);
            contentArea.innerHTML = '<p>Erro fatal: a biblioteca de gramática não pôde ser carregada.</p>';
        }
    }
    
    function renderChapter(chapterData, chapterNumber) {
        currentData = chapterData;
        currentChapterNumber = chapterNumber;
        wordNav.innerHTML = '';
        wordNav.classList.remove('visible');
        contentArea.innerHTML = '';

        const chapterContainer = document.createElement('div');
        chapterContainer.className = 'hebrew-text-display';
        chapterContainer.innerHTML = `<h2>Rute, Capítulo ${chapterNumber}</h2>`;

        for (const verseNum in chapterData) {
            const verseData = chapterData[verseNum];
            const verseEl = document.createElement('p');
            verseEl.className = 'verse';
            verseEl.dataset.chapterNum = chapterNumber;
            verseEl.dataset.verseNum = verseNum;
            verseEl.innerHTML = `<span class="verse-number">${verseNum}</span> ${verseData.hebrewText}`;
            chapterContainer.appendChild(verseEl);
        }
        contentArea.appendChild(chapterContainer);
    }
    
    async function fetchAndDisplayChapter(chapterNumber) {
        chapterLinks.forEach(link => link.classList.remove('active'));
        document.querySelector(`.chapter-link[data-chapter='${chapterNumber}']`).classList.add('active');

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
            contentArea.innerHTML = '<p>Erro ao carregar os dados deste capítulo.</p>';
        }
    }

    function displayVerseAnalysisView(chapterNumber, verseNumber) {
        currentVerseNumber = verseNumber;
        const verseData = currentData?.[verseNumber];
        if (!verseData) return;

        const newUrl = `?capitulo=${chapterNumber}&versiculo=${verseNumber}`;
        history.pushState({ chapter: chapterNumber, verse: verseNumber }, '', newUrl);

        contentArea.innerHTML = '<h2>Análise do Versículo</h2><p>Selecione uma palavra no menu à direita para ver sua análise detalhada.</p>';
        wordNav.innerHTML = ''; // Limpa o painel de palavras

        // --- INÍCIO DA ADIÇÃO: CABEÇALHO DO PAINEL DE PALAVRAS ---
        const paneHeader = document.createElement('div');
        paneHeader.className = 'word-pane-header';

        const paneTitle = document.createElement('h2');
        paneTitle.textContent = `Versículo ${chapterNumber}:${verseNumber}`;

        const backButton = document.createElement('button');
        backButton.id = 'btn-back-to-chapter';
        backButton.textContent = '← Voltar';
        
        paneHeader.appendChild(paneTitle);
        paneHeader.appendChild(backButton);
        wordNav.appendChild(paneHeader);
        // --- FIM DA ADIÇÃO ---

        const verseNavControls = document.createElement('div');
        verseNavControls.className = 'verse-nav-controls';
        const prevBtn = document.createElement('button');
        prevBtn.id = 'btn-prev-verse';
        prevBtn.className = 'verse-nav-btn';
        prevBtn.textContent = '← Anterior';
        const nextBtn = document.createElement('button');
        nextBtn.id = 'btn-next-verse';
        nextBtn.className = 'verse-nav-btn';
        nextBtn.textContent = 'Próximo →';
        const verseKeys = Object.keys(currentData).map(Number);
        const firstVerse = Math.min(...verseKeys);
        const lastVerse = Math.max(...verseKeys);
        if (parseInt(verseNumber) <= firstVerse) prevBtn.disabled = true;
        if (parseInt(verseNumber) >= lastVerse) nextBtn.disabled = true;
        verseNavControls.appendChild(prevBtn);
        verseNavControls.appendChild(nextBtn);
        wordNav.appendChild(verseNavControls);

        verseData.words.forEach((word, index) => {
            const btn = document.createElement('button');
            btn.className = 'word-btn';
            btn.dataset.wordIndex = index;
            btn.innerHTML = `<div class="hebrew-word">${word.hebrew}</div><div class="transliteration">${word.transliteration}</div><div class="translation">${word.briefTranslation}</div>`;
            wordNav.appendChild(btn);
        });
        
        wordNav.classList.add('visible');
    }

    function displayWordAnalysis(wordIndex) {
        const wordData = currentData?.[currentVerseNumber]?.words[wordIndex];
        if (!wordData || !grammarLibrary) {
            contentArea.innerHTML = "<p>Dados da palavra ou biblioteca de gramática não encontrados.</p>";
            return;
        }

        const analysis = wordData.analysis;
        const didacticContent = grammarLibrary[analysis.didacticKey]; 

        let paradigmHtml = '';
        if (didacticContent && didacticContent.paradigm) {
            const paradigm = didacticContent.paradigm;
            const headers = (paradigm.type === 'verb' || paradigm.type === 'participle') ? ['Forma', 'Hebraico', 'Transliteração', 'Tradução'] : ['Descrição', 'Hebraico', 'Transliteração', 'Tradução'];
            paradigmHtml = `
                <h4>${paradigm.title}</h4>
                <table class="paradigm-table">
                    <thead><tr><th>${headers[0]}</th><th>${headers[1]}</th><th>${headers[2]}</th><th>${headers[3]}</th></tr></thead>
                    <tbody>${paradigm.rows.map(row => `<tr><td>${row[0]}</td><td class="hebrew-form">${row[1]}</td><td><em>${row[2]}</em></td><td>${row[3]}</td></tr>`).join('')}</tbody>
                </table>`;
        }
        
        let didacticHtml = '';
        if (didacticContent) {
            didacticHtml = `
                <h3>Revisão Gramatical Didática</h3>
                <div class="didactic-explanation">
                    <h4>${didacticContent.title}</h4>
                    <p>${didacticContent.explanation}</p>
                    ${paradigmHtml}
                </div>`;
        }
        
        contentArea.innerHTML = `
            <div class="word-analysis">
                <h3>Identificação</h3>
                <p class="analysis-item"><strong>Palavra:</strong> <span class="hebrew-lemma">${wordData.hebrew}</span></p>
                <p class="analysis-item"><strong>Lema (Raiz):</strong> <span class="hebrew-lemma">${wordData.lemma}</span></p>
                <p class="analysis-item"><strong>Tradução Contextual:</strong> ${wordData.contextualTranslation}</p>
                <h3>Análise Morfológica</h3>
                <p class="analysis-item"><strong>Classe Gramatical:</strong> ${analysis.class}</p>
                ${analysis.binyan ? `<p class="analysis-item"><strong>Tronco (Binyan):</strong> ${analysis.binyan}</p>` : ''}
                ${analysis.tense ? `<p class="analysis-item"><strong>Tempo/Aspecto:</strong> ${analysis.tense}</p>` : ''}
                ${analysis.pgn ? `<p class="analysis-item"><strong>Pessoa, Gênero, Número:</strong> ${analysis.pgn}</p>` : ''}
                ${analysis.gender ? `<p class="analysis-item"><strong>Gênero:</strong> ${analysis.gender}</p>` : ''}
                ${analysis.number ? `<p class="analysis-item"><strong>Número:</strong> ${analysis.number}</p>` : ''}
                ${analysis.state ? `<p class="analysis-item"><strong>Estado:</strong> ${analysis.state}</p>` : ''}
                ${analysis.extra ? `<p class="analysis-item"><strong>Informações Adicionais:</strong> ${analysis.extra}</p>` : ''}
                ${didacticHtml}
                ${analysis.reference ? `<p class="grammar-reference">Para aprofundamento, consulte: ${analysis.reference}</p>` : ''}
            </div>`;
        
        document.querySelectorAll('#word-nav .word-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.word-btn[data-word-index='${wordIndex}']`).classList.add('active');
    }

    function navigateToVerse(direction) {
        const verseKeys = Object.keys(currentData).map(Number).sort((a,b) => a - b);
        const currentIndex = verseKeys.indexOf(parseInt(currentVerseNumber));
        let nextIndex = (direction === 'next') ? currentIndex + 1 : currentIndex - 1;
        
        if (nextIndex >= 0 && nextIndex < verseKeys.length) {
            const newVerseNumber = verseKeys[nextIndex];
            displayVerseAnalysisView(currentChapterNumber, newVerseNumber.toString());
        }
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
            displayVerseAnalysisView(verseEl.dataset.chapterNum, verseEl.dataset.verseNum);
        }
    });
    
    wordNav.addEventListener('click', (e) => {
        if (e.target.matches('#btn-back-to-chapter')) {
            e.preventDefault();
            fetchAndDisplayChapter(currentChapterNumber);
            return;
        }

        const wordBtn = e.target.closest('.word-btn');
        if (wordBtn) {
            e.preventDefault();
            displayWordAnalysis(wordBtn.dataset.wordIndex);
            return;
        }
        if (e.target.matches('#btn-next-verse')) navigateToVerse('next');
        if (e.target.matches('#btn-prev-verse')) navigateToVerse('previous');
    });

    async function initializeApp() {
        await loadGrammarLibrary(); 
        const params = new URLSearchParams(window.location.search);
        const chapter = params.get('capitulo');
        const verse = params.get('versiculo');

        if (chapter) {
            await fetchAndDisplayChapter(chapter);
            if (verse && currentData[verse]) {
                displayVerseAnalysisView(chapter, verse);
            }
        }
    }

    initializeApp();
});

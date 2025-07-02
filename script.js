document.addEventListener('DOMContentLoaded', () => {

    // -------------------------------------------------------------------
    // I. SELETORES DE ELEMENTOS DO DOM E ESTADO DA APLICAÇÃO
    // -------------------------------------------------------------------
    const chapterNav = document.getElementById('chapter-nav');
    const contentArea = document.getElementById('content-area');
    const wordNav = document.getElementById('word-nav');
    const chapterLinks = document.querySelectorAll('.chapter-link');
    
    const dataCache = {};
    let currentData = null; // Armazena dados do capítulo carregado
    let currentChapterNumber = null;
    let currentVerseNumber = null;

    // -------------------------------------------------------------------
    // II. LÓGICA DE RENDERIZAÇÃO E BUSCA DE DADOS
    // -------------------------------------------------------------------

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
            contentArea.innerHTML = '<p>Erro ao carregar os dados deste capítulo. Verifique o console para mais detalhes.</p>';
        }
    }

    function displayVerseAnalysisView(chapterNumber, verseNumber) {
        currentVerseNumber = verseNumber;
        const verseData = currentData?.[verseNumber];
        if (!verseData) return;

        const newUrl = `?capitulo=${chapterNumber}&versiculo=${verseNumber}`;
        history.pushState({ chapter: chapterNumber, verse: verseNumber }, '', newUrl);

        contentArea.innerHTML = '<h2>Análise do Versículo</h2><p>Selecione uma palavra no menu à direita para ver sua análise detalhada.</p>';
        wordNav.innerHTML = `<h2>Versículo ${chapterNumber}:${verseNumber}</h2>`;

        // --- LÓGICA DOS BOTÕES DE NAVEGAÇÃO (NOVO) ---
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

        // Lógica para desabilitar botões
        const verseKeys = Object.keys(currentData).map(Number);
        const firstVerse = Math.min(...verseKeys);
        const lastVerse = Math.max(...verseKeys);

        if (parseInt(verseNumber) <= firstVerse) {
            prevBtn.disabled = true;
        }
        if (parseInt(verseNumber) >= lastVerse) {
            nextBtn.disabled = true;
        }

        verseNavControls.appendChild(prevBtn);
        verseNavControls.appendChild(nextBtn);
        wordNav.appendChild(verseNavControls);
        // --- FIM DA LÓGICA DOS BOTÕES ---

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

    function displayWordAnalysis(wordIndex) {
        const wordData = currentData?.[currentVerseNumber]?.words[wordIndex];
        if (!wordData) {
            contentArea.innerHTML = "<p>Dados da palavra não encontrados.</p>";
            return;
        }
        
        // Substitua por sua lógica de renderização completa se necessário
        contentArea.innerHTML = `
            <div class="word-analysis">
                <h3>Análise de: <span class="hebrew-lemma">${wordData.hebrew}</span></h3>
                <p><strong>Lema:</strong> ${wordData.lemma}</p>
                <p><strong>Tradução Contextual:</strong> ${wordData.contextualTranslation}</p>
                <p>--- Análise morfológica detalhada e paradigmas seriam exibidos aqui ---</p>
            </div>
        `;

        document.querySelectorAll('#word-nav .word-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.word-btn[data-word-index='${wordIndex}']`).classList.add('active');
    }

    function navigateToVerse(direction) {
        const verseKeys = Object.keys(currentData).map(Number).sort((a,b) => a - b);
        const currentIndex = verseKeys.indexOf(parseInt(currentVerseNumber));

        let nextIndex;
        if (direction === 'next') {
            nextIndex = currentIndex + 1;
        } else {
            nextIndex = currentIndex - 1;
        }
        
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
            const { chapterNum, verseNum } = verseEl.dataset;
            displayVerseAnalysisView(chapterNum, verseNum);
        }
    });
    
    wordNav.addEventListener('click', (e) => {
        const wordBtn = e.target.closest('.word-btn');
        if (wordBtn) {
            e.preventDefault();
            displayWordAnalysis(wordBtn.dataset.wordIndex);
            return;
        }

        if (e.target.matches('#btn-next-verse')) {
            navigateToVerse('next');
            return;
        }

        if (e.target.matches('#btn-prev-verse')) {
            navigateToVerse('previous');
            return;
        }
    });

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

    loadStateFromUrl();
});

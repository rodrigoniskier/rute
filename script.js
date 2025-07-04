// Aguarda o conteúdo do HTML ser totalmente carregado para executar o script
document.addEventListener('DOMContentLoaded', () => {

    // --- SELETORES DE ELEMENTOS DO DOM ---
    const mainContent = document.getElementById('main-content');
    const chapterNav = document.getElementById('chapter-navigation');
    const sidebarRight = document.getElementById('sidebar-right');
    const wordList = document.getElementById('word-list');
    const welcomeScreen = document.getElementById('welcome-screen');
    const chapterView = document.getElementById('chapter-view');
    const wordAnalysisView = document.getElementById('word-analysis-view');
    const chapterTitle = document.getElementById('chapter-title');
    const verseContainer = document.getElementById('verse-container');
    const prevVerseBtn = document.getElementById('prev-verse-btn');
    const nextVerseBtn = document.getElementById('next-verse-btn');
    const backToChapterBtn = document.getElementById('back-to-chapter-btn');

    // --- VARIÁVEIS DE ESTADO DA APLICAÇÃO ---
    let currentChapterData = null;
    let currentChapterNumber = 0;
    let currentVerseNumber = 0;
    const totalChapters = 4;

    // --- FUNÇÕES PRINCIPAIS ---

    /**
     * Função para buscar os dados de um capítulo a partir de um arquivo JSON.
     * @param {number} chapterNum - O número do capítulo a ser carregado.
     */
    async function loadChapter(chapterNum) {
        try {
            // ***** CORREÇÃO APLICADA AQUI *****
            // Agora, o nome do arquivo é construído dinamicamente com base no botão clicado.
            const response = await fetch(`ruth-ch${chapterNum}.json`);
            
            if (!response.ok) {
                // Esta mensagem de erro agora será mais precisa.
                throw new Error(`Não foi possível carregar o arquivo ruth-ch${chapterNum}.json.`);
            }
            const data = await response.json();
            currentChapterData = data;
            currentChapterNumber = chapterNum;
            displayChapterText(chapterNum);
            updateActiveChapterButton(chapterNum);
        } catch (error) {
            console.error(error);
            // Mensagem de erro mais clara para o usuário
            alert(`Erro ao carregar dados do capítulo ${chapterNum}. Verifique se o arquivo "ruth-ch${chapterNum}.json" existe na pasta correta e se você está usando um servidor local (veja a próxima explicação).`);
        }
    }

    /**
     * Exibe o conteúdo de uma "tela" principal e esconde as outras.
     * @param {HTMLElement} viewToShow - O elemento da tela a ser exibido.
     */
    function showMainView(viewToShow) {
        [welcomeScreen, chapterView, wordAnalysisView].forEach(view => {
            view.classList.remove('active');
        });
        viewToShow.classList.add('active');
    }

    /**
     * Constrói e exibe o texto completo de um capítulo.
     * @param {number} chapterNum - O número do capítulo.
     */
    function displayChapterText(chapterNum) {
        verseContainer.innerHTML = '';
        chapterTitle.textContent = `Capítulo ${chapterNum}`;
        for (const verseNum in currentChapterData) {
            const verseData = currentChapterData[verseNum];
            const verseEl = document.createElement('div');
            verseEl.className = 'verse';
            verseEl.dataset.chapter = chapterNum;
            verseEl.dataset.verse = verseNum;
            verseEl.innerHTML = `<strong class="verse-number">${verseNum}</strong> ${verseData.hebrewText}`;
            verseEl.addEventListener('click', () => {
                currentVerseNumber = parseInt(verseNum);
                displayVerseWords(currentVerseNumber);
            });
            verseContainer.appendChild(verseEl);
        }
        showMainView(chapterView);
        sidebarRight.classList.remove('visible');
    }
    
    /**
     * Exibe a lista de palavras de um versículo na barra lateral direita.
     * @param {number} verseNum - O número do versículo.
     */
    function displayVerseWords(verseNum) {
        wordList.innerHTML = '';
        const words = currentChapterData[verseNum].words;
        words.forEach((wordData, index) => {
            const wordBtn = document.createElement('button');
            wordBtn.textContent = wordData.hebrew;
            wordBtn.dataset.chapter = currentChapterNumber;
            wordBtn.dataset.verse = verseNum;
            wordBtn.dataset.wordIndex = index;
            wordBtn.addEventListener('click', () => {
                displayWordAnalysis(wordData);
            });
            wordList.appendChild(wordBtn);
        });
        sidebarRight.classList.add('visible');
    }

    /**
     * Constrói e exibe a análise gramatical detalhada de uma palavra.
     * @param {object} wordData - O objeto contendo todos os dados da palavra.
     */
    function displayWordAnalysis(wordData) {
        const analysis = wordData.analysis;
        const didactic = analysis.didactic;
        let analysisHTML = `...`; // O restante da função continua igual
        
        analysisHTML = `
            <div class="analysis-card">
                <p class="analysis-hebrew">${wordData.hebrew}</p>
                <div class="analysis-header">
                    <h2>${wordData.transliteration}</h2>
                    <p>"${wordData.contextualTranslation}"</p>
                </div>
                <div class="analysis-section">
                    <h3>Análise Principal</h3>
                    <div class="analysis-item"><strong>Tradução Breve:</strong> <span>${wordData.briefTranslation}</span></div>
                    <div class="analysis-item"><strong>Lema:</strong> <span>${wordData.lemma} (${analysis.lemmaTranslation})</span></div>
                    <div class="analysis-item"><strong>Classe:</strong> <span>${analysis.class}</span></div>
                    ${analysis.binyan ? `<div class="analysis-item"><strong>Binyan:</strong> <span>${analysis.binyan}</span></div>` : ''}
                    ${analysis.tense ? `<div class="analysis-item"><strong>Tempo/Aspecto:</strong> <span>${analysis.tense}</span></div>` : ''}
                    ${analysis.pgn ? `<div class="analysis-item"><strong>PGN:</strong> <span>${analysis.pgn}</span></div>` : ''}
                    ${analysis.gender ? `<div class="analysis-item"><strong>Gênero:</strong> <span>${analysis.gender}</span></div>` : ''}
                    ${analysis.number ? `<div class="analysis-item"><strong>Número:</strong> <span>${analysis.number}</span></div>` : ''}
                    ${analysis.state ? `<div class="analysis-item"><strong>Estado:</strong> <span>${analysis.state}</span></div>` : ''}
                    ${analysis.extra ? `<div class="analysis-item"><strong>Extra:</strong> <span>${analysis.extra}</span></div>` : ''}
                </div>
        `;
        if (didactic) {
            analysisHTML += `<div class="analysis-section"><h3>Análise Didática: ${didactic.conceptTitle}</h3>`;
            didactic.identification.forEach(item => {
                analysisHTML += `<p><strong>${item.feature}:</strong> ${item.indicator}</p>`;
            });
            if (didactic.paradigm) {
                analysisHTML += createParadigmTable(didactic.paradigm);
            }
            analysisHTML += `</div>`;
        }
        analysisHTML += `</div>`;
        wordAnalysisView.innerHTML = analysisHTML;
        showMainView(wordAnalysisView);
    }
    
    function createParadigmTable(paradigmData) {
        let tableHTML = `<br><h4>${paradigmData.title}</h4><table class="paradigm-table">`;
        tableHTML += `<tr><th>Caso</th><th>Hebraico</th><th>Translit.</th><th>Tradução</th></tr>`;
        paradigmData.rows.forEach(row => {
            tableHTML += `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td>${row[3]}</td></tr>`;
        });
        tableHTML += `</table>`;
        return tableHTML;
    }

    function navigateVerse(direction) {
        if (!currentChapterData) return;
        const nextVerse = currentVerseNumber + direction;
        if (currentChapterData[nextVerse]) {
            currentVerseNumber = nextVerse;
            displayVerseWords(currentVerseNumber);
        }
    }
    
    function createChapterButtons() {
        for (let i = 1; i <= totalChapters; i++) {
            const btn = document.createElement('button');
            btn.textContent = `Capítulo ${i}`;
            btn.dataset.chapter = i;
            if (i > 1) { 
                btn.disabled = true;
                btn.style.cursor = 'not-allowed';
                btn.title = 'Ainda não disponível';
            }
            chapterNav.appendChild(btn);
        }
    }

    function updateActiveChapterButton(chapterNum) {
        const buttons = chapterNav.querySelectorAll('button');
        buttons.forEach(btn => {
            if (btn.dataset.chapter == chapterNum) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // --- CONFIGURAÇÃO DE EVENTOS ---
    chapterNav.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' && !e.target.disabled) {
            const chapterNum = e.target.dataset.chapter;
            if(chapterNum) {
                loadChapter(parseInt(chapterNum));
            }
        }
    });
    prevVerseBtn.addEventListener('click', () => navigateVerse(-1));
    nextVerseBtn.addEventListener('click', () => navigateVerse(1));
    backToChapterBtn.addEventListener('click', () => {
        displayChapterText(currentChapterNumber);
    });

    // --- INICIALIZAÇÃO ---
    createChapterButtons();
});

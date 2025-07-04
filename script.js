document.addEventListener("DOMContentLoaded", () => {
    // --- Seletores de Elementos ---
    const welcomeScreen = document.getElementById("welcome-screen");
    const chapterView = document.getElementById("chapter-view");
    const analysisView = document.getElementById("analysis-view");
    const chapterTitle = document.getElementById("chapter-title");
    const verseList = document.getElementById("verse-list");
    const analysisVerseNumber = document.getElementById("analysis-verse-number");
    const backToWelcomeButton = document.getElementById("back-to-welcome");
    const prevVerseButton = document.getElementById("prev-verse");
    const nextVerseButton = document.getElementById("next-verse");
    const wordList = document.getElementById("word-list");
    const wordAnalysisTitle = document.getElementById("word-analysis-title");
    const wordDetails = document.getElementById("word-details");

    // --- Estado da Aplicação ---
    const dataCache = {};
    let currentChapterData = null;
    let currentChapterNum = -1;
    let currentVerseNum = -1;

    // --- Funções de Lógica ---

    async function loadChapter(chapterNum) {
        // Mostra uma mensagem de carregamento
        welcomeScreen.style.display = "none";
        analysisView.style.display = "none";
        chapterView.style.display = "block";
        verseList.innerHTML = "<p>Carregando dados do capítulo...</p>";

        if (dataCache[chapterNum]) {
            currentChapterData = dataCache[chapterNum];
            displayChapter(chapterNum);
            return;
        }
        try {
            // CORREÇÃO: Caminho explícito para a pasta 'data'
            const response = await fetch(`./data/ruth-ch${chapterNum}.json`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            dataCache[chapterNum] = data;
            currentChapterData = data;
            displayChapter(chapterNum);
        } catch (error) {
            console.error("Erro ao carregar o capítulo:", error);
            verseList.innerHTML = `<p style="color: red;">Erro ao carregar o capítulo ${chapterNum}. Verifique se o arquivo 'ruth-ch${chapterNum}.json' existe dentro de uma pasta chamada 'data'.</p>`;
        }
    }

    function displayChapter(chapterNum) {
        welcomeScreen.style.display = "none";
        analysisView.style.display = "none";
        chapterView.style.display = "block";

        chapterTitle.textContent = `Capítulo ${chapterNum}`;
        verseList.innerHTML = "";
        currentChapterNum = chapterNum;

        if (!currentChapterData) return;
        
        // CORREÇÃO: Itera sobre as chaves do objeto, não sobre um array
        for (const verseNumber in currentChapterData) {
            const verseData = currentChapterData[verseNumber];
            const verseDiv = document.createElement("div");
            verseDiv.classList.add("verse-item");
            verseDiv.dataset.verse = verseNumber;

            const verseNumberSpan = document.createElement("span");
            verseNumberSpan.classList.add("verse-number");
            verseNumberSpan.textContent = `${verseNumber}:`;

            const hebrewTextSpan = document.createElement("span");
            hebrewTextSpan.classList.add("hebrew-text");
            hebrewTextSpan.textContent = verseData.hebrewText;

            verseDiv.appendChild(verseNumberSpan);
            verseDiv.appendChild(hebrewTextSpan);
            verseList.appendChild(verseDiv);
        }
    }

    function displayVerseAnalysis(verseNum) {
        chapterView.style.display = "none";
        welcomeScreen.style.display = "none";
        analysisView.style.display = "flex";

        currentVerseNum = verseNum;
        const verse = currentChapterData[currentVerseNum];
        analysisVerseNumber.textContent = `Versículo ${currentChapterNum}:${verseNum}`;

        wordList.innerHTML = "";
        if (verse.words && verse.words.length > 0) {
            verse.words.forEach((word, index) => {
                const wordButton = document.createElement("button");
                wordButton.classList.add("word-list-item");
                wordButton.dataset.wordIndex = index;
                wordButton.innerHTML = `
                    <span class="hebrew-word">${word.hebrew}</span>
                    <span class="transliteration">${word.transliteration}</span>
                    <span class="basic-translation">${word.briefTranslation}</span>
                `;
                wordList.appendChild(wordButton);
            });
        }

        wordAnalysisTitle.textContent = "Selecione uma palavra";
        wordDetails.innerHTML = "<p>Clique em uma palavra na lista para ver sua análise detalhada.</p>";
        updateNavigationButtons();
    }

    function displayWordDetails(wordIndex) {
        const word = currentChapterData[currentVerseNum].words[wordIndex];
        if (!word) return;

        const analysis = word.analysis;
        const didacticContent = analysis.didactic;

        wordAnalysisTitle.textContent = `Análise de: ${word.hebrew}`;
        
        let didacticHtml = '';
        if (didacticContent && didacticContent.identification) {
            const identificationSteps = didacticContent.identification.map(step => 
                `<p><strong>${step.feature}:</strong> ${step.indicator}</p>`
            ).join('');

            let paradigmHtml = '';
            if (didacticContent.paradigm) {
                const paradigm = didacticContent.paradigm;
                const headers = (paradigm.type.includes('verb') || paradigm.type.includes('pronominal')) 
                    ? ['Forma', 'Hebraico', 'Transliteração', 'Tradução'] 
                    : ['Descrição', 'Hebraico', 'Transliteração', 'Tradução'];
                
                paradigmHtml = `
                    <h4>${paradigm.title}</h4>
                    <table class="paradigm-table">
                        <thead><tr><th>${headers[0]}</th><th>${headers[1]}</th><th>${headers[2]}</th><th>${headers[3]}</th></tr></thead>
                        <tbody>${paradigm.rows.map(row => `<tr><td>${row[0]}</td><td class="hebrew-form">${row[1]}</td><td><em>${row[2]}</em></td><td>${row[3]}</td></tr>`).join('')}</tbody>
                    </table>`;
            }

            didacticHtml = `
                <h3>Revisão Gramatical Didática</h3>
                <h4>${didacticContent.conceptTitle}</h4>
                ${identificationSteps}
                ${paradigmHtml}`;
        }

        wordDetails.innerHTML = `
            <p><strong>Lema:</strong> ${word.lemma} (${analysis.lemmaTranslation})</p>
            <p><strong>Tradução Contextual:</strong> ${word.contextualTranslation}</p>
            <h3>Análise Morfológica</h3>
            <p><strong>Classe:</strong> ${analysis.class}</p>
            ${analysis.binyan ? `<p><strong>Tronco (Binyan):</strong> ${analysis.binyan}</p>` : ''}
            ${analysis.tense ? `<p><strong>Tempo/Aspecto:</strong> ${analysis.tense}</p>` : ''}
            ${analysis.pgn ? `<p><strong>PGN:</strong> ${analysis.pgn}</p>` : ''}
            ${analysis.gender ? `<p><strong>Gênero:</strong> ${analysis.gender}</p>` : ''}
            ${analysis.number ? `<p><strong>Número:</strong> ${analysis.number}</p>` : ''}
            ${analysis.state ? `<p><strong>Estado:</strong> ${analysis.state}</p>` : ''}
            ${analysis.extra ? `<p><strong>Informações Adicionais:</strong> ${analysis.extra}</p>` : ''}
            ${didacticHtml}
            ${analysis.reference ? `<p class="grammar-reference">Para aprofundamento, consulte: ${analysis.reference}</p>` : ''}
        `;
    }

    function updateNavigationButtons() {
        const verseKeys = Object.keys(currentChapterData).map(Number).sort((a, b) => a - b);
        const currentIndex = verseKeys.indexOf(Number(currentVerseNum));
        prevVerseButton.disabled = currentIndex === 0;
        nextVerseButton.disabled = currentIndex === verseKeys.length - 1;
    }

    // --- Event Listeners ---

    document.querySelectorAll(".chapter-button").forEach(button => {
        button.addEventListener("click", (event) => {
            loadChapter(event.target.dataset.chapter);
        });
    });

    verseList.addEventListener("click", (event) => {
        const verseItem = event.target.closest(".verse-item");
        if (verseItem) {
            displayVerseAnalysis(verseItem.dataset.verse);
        }
    });

    wordList.addEventListener("click", (event) => {
        const wordItem = event.target.closest(".word-list-item");
        if (wordItem) {
            document.querySelectorAll('.word-list-item').forEach(btn => btn.classList.remove('active'));
            wordItem.classList.add('active');
            displayWordDetails(wordItem.dataset.wordIndex);
        }
    });

    backToWelcomeButton.addEventListener("click", () => {
        analysisView.style.display = "none";
        chapterView.style.display = "none";
        welcomeScreen.style.display = "block";
    });

    prevVerseButton.addEventListener("click", () => {
        const verseKeys = Object.keys(currentChapterData).map(Number).sort((a, b) => a - b);
        const currentIndex = verseKeys.indexOf(Number(currentVerseNum));
        if (currentIndex > 0) {
            displayVerseAnalysis(verseKeys[currentIndex - 1].toString());
        }
    });

    nextVerseButton.addEventListener("click", () => {
        const verseKeys = Object.keys(currentChapterData).map(Number).sort((a, b) => a - b);
        const currentIndex = verseKeys.indexOf(Number(currentVerseNum));
        if (currentIndex < verseKeys.length - 1) {
            displayVerseAnalysis(verseKeys[currentIndex + 1].toString());
        }
    });

    // Inicialização
    welcomeScreen.style.display = "block";
    chapterView.style.display = "none";
    analysisView.style.display = "none";
});

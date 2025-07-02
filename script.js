// Aguarda o DOM ser totalmente carregado para executar o script
document.addEventListener('DOMContentLoaded', () => {

    // -------------------------------------------------------------------
    // I. BASE DE DADOS GRAMATICAL (PARA RUTE, CAPÍTULO 1)
    // Fonte Primária: Biblia Hebraica Stuttgartensia (BHS)
    // Fundamentação Gramatical: GKC, Joüon-Muraoka
    // -------------------------------------------------------------------
    const ruthData = {
        "1": { // Capítulo 1
            "1": { // Versículo 1
                hebrewText: "וַיְהִ֗י בִּימֵי֙ שְׁפֹ֣ט הַשֹּׁפְטִ֔ים וַיְהִ֥י רָעָ֖ב בָּאָ֑רֶץ וַיֵּ֨לֶךְ אִ֜ישׁ מִבֵּ֧ית לֶ֣חֶם יְהוּדָ֗ה לָג֛וּר בִּשְׂדֵ֥י מוֹאָ֖ב ה֥וּא וְאִשְׁתּ֖וֹ וּשְׁנֵ֥י בָנָֽיו׃",
                words: [
                    {
                        hebrew: "וַיְהִ֗י",
                        transliteration: "wayhî",
                        lemma: "הָיָה",
                        briefTranslation: "e aconteceu",
                        contextualTranslation: "E aconteceu...",
                        analysis: {
                            class: "Verbo",
                            binyan: "Qal",
                            tense: "Imperfeito com Vav Consecutivo",
                            pgn: "3ms (3ª pessoa, masculino, singular)",
                            extra: "O Vav Consecutivo (וַ) inverte o tempo do verbo, resultando em uma tradução no passado.",
                            didactic: {
                                title: "Verbo: Qal Imperfeito com Vav Consecutivo",
                                explanation: "O tronco Qal indica a ação simples e ativa. O Imperfeito descreve uma ação incompleta ou futura. O 'Vav Consecutivo' antes de um verbo no Imperfeito o conecta à narrativa anterior e inverte seu tempo para o passado, sendo traduzido como 'E [então]...'.",
                                paradigm: {
                                    type: 'verb',
                                    title: 'Paradigma Modelo: Verbo Qal Imperfeito (לָמַד - aprender)',
                                    rows: [
                                        ['3ms', 'יִלְמַד', 'yilmad', 'ele aprenderá'],
                                        ['3fs', 'תִּלְמַד', 'tilmad', 'ela aprenderá'],
                                        ['2ms', 'תִּלְמַד', 'tilmad', 'tu (m.) aprenderás'],
                                        ['2fs', 'תִּלְמְדִי', 'tilmədî', 'tu (f.) aprenderás'],
                                        ['1cs', 'אֶלְמַד', '’elmad', 'eu aprenderei'],
                                        ['3mp', 'יִלְמְדוּ', 'yilmədû', 'eles aprenderão'],
                                        ['3fp', 'תִּלְמַדְנָה', 'tilmadnâ', 'elas aprenderão'],
                                        ['2mp', 'תִּלְמְדוּ', 'tilmədû', 'vós (m.) aprendereis'],
                                        ['2fp', 'תִּלְמַדְנָה', 'tilmadnâ', 'vós (f.) aprendereis'],
                                        ['1cp', 'נִלְמַד', 'nilmad', 'nós aprenderemos'],
                                    ]
                                }
                            },
                            reference: "GKC §111a-h, §49c"
                        }
                    },
                    {
                        hebrew: "בִּימֵי֙",
                        transliteration: "bîmê",
                        lemma: "יוֹם",
                        briefTranslation: "nos dias de",
                        contextualTranslation: "...nos dias em que...",
                        analysis: {
                            class: "Substantivo com Preposição Inseparável",
                            gender: "Masculino",
                            number: "Plural",
                            state: "Construto",
                            extra: "Preposição inseparável בְּ (em, com) + forma construta plural de יוֹם (dia).",
                             didactic: {
                                title: "Substantivo: Estado Construto",
                                explanation: "O estado construto indica uma relação de posse ou associação ('de'). A forma do substantivo é frequentemente alterada (encurtada) para se ligar à palavra seguinte. Aqui, 'os dias de...'." ,
                                paradigm: {
                                    type: 'noun',
                                    title: 'Paradigma Modelo: Substantivo (סוּס - cavalo)',
                                    rows: [
                                        ['Absoluto Singular', 'סוּס', 'sûs', 'um cavalo'],
                                        ['Construto Singular', 'סוּס', 'sûs', 'cavalo de...'],
                                        ['Absoluto Plural', 'סוּסִים', 'sûsîm', 'cavalos'],
                                        ['Construto Plural', 'סוּסֵי', 'sûsê', 'cavalos de...'],
                                    ]
                                }
                            },
                            reference: "GKC §89, §128"
                        }
                    },
                     {
                        hebrew: "שְׁפֹט",
                        transliteration: "šəpōṭ",
                        lemma: "שָׁפַט",
                        briefTranslation: "o julgar de",
                        contextualTranslation: "...em que julgavam...",
                        analysis: {
                            class: "Verbo",
                            binyan: "Qal",
                            tense: "Infinitivo Construto",
                            pgn: "N/A",
                            extra: "Usado como um substantivo verbal. Forma a cabeça de uma cadeia construta com a palavra seguinte.",
                             didactic: {
                                title: "Verbo: Infinitivo Construto",
                                explanation: "O Infinitivo Construto é uma forma verbal que funciona como um substantivo, expressando a ideia da ação ('o ato de...'). É frequentemente usado após preposições ou em cadeias construtas, como aqui: 'nos dias de o julgar de os juízes', ou seja, 'quando os juízes julgavam'.",
                            },
                            reference: "GKC §114"
                        }
                    },
                    {
                        hebrew: "הַשֹּׁפְטִ֔ים",
                        transliteration: "haššōp̄əṭîm",
                        lemma: "שָׁפַט",
                        briefTranslation: "os juízes",
                        contextualTranslation: "...os juízes.",
                        analysis: {
                            class: "Particípio (usado como Substantivo)",
                            binyan: "Qal",
                            tense: "Particípio Ativo",
                            gender: "Masculino",
                            number: "Plural",
                            state: "Absoluto",
                            extra: "Contém o artigo definido 'הַ' (o, a). O particípio ativo descreve alguém que realiza a ação do verbo ('aquele que julga').",
                             didactic: {
                                title: "Verbo: Particípio Ativo Qal",
                                explanation: "O Particípio Ativo Qal descreve uma ação contínua ou o agente que realiza a ação, podendo funcionar como um verbo, adjetivo ou substantivo. No plural e com o artigo, como aqui, significa 'os juízes'.",
                                paradigm: {
                                    type: 'participle',
                                    title: 'Paradigma Modelo: Particípio Ativo Qal (כָּתַב - escrever)',
                                    rows: [
                                        ['Masc. Singular', 'כֹּתֵב', 'kōṯēḇ', 'escrevendo / escritor'],
                                        ['Fem. Singular', 'כֹּתֶבֶת', 'kōṯeḇeṯ', 'escrevendo / escritora'],
                                        ['Masc. Plural', 'כֹּתְבִים', 'kōṯəḇîm', 'escrevendo / escritores'],
                                        ['Fem. Plural', 'כֹּתְבוֹת', 'kōṯəḇôṯ', 'escrevendo / escritoras'],
                                    ]
                                }
                            },
                            reference: "GKC §116"
                        }
                    },
                    // ... DADOS PARA AS OUTRAS PALAVRAS DO VERSÍCULO 1 SEGUIRIAM AQUI ...
                ]
            }
            // ... DADOS PARA OS OUTROS VERSÍCULOS DO CAPÍTULO 1 SEGUIRIAM AQUI ...
        }
        // ... DADOS PARA OS CAPÍTULOS 2, 3, E 4 SEGUIRIAM AQUI ...
    };

    // -------------------------------------------------------------------
    // II. SELETORES DE ELEMENTOS DO DOM
    // -------------------------------------------------------------------
    const chapterNav = document.getElementById('chapter-nav');
    const contentArea = document.getElementById('content-area');
    const wordNav = document.getElementById('word-nav');
    const chapterLinks = document.querySelectorAll('.chapter-link');

    let currentChapter = null;
    let currentVerse = null;

    // -------------------------------------------------------------------
    // III. LÓGICA DE RENDERIZAÇÃO
    // -------------------------------------------------------------------

    function displayChapter(chapterNumber) {
        // Reseta o estado
        currentChapter = chapterNumber;
        currentVerse = null;
        wordNav.innerHTML = '';
        wordNav.classList.remove('visible');
        contentArea.innerHTML = '';

        // Atualiza link ativo
        chapterLinks.forEach(link => link.classList.remove('active'));
        document.querySelector(`.chapter-link[data-chapter='${chapterNumber}']`).classList.add('active');

        const chapterData = ruthData[chapterNumber];
        if (!chapterData) {
            contentArea.innerHTML = '<p>Conteúdo para este capítulo ainda não disponível.</p>';
            return;
        }

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

    function displayVerseAnalysisView(chapterNumber, verseNumber) {
        currentVerse = verseNumber;
        const verseData = ruthData[chapterNumber]?.[verseNumber];

        if (!verseData) return;

        // Limpa a área de conteúdo e a navegação de palavras
        contentArea.innerHTML = '<p>Selecione uma palavra no menu à direita para ver sua análise detalhada.</p>';
        wordNav.innerHTML = `<h2>Versículo ${chapterNumber}:${verseNumber}</h2>`;

        // Popula a navegação de palavras (menu direito)
        verseData.words.forEach((word, index) => {
            const btn = document.createElement('button');
            btn.className = 'word-btn';
            btn.dataset.chapterNum = chapterNumber;
            btn.dataset.verseNum = verseNumber;
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

    function displayWordAnalysis(chapterNumber, verseNumber, wordIndex) {
        const wordData = ruthData[chapterNumber]?.[verseNumber]?.words[wordIndex];
        if (!wordData) return;

        // Atualiza botão ativo
        document.querySelectorAll('.word-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.word-btn[data-word-index='${wordIndex}']`).classList.add('active');

        const analysis = wordData.analysis;
        
        let paradigmHtml = '';
        if (analysis.didactic && analysis.didactic.paradigm) {
            const paradigm = analysis.didactic.paradigm;
            const headers = paradigm.type === 'verb' || paradigm.type === 'participle'
                ? ['Forma', 'Hebraico', 'Transliteração', 'Tradução']
                : ['Descrição', 'Hebraico', 'Transliteração', 'Tradução'];
            
            paradigmHtml = `
                <h4>${paradigm.title}</h4>
                <table class="paradigm-table">
                    <thead>
                        <tr>
                            <th>${headers[0]}</th>
                            <th>${headers[1]}</th>
                            <th>${headers[2]}</th>
                            <th>${headers[3]}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${paradigm.rows.map(row => `
                            <tr>
                                <td>${row[0]}</td>
                                <td class="hebrew-form">${row[1]}</td>
                                <td><em>${row[2]}</em></td>
                                <td>${row[3]}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }
        
        let didacticHtml = '';
        if (analysis.didactic) {
            didacticHtml = `
                <h3>Revisão Gramatical Didática</h3>
                <div class="didactic-explanation">
                    <h4>${analysis.didactic.title}</h4>
                    <p>${analysis.didactic.explanation}</p>
                    ${paradigmHtml}
                </div>
            `;
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
                
                <p class="grammar-reference">Para aprofundamento, consulte: GKC §${analysis.reference}</p>
            </div>
        `;
    }

    // -------------------------------------------------------------------
    // IV. MANIPULADORES DE EVENTOS (EVENT HANDLERS)
    // -------------------------------------------------------------------
    
    // Evento para clicar nos links de capítulo
    chapterNav.addEventListener('click', (e) => {
        if (e.target.classList.contains('chapter-link')) {
            e.preventDefault();
            const chapterNumber = e.target.dataset.chapter;
            displayChapter(chapterNumber);
        }
    });

    // Evento para clicar nos versículos (usando delegação de evento)
    contentArea.addEventListener('click', (e) => {
        const verseEl = e.target.closest('.verse');
        if (verseEl) {
            e.preventDefault();
            const { chapterNum, verseNum } = verseEl.dataset;
            displayVerseAnalysisView(chapterNum, verseNum);
        }
    });
    
    // Evento para clicar nos botões de palavra (usando delegação de evento)
    wordNav.addEventListener('click', (e) => {
        const wordBtn = e.target.closest('.word-btn');
        if (wordBtn) {
            e.preventDefault();
            const { chapterNum, verseNum, wordIndex } = wordBtn.dataset;
            displayWordAnalysis(chapterNum, verseNum, wordIndex);
        }
    });

    // -------------------------------------------------------------------
    // V. INICIALIZAÇÃO
    // -------------------------------------------------------------------
    
    // Opcional: Carregar o capítulo 1 por padrão
    // displayChapter('1');

});

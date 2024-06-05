// Function to load dictionary files
async function loadDictionary(lang) {
    let aff, dic;
    if (lang === "vi") {
        aff = await fetch("dict/vi/index.aff").then((response) =>
        response.text()
        );
        dic = await fetch("dict/vi/index.dic").then((response) =>
        response.text()
        );
    } else {
        aff = await fetch("dict/en/index.aff").then((response) =>
        response.text()
        );
        dic = await fetch("dict/en/index.dic").then((response) =>
        response.text()
        );
    }
    return new Typo(lang, aff, dic);
}

// Initialize spell check for both languages
async function initSpellChecker() {
const viDictionary = await loadDictionary("vi");
const enDictionary = await loadDictionary("en");
const textarea = document.getElementById("main-textarea");
const highlightedDiv = document.getElementById("highlighted-text");

textarea.addEventListener("input", () => {
    const text = textarea.value;
    const words = text.split(/\s+/);
    const misspelledWords = new Set();

    words.forEach((word) => {
    if (!viDictionary.check(word) && !enDictionary.check(word)) {
        misspelledWords.add(word);
    }
    });

    console.log("Misspelled words: ", misspelledWords);
    highlightMisspelledWords(text, Array.from(misspelledWords));
});
}

function highlightMisspelledWords(text, misspelledWords) {
const highlightedText = text
    .split(/\s+/)
    .map((word) => {
    return misspelledWords.includes(word)
        ? `<span class="misspelled">${word}</span>`
        : word;
    })
    .join(" ");

const highlightedDiv = document.getElementById("highlighted-text");
highlightedDiv.innerHTML = highlightedText;
}

window.onload = initSpellChecker;
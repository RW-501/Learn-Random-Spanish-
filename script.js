let currentSentence = {};
const audioPlayer = document.getElementById('audioPlayer');
let sentences = {}; // To hold the loaded data

// Load sentences data from the JSON file
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        sentences = data; // Store the JSON data in the sentences variable
    })
    .catch(error => {
        console.error("Error loading data.json:", error);
    });

document.getElementById('nextSentenceButton').addEventListener('click', function () {
    loadRandomSentence();
});

function loadRandomSentence() {
    const category = document.getElementById('categorySelect').value;
    const difficulty = document.getElementById('difficultySelect').value;

    // Check if the data is loaded before proceeding
    if (!sentences[category]) {
        alert("No sentences available for this category and difficulty.");
        return;
    }

    const filteredSentences = sentences[category].filter(sentence => sentence.difficulty === difficulty);

    if (filteredSentences.length === 0) {
        alert("No sentences available for this category and difficulty.");
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredSentences.length);
    currentSentence = filteredSentences[randomIndex];

    const mixedSentence = randomizeSpanishWords(currentSentence.english, currentSentence.mappings);
    document.getElementById('mixedSentence').textContent = mixedSentence;

    readSentence(currentSentence.english, currentSentence.spanish); // Pass both sentences
}

function randomizeSpanishWords(english, mappings) {
    let mixedSentence = english;
    let replaceProbability = 0.5; // 50% chance to replace each phrase

    for (let [englishPhrase, spanishPhrase] of Object.entries(mappings)) {
        if (Math.random() < replaceProbability) {
            let regex = new RegExp("\\b" + englishPhrase + "\\b", "gi");
            mixedSentence = mixedSentence.replace(regex, spanishPhrase);
        }
    }

    return mixedSentence;
}

function readSentence(english, spanish) {
    const utteranceEnglish = new SpeechSynthesisUtterance(english);
    utteranceEnglish.lang = 'en-US'; // Set language to English
    speechSynthesis.speak(utteranceEnglish);

    // Create a small delay before speaking the Spanish translation
    utteranceEnglish.onend = function() {
        const utteranceSpanish = new SpeechSynthesisUtterance(spanish);
        utteranceSpanish.lang = 'es-ES'; // Set language to Spanish
        speechSynthesis.speak(utteranceSpanish);
    };
}

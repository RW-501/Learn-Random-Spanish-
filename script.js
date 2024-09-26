let currentSentence = {};
const audioPlayer = document.getElementById('audioPlayer');

document.getElementById('nextSentenceButton').addEventListener('click', function() {
    loadRandomSentence();
});

function loadRandomSentence() {
    const category = document.getElementById('categorySelect').value;
    const difficulty = document.getElementById('difficultySelect').value;
    
    const filteredSentences = sentences[category].filter(sentence => sentence.difficulty === difficulty);
    
    if (filteredSentences.length === 0) {
        alert("No sentences available for this category and difficulty.");
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredSentences.length);
    currentSentence = filteredSentences[randomIndex];

    const mixedSentence = randomizeSpanishWords(currentSentence.english, currentSentence.mappings);
    document.getElementById('mixedSentence').textContent = mixedSentence;

    readSentence(mixedSentence);
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

function readSentence(sentence) {
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = 'en-US'; // Set language to English
    speechSynthesis.speak(utterance);
}

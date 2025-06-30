
// Piano setup
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const intervals = [
    { name: 'Unison', semitones: 0 },
    { name: 'Minor 2nd', semitones: 1 },
    { name: 'Major 2nd', semitones: 2 },
    { name: 'Minor 3rd', semitones: 3 },
    { name: 'Major 3rd', semitones: 4 },
    { name: 'Perfect 4th', semitones: 5 },
    { name: 'Tritone', semitones: 6 },
    { name: 'Perfect 5th', semitones: 7 },
    { name: 'Minor 6th', semitones: 8 },
    { name: 'Major 6th', semitones: 9 },
    { name: 'Minor 7th', semitones: 10 },
    { name: 'Major 7th', semitones: 11 },
    { name: 'Octave', semitones: 12 }
];

let currentInterval = null;
let score = 0;
let total = 0;
let audioContext = null;

// Initialize audio context
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Generate interval options
function generateIntervalOptions() {
    const container = document.getElementById('intervalOptions');
    container.innerHTML = '';

    intervals.forEach(interval => {
        const btn = document.createElement('button');
        btn.className = 'interval-btn';
        btn.textContent = interval.name;
        btn.onclick = () => checkAnswer(interval.semitones, btn);
        container.appendChild(btn);
    });
}

// Play a note
function playNote(frequency, duration = 0.75) {
    initAudio();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
}

// Convert note to frequency
function noteToFrequency(noteIndex) {
    // A4 = 440Hz is at index 9 in the 4th octave
    const A4 = 440;
    const A4_INDEX = 9 + 12 * 4; // A4 is at the 57th semitone from C0
    const semitoneFromA4 = (noteIndex + 12 * 4) - A4_INDEX;
    return A4 * Math.pow(2, semitoneFromA4 / 12);
}


function hideStartButton() {
    const startButton = document.getElementById('start-button');
    if (startButton) {
        startButton.style.display = 'none';
    }
}

function showPlayAgainButton() {
    const playAgainButton = document.getElementById('play-again');
    if (playAgainButton) {
        playAgainButton.style.display = 'inline-block';
    }
}

// Generate new interval
function generateNewInterval() {
    showShowNotesButton(); // Show the "Show Notes" button when generating a new interval  
    hideNotesDisplay(); // Hide notes display when generating a new interval
    hideStartButton(); // Hide the start button after generating the first interval
    showPlayAgainButton(); // Show the "Play Again" button
    const startNote = Math.floor(Math.random() * 12);
    const intervalSemitones = Math.floor(Math.random() * 13); // 0-12 semitones
    const endNote = (startNote + intervalSemitones) % 12;

    currentInterval = {
        startNote,
        endNote,
        semitones: intervalSemitones,
        startNoteName: notes[startNote],
        endNoteName: notes[endNote]
    };

    document.getElementById('notesDisplay').textContent =
        `${currentInterval.startNoteName} → ${currentInterval.endNoteName}`;
    document.getElementById('feedback').textContent = '';

    // Reset button colors
    document.querySelectorAll('.interval-btn').forEach(btn => {
        btn.className = 'interval-btn';
    });

    // Highlight keys and play interval
    // highlightKeys();
    playInterval();
}

// Play current interval
function playInterval() {
    if (!currentInterval) return;

    // Disable the "Play Again" button to prevent multiple clicks
    const playAgainButton = document.getElementById('play-again');
    if (playAgainButton) {
        playAgainButton.disabled = true;
    }

    initAudio();
    const startFreq = noteToFrequency(currentInterval.startNote);
    const endFreq = noteToFrequency(currentInterval.endNote);

    playNote(startFreq, 0.8);
    setTimeout(() => playNote(endFreq, 0.8), 900);

    // Enable the "Play Again" button after the interval is played
    setTimeout(() => {
        if (playAgainButton) {
            playAgainButton.disabled = false;
        }
    }, 1800);

    // Enable button clicking after playing the interval
    document.querySelectorAll('.interval-btn').forEach(btn => {
        btn.disabled = false; // Re-enable buttons for the next interval
    }
    );

}

// Check answer
function checkAnswer(selectedSemitones, button) {
    if (!currentInterval) return;

    total++;
    const isCorrect = selectedSemitones === currentInterval.semitones;

    // On user guess, disable all buttons to prevent further clicks
    document.querySelectorAll('.interval-btn').forEach(btn => {
        btn.disabled = true;
    });

    let restartDelay = 1000; // Default delay for generating a new interval

    if (isCorrect) {
        score++;
        button.classList.add('correct');
        document.getElementById('feedback').textContent = '✓ Correct!';
        document.getElementById('feedback').style.color = '#4caf50';
    } else {
        restartDelay = 2500; // Longer delay for incorrect answers
        button.classList.add('incorrect');
        const correctInterval = intervals.find(i => i.semitones === currentInterval.semitones);
        document.getElementById('feedback').textContent = `✗ Incorrect. The correct answer is ${correctInterval.name}`;
        document.getElementById('feedback').style.color = '#f44336';

        // Highlight correct answer
        document.querySelectorAll('.interval-btn').forEach(btn => {
            if (btn.textContent === correctInterval.name) {
                btn.classList.add('correct');
            }
        });
    }

    document.getElementById('score').textContent = score;
    document.getElementById('total').textContent = total;

    // Generate new interval after a delay.
    setTimeout(() => {
        // Disable button clicking during the interval generation
        document.querySelectorAll('.interval-btn').forEach(btn => {
            btn.disabled = true; // Disable all buttons to prevent further clicks
        });

        generateNewInterval();
        document.querySelectorAll('.interval-btn').forEach(btn => {
            btn.disabled = false; // Re-enable buttons for the next interval
        });
    }, restartDelay);
};

// Toggle notes display
function toggleNotes() {
    const notesDisplay = document.getElementById('notesDisplay');
    if (notesDisplay.style.display === 'none' || notesDisplay.style.display === '') {
        notesDisplay.style.display = 'block';
        notesDisplay.textContent = `${currentInterval.startNoteName} → ${currentInterval.endNoteName}`;
    } else {
        notesDisplay.style.display = 'none';
    }
}

// Hide nodes display
function hideNotesDisplay() {
    const notesDisplay = document.getElementById('notesDisplay');
    if (notesDisplay) {
        notesDisplay.style.display = 'none';
    }
}

// Hide notes button
function hideShowNotesButton() {
    const showNotesButton = document.getElementById('show-notes-btn');
    if (showNotesButton) {
        showNotesButton.style.display = 'none';
    }
}

// Show notes button
function showShowNotesButton() {
    const showNotesButton = document.getElementById('show-notes-btn');
    if (showNotesButton) {
        showNotesButton.style.display = 'inline-block';
    }
}

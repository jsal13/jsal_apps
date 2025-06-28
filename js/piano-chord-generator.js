// Comprehensive chord database
const chords = [
    // Major chords
    { name: 'C', notes: 'C - E - G', type: 'Major Triad' },
    { name: 'D', notes: 'D - F# - A', type: 'Major Triad' },
    { name: 'E', notes: 'E - G# - B', type: 'Major Triad' },
    { name: 'F', notes: 'F - A - C', type: 'Major Triad' },
    { name: 'G', notes: 'G - B - D', type: 'Major Triad' },
    { name: 'A', notes: 'A - C# - E', type: 'Major Triad' },
    { name: 'B', notes: 'B - D# - F#', type: 'Major Triad' },

    // Minor chords
    { name: 'Cm', notes: 'C - Eb - G', type: 'Minor Triad' },
    { name: 'Dm', notes: 'D - F - A', type: 'Minor Triad' },
    { name: 'Em', notes: 'E - G - B', type: 'Minor Triad' },
    { name: 'Fm', notes: 'F - Ab - C', type: 'Minor Triad' },
    { name: 'Gm', notes: 'G - Bb - D', type: 'Minor Triad' },
    { name: 'Am', notes: 'A - C - E', type: 'Minor Triad' },
    { name: 'Bm', notes: 'B - D - F#', type: 'Minor Triad' },

    // Seventh chords
    { name: 'Cmaj7', notes: 'C - E - G - B', type: 'Major 7th' },
    { name: 'Dmaj7', notes: 'D - F# - A - C#', type: 'Major 7th' },
    { name: 'Emaj7', notes: 'E - G# - B - D#', type: 'Major 7th' },
    { name: 'Fmaj7', notes: 'F - A - C - E', type: 'Major 7th' },
    { name: 'Gmaj7', notes: 'G - B - D - F#', type: 'Major 7th' },
    { name: 'Amaj7', notes: 'A - C# - E - G#', type: 'Major 7th' },
    { name: 'Bmaj7', notes: 'B - D# - F# - A#', type: 'Major 7th' },

    // Minor 7th chords
    { name: 'Cm7', notes: 'C - Eb - G - Bb', type: 'Minor 7th' },
    { name: 'Dm7', notes: 'D - F - A - C', type: 'Minor 7th' },
    { name: 'Em7', notes: 'E - G - B - D', type: 'Minor 7th' },
    { name: 'Fm7', notes: 'F - Ab - C - Eb', type: 'Minor 7th' },
    { name: 'Gm7', notes: 'G - Bb - D - F', type: 'Minor 7th' },
    { name: 'Am7', notes: 'A - C - E - G', type: 'Minor 7th' },
    { name: 'Bm7', notes: 'B - D - F# - A', type: 'Minor 7th' },

    // Dominant 7th chords
    { name: 'C7', notes: 'C - E - G - Bb', type: 'Dominant 7th' },
    { name: 'D7', notes: 'D - F# - A - C', type: 'Dominant 7th' },
    { name: 'E7', notes: 'E - G# - B - D', type: 'Dominant 7th' },
    { name: 'F7', notes: 'F - A - C - Eb', type: 'Dominant 7th' },
    { name: 'G7', notes: 'G - B - D - F', type: 'Dominant 7th' },
    { name: 'A7', notes: 'A - C# - E - G', type: 'Dominant 7th' },
    { name: 'B7', notes: 'B - D# - F# - A', type: 'Dominant 7th' },

    // Diminished chords
    { name: 'Cdim', notes: 'C - Eb - Gb', type: 'Diminished Triad' },
    { name: 'Ddim', notes: 'D - F - Ab', type: 'Diminished Triad' },
    { name: 'Edim', notes: 'E - G - Bb', type: 'Diminished Triad' },
    { name: 'Fdim', notes: 'F - Ab - B', type: 'Diminished Triad' },
    { name: 'Gdim', notes: 'G - Bb - Db', type: 'Diminished Triad' },
    { name: 'Adim', notes: 'A - C - Eb', type: 'Diminished Triad' },
    { name: 'Bdim', notes: 'B - D - F', type: 'Diminished Triad' },

    // Augmented chords
    { name: 'Caug', notes: 'C - E - G#', type: 'Augmented Triad' },
    { name: 'Daug', notes: 'D - F# - A#', type: 'Augmented Triad' },
    { name: 'Eaug', notes: 'E - G# - C', type: 'Augmented Triad' },
    { name: 'Faug', notes: 'F - A - C#', type: 'Augmented Triad' },
    { name: 'Gaug', notes: 'G - B - D#', type: 'Augmented Triad' },
    { name: 'Aaug', notes: 'A - C# - F', type: 'Augmented Triad' },
    { name: 'Baug', notes: 'B - D# - G', type: 'Augmented Triad' },
];

let currentChordIndex = 0;
let autoplayInterval;
let progressInterval;
let isAutoplayActive = true;
let timeRemaining = 20;

function generateRandomChord() {
    const randomIndex = Math.floor(Math.random() * chords.length);
    const chord = chords[randomIndex];
    currentChordIndex = randomIndex;

    displayChord(chord);
    resetTimer();
}

function displayChord(chord) {
    document.getElementById('chordName').textContent = chord.name;
    document.getElementById('chordNotes').textContent = chord.notes;
    document.getElementById('chordType').textContent = chord.type;

    // Add animation effect
    const display = document.getElementById('chordDisplay');
    display.style.transform = 'scale(0.95)';
    setTimeout(() => {
        display.style.transform = 'scale(1)';
    }, 100);
}

function toggleAutoplay() {
    const btn = document.getElementById('autoplayBtn');

    if (isAutoplayActive) {
        clearInterval(autoplayInterval);
        clearInterval(progressInterval);
        isAutoplayActive = false;
        btn.textContent = 'Resume Auto';
        document.getElementById('timer').textContent = 'Auto-play paused';
        document.getElementById('progressFill').style.width = '0%';
    } else {
        startAutoplay();
        isAutoplayActive = true;
        btn.textContent = 'Pause Auto';
        resetTimer();
    }
}

function startAutoplay() {
    autoplayInterval = setInterval(() => {
        generateRandomChord();
    }, 20000);
}

function resetTimer() {
    timeRemaining = 20;
    updateTimerDisplay();

    clearInterval(progressInterval);
    progressInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 0) {
            timeRemaining = 20;
        }
    }, 1000);
}

function updateTimerDisplay() {
    if (isAutoplayActive) {
        document.getElementById('timer').textContent = `Next chord in: ${timeRemaining}s`;
        const progressPercent = ((20 - timeRemaining) / 20) * 100;
        document.getElementById('progressFill').style.width = progressPercent + '%';
    }
}

// Initialize the page
function init() {
    generateRandomChord();
    startAutoplay();
}

// Start when page loads
window.addEventListener('load', init);
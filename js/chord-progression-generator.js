const keys = [
    'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F',
    'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'
];

const progressions = {
    'I-V-vi-IV': {
        name: 'Pop Progression (I-V-vi-IV)',
        major: ['', '5', 'm6', '4'],
        minor: ['m', '5', 'm6', '4']
    },
    'vi-IV-I-V': {
        name: 'Pop Alternative (vi-IV-I-V)',
        major: ['m6', '4', '', '5'],
        minor: ['m6', '4', 'm', '5']
    },
    'ii-V-I': {
        name: 'Jazz Standard (ii-V-I)',
        major: ['m2', '5', ''],
        minor: ['m2b5', '5', 'm']
    },
    'I-vi-ii-V': {
        name: '50s Progression (I-vi-ii-V)',
        major: ['', 'm6', 'm2', '5'],
        minor: ['m', 'm6', 'm2b5', '5']
    },
    'I-IV-V-I': {
        name: 'Classic Blues (I-IV-V-I)',
        major: ['', '4', '5', ''],
        minor: ['m', '4', '5', 'm']
    },
    'vi-ii-V-I': {
        name: 'Circle Progression (vi-ii-V-I)',
        major: ['m6', 'm2', '5', ''],
        minor: ['m6', 'm2b5', '5', 'm']
    },
    'I-bVII-IV-I': {
        name: 'Mixolydian (I-bVII-IV-I)',
        major: ['', 'b7', '4', ''],
        minor: ['m', 'b7', '4', 'm']
    },
    'i-bVI-bVII-i': {
        name: 'Minor Pop (i-bVI-bVII-i)',
        major: ['m', 'b6', 'b7', 'm'],
        minor: ['m', 'b6', 'b7', 'm']
    },
    'i-iv-V-i': {
        name: 'Natural Minor (i-iv-V-i)',
        major: ['m', 'm4', '5', 'm'],
        minor: ['m', 'm4', '5', 'm']
    },
    'I-iii-vi-IV': {
        name: 'Descending (I-iii-vi-IV)',
        major: ['', 'm3', 'm6', '4'],
        minor: ['m', '3', 'm6', '4']
    }
};

const noteIntervals = {
    '': 0, 'm': 0, '2': 2, 'm2': 2, 'm2b5': 2, '3': 4, 'm3': 4,
    '4': 5, 'm4': 5, '5': 7, 'm6': 9, '6': 9, 'b6': 8,
    'b7': 10, '7': 11
};

function getChordFromInterval(rootKey, interval, suffix) {
    const rootIndex = keys.indexOf(rootKey);
    const semitones = noteIntervals[interval] || 0;
    let targetIndex = (rootIndex + semitones) % 12;

    // Handle enharmonic equivalents for cleaner display
    let targetNote = keys[targetIndex];

    // Prefer sharps or flats based on key context
    if (targetNote.includes('#') || targetNote.includes('b')) {
        const sharpIndex = keys.findIndex(k => k === targetNote && k.includes('#'));
        const flatIndex = keys.findIndex(k => k === targetNote && k.includes('b'));

        if (sharpIndex !== -1 && flatIndex !== -1) {
            // Choose based on the root key's preference
            if (rootKey.includes('b') || ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'].includes(rootKey)) {
                targetNote = keys[flatIndex];
            } else {
                targetNote = keys[sharpIndex];
            }
        }
    }

    return targetNote + suffix;
}

function generateProgression() {
    const select = document.getElementById('progressionSelect');
    const selectedProgression = select.value;

    // Generate random key
    const randomKey = keys[Math.floor(Math.random() * keys.length)];

    // Randomly choose between major and minor interpretation
    const isMajor = Math.random() > 0.3; // Bias toward major
    const progression = progressions[selectedProgression];
    const intervals = isMajor ? progression.major : progression.minor;

    // Generate chords
    const chords = intervals.map(interval => {
        const baseSuffix = interval.replace(/[0-9b]/g, '');
        return getChordFromInterval(randomKey, interval, baseSuffix);
    });

    // Display results
    const result = document.getElementById('result');
    const keyDisplay = document.getElementById('keyDisplay');
    const chordDisplay = document.getElementById('chordDisplay');
    const progressionName = document.getElementById('progressionName');

    keyDisplay.textContent = `Key: ${randomKey} ${isMajor ? 'Major' : 'Minor'}`;
    chordDisplay.textContent = chords.join(' - ');
    progressionName.textContent = progression.name;

    result.classList.add('show');

    // Add some animation
    setTimeout(() => {
        chordDisplay.style.transform = 'scale(1.05)';
        setTimeout(() => {
            chordDisplay.style.transform = 'scale(1)';
        }, 200);
    }, 100);
}

// Add some interactivity
document.getElementById('progressionSelect').addEventListener('change', function () {
    const result = document.getElementById('result');
    result.classList.remove('show');
});

// If a new option is selected, run the progression generator again.
document.getElementById('progressionSelect').addEventListener('change', generateProgression);

// Loads an initial progression.
generateProgression();

const natureActivities = [
    "A tree growing without human help",
    "A Bird's Nest",
    "Dandelion growing through concrete",
    "Bird drinking from a puddle",
    "Leaf with an interesting insect bite pattern",
    "An ant carrying something larger than itself",
    "Hear birdsong",
    "Feather on the ground",
    "Squirrel burying a nut",
    "Moss growing on a building",
    "Bee visiting a flower in a park",
    "Spider web",
    "Spider",
    "Large Spider",
    "Spider on web",
    "Tree with a hole in it",
    "Tree with a nest in it",
    "Tree with a bird in it",
    "Smooth, round stone",
    "Butterfly",
    "Wildflower growing in an unexpected place",
    "Pigeon pecking at the ground",
    "Ladybug",
    "Seed pod",
    "Group of birds flying together",
    "Animal Tracks",
    "Squirrel climbing a tree",
    "Bird in a Nest",
    "Water or Dew on a Leaf",
    "Water or Dew on a Flower",
    "Worm on the sidewalk after rain",
    "Twig that looks like a letter",
    "Bee collecting pollen",
    "Leaf with interesting veins",
    "Snail leaving a trail",
    "Ivy",
    "Small puddle reflecting the sky",
    "Bird perched on a wire",
    "Insect camouflaged on a plant",
    "Stone with different colors in it",
    "Spot a bird taking a bath in a puddle or fountain",
    "The smell of blooming flowers or fresh-cut grass",
    "Listen to bird songs for 5 minutes",
    "Identify 3 different tree species",
    "Watch clouds for 10 minutes",
    "Skip stones on water"
]

let currentBoard = [];
let completedCells = [];

function getCurrentDateString() {
    const today = new Date();
    return today.toDateString();
}

function seedRandom(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

function generateDailyBoard() {
    const today = new Date();
    const dateString = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const seed = dateString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    const shuffledActivities = [...natureActivities];

    // Shuffle using seeded random
    for (let i = shuffledActivities.length - 1; i > 0; i--) {
        const j = Math.floor(seedRandom(seed + i) * (i + 1));
        [shuffledActivities[i], shuffledActivities[j]] = [shuffledActivities[j], shuffledActivities[i]];
    }

    return shuffledActivities.slice(0, 24);
}

function createBoard() {
    currentBoard = generateDailyBoard();
    const board = document.getElementById('bingoBoard');
    board.innerHTML = '';

    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.className = 'bingo-cell';
        cell.setAttribute('data-index', i);

        if (i === 12) { // Center cell (free space)
            cell.textContent = 'FREE SPACE 🌿';
            cell.classList.add('free-space', 'completed');
        } else {
            const activityIndex = i < 12 ? i : i - 1;
            cell.textContent = currentBoard[activityIndex];
        }

        cell.addEventListener('click', () => toggleCell(i));
        board.appendChild(cell);
    }

    loadProgress();
    updateProgress();
}

function toggleCell(index) {
    if (index === 12) return; // Don't toggle free space

    const cell = document.querySelector(`[data-index="${index}"]`);
    const isCompleted = completedCells.includes(index);

    if (isCompleted) {
        completedCells = completedCells.filter(i => i !== index);
        cell.classList.remove('completed');
    } else {
        completedCells.push(index);
        cell.classList.add('completed');
    }

    saveProgress();
    updateProgress();
}

function updateProgress() {
    const completed = completedCells.length;
    const total = 24; // 25 - 1 free space
    document.getElementById('progressText').textContent = `Progress: ${completed}/${total} completed`;
}

function saveProgress() {
    const today = getCurrentDateString();
    const progressData = {
        date: today,
        completed: completedCells,
        board: currentBoard
    };
    // Store in memory for this session only
    window.currentProgress = progressData;
}

function loadProgress() {
    const today = getCurrentDateString();
    const saved = window.currentProgress;

    if (saved && saved.date === today) {
        completedCells = saved.completed || [];

        // Apply completed state to cells
        completedCells.forEach(index => {
            const cell = document.querySelector(`[data-index="${index}"]`);
            if (cell) cell.classList.add('completed');
        });
    } else {
        completedCells = [];
    }
}

function resetBoard() {
    completedCells = [];
    const cells = document.querySelectorAll('.bingo-cell:not(.free-space)');
    cells.forEach(cell => cell.classList.remove('completed'));
    saveProgress();
    updateProgress();
}

function generateNewBoard() {
    // This creates a completely new random board (not daily-seeded)
    const shuffled = [...natureActivities].sort(() => Math.random() - 0.5);
    currentBoard = shuffled.slice(0, 24);
    completedCells = [];
    createBoard();
}

// Initialize the page
document.getElementById('currentDate').textContent = getCurrentDateString();
createBoard();
let playerName;
let totalAttempts;
let attempts;
let mineIndices = [];
let treasureIndex;
const wisdomTexts = [
    "A smile is a free way to brighten someone's day.",
    "You are perfect because of your imperfections.",
    "Your story is unique. It can only be forged by you."
];
const loseTexts = [
    "Complaining will not get anything done.",
    "Failure is simply the opportunity to begin again.",
    "The only way to achieve the impossible is to believe it is possible."
];

// بدء اللعبة
document.getElementById('startGame').onclick = function() {
    playerName = document.getElementById('playerName').value;
    const level = document.getElementById('level').value;
    totalAttempts = level === 'easy' ? 10 : 20;
    initGame();
};

// تهيئة اللعبة
function initGame() {
    const level = localStorage.getItem('level');
    totalAttempts = level === 'easy' ? 10 : 20;
    attempts = totalAttempts;
    document.getElementById('remainingAttempts').innerText = attempts;
    document.getElementById('gameBoard').innerHTML = '';
    mineIndices = getRandomIndices(level === 'easy' ? 10 : 20);
    treasureIndex = Math.floor(Math.random() * 64);

    // إنشاء الأزرار للعبة
    for (let i = 0; i < 64; i++) {
        const button = document.createElement('button');
        button.setAttribute('data-index', i);
        button.onclick = handleButtonClick;
        document.getElementById('gameBoard').appendChild(button);
    }

}

// تعيين مواقع القنابل عشوائيًا
function getRandomIndices(num) {
    const indices = new Set();
    while (indices.size < num) {
        indices.add(Math.floor(Math.random() * 64));
    }
    return Array.from(indices);
}

// حساب مسافة "مانهاتن" (للقرب من الكنز أو القنبلة)
function calculateManhattanDistance(index1, index2) {
    const x1 = index1 % 8, y1 = Math.floor(index1 / 8);
    const x2 = index2 % 8, y2 = Math.floor(index2 / 8);
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

// معالجة النقر على الزر
function handleButtonClick(event) {
    const clickSound = document.getElementById('clickSound');
    clickSound.play();
    clickSound.volume = 0.5;

    const index = parseInt(event.target.getAttribute('data-index'));
    const proximityThreshold = 2;

    if (mineIndices.includes(index)) {
        event.target.innerHTML = '<img src="assets/images/bomb.png" alt="Bomb" width="18" height="18">';
        document.getElementById('explosionSound').play();
        explosionSound.volume = 0.5;
        document.getElementById('gameMessage').innerText = 'You hit a mine!';
        endGame(false);
    } else if (index === treasureIndex) { 
        event.target.innerHTML = '<img src="assets/images/win.png" alt="win" width="18" height="18">';
        document.getElementById('treasureSound').play();
        treasureSound.volume = 0.5;
        document.getElementById('gameMessage').innerText = wisdomTexts[Math.floor(Math.random() * wisdomTexts.length)];
        endGame(true);
    } else {
        const closestMineDistance = Math.min(...mineIndices.map(mineIndex => calculateManhattanDistance(index, mineIndex)));
        const treasureDistance = calculateManhattanDistance(index, treasureIndex);

        if (closestMineDistance <= proximityThreshold) {
            document.getElementById('gameMessage').innerText = "Warning: You are close to a bomb!";
        } else if (treasureDistance <= proximityThreshold) {
            document.getElementById('gameMessage').innerText = "Hint: You're close to the treasure!";
        } else {
            document.getElementById('gameMessage').innerText = "Safe! Keep searching.";
        }

        event.target.disabled = true;
        attempts--;
        document.getElementById('remainingAttempts').innerText = attempts;
        
        if (attempts === 0) {
            endGame(false);
        }
    }
}

// إنهاء اللعبة وتعطيل جميع الأزرار
function endGame(win) {
    const buttons = document.querySelectorAll('#gameBoard button');
    buttons.forEach(button => {
        button.disabled = true;
    });
    const gameOverMusic = document.getElementById('gameOverMusic');
    const toggleMusicButton = document.getElementById('toggleMusic');
    const backgroundMusic = document.getElementById('backgroundMusic');
    toggleMusicButton.style.display = 'none';

    if (win) {
        document.getElementById('gameMessage').innerText = 'Congratulations! You found the treasure!';
        backgroundMusic.pause();
    } else if(loseTexts){
        document.getElementById('gameMessage').innerText = loseTexts[Math.floor(Math.random() * loseTexts.length)];
        gameOverMusic.play();
        backgroundMusic.pause();
    }
    else {
        gameOverMusic.puse();
        backgroundMusic.pause();
    }
}

// تهيئة اللعبة عند تحميل الصفحة
window.onload = initGame;

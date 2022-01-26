'use strict'
const ONE = '1️⃣';
const TWO = '2️⃣';
const THREE = '3️⃣';
const FOUR = '4️⃣';
const FIVE = '5️⃣';
const SIX = '6️⃣';
const EMPTY = '';
const HIDE = '⬛';
const MINE = '💣';

// block open window on click right
const noContext = document.querySelector('#noContextMenu');
noContext.addEventListener('contextmenu', e => {
    e.preventDefault();
});
var gNumbers = [EMPTY, ONE, TWO, THREE, FOUR, FIVE, SIX];

// const FOOD_AUDIO = new Audio('/sound/collect-sound.wav');
// const CHERRY_AUDIO = new Audio('/sound/cherry-sound.wav');
// const SUPER_FOOD_AUDIO = new Audio('/sound/superFood-sound.wav');
// const JUMP_AUDIO = new Audio('/sound/jump-sound.wav');
// openCell({i:1,j:1})

var gBoard;
var gLevel;
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


function init() {
    // console.log('Hello')
    // gGame = {
    //     isOn: false,
    //     shownCount: 0,
    //     markedCount: 0,
    //     secsPassed: 0
    // }

    //     gameSize();
    //     gBoard = createMat(gLevel.SIZE);

    //     gBoard[0][0].isMine = true;
    //     gBoard[0][0].isShown = false;
    //     gBoard[1][1].isMine = true;
    //     gBoard[1][1].isShown = false;

    //     renderBoard(gBoard, '.board-container');
}



function gameSize(size = 4) {
    var minesNum;
    if (size === 4) minesNum = 2;
    else if (size === 8) minesNum = 12;
    else minesNum = 30;
    gLevel = {
        SIZE: size,
        MINES: minesNum
    };
    // console.log('gLevel', gLevel);
}

function startGame(size) {
    gameSize(size);
    gBoard = createMat(gLevel.SIZE);

    gBoard[0][0].isMine = true;
    gBoard[0][0].isShown = false;
    gBoard[1][1].isMine = true;
    gBoard[1][1].isShown = false;

    renderBoard(gBoard, '.board-container');
}

function gameOver(isVictory) {
    if (isVictory) {
        //smiling happy
    } else {
        //mark all red
    }
    var msg = 'Game over- you ';
    mgs += (isVictory) ? 'won' : 'lose';
    var num = (isVictory) ? 'won' : 'lose';
    console.log(num);
}






















// function updateScore(diff) {
//     // update model and dom
//     gGame.score += diff;
//     document.querySelector('h2 span').innerText = gGame.score;
// }

// function gameOver(isWin) {
//     gGame.isOn = false;
//     clearInterval(gIntervalGhosts);
//     clearInterval(gIntervalCherry);
//     // update the model
//     gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
//     // update the DOM
//     renderCell(gPacman.location, EMPTY)
//     endGame(isWin)
// }

// function endGame(isWin) {
//     if (isWin) gGame.score++;
//     var msg = isWin ? 'won!' : 'lose';
//     var elEndGame = document.querySelector('.end-game');
//     elEndGame.style.display = 'block';
//     var elGameOver = elEndGame.querySelector('span');
//     elGameOver.innerText = 'Game over - you ' + msg;
// }

// function isVictory() {
//     for (var i = 0; i < gBoard.length; i++) {
//         for (var j = 0; j < gBoard[0].length; j++) {
//             var cell = gBoard[i][j];
//             if (cell === FOOD) return false;
//         }
//     }
//     return true;
// }

// function addSuperFood() {
//     console.log(gBoard);
//     var location = { i: 1, j: 1 };
//     gBoard[location.i][location.j] = SUPER_FOOD;
//     //renderCell(location, SUPER_FOOD);

//     location = { i: gBoard.length - 2, j: 1 };
//     gBoard[location.i][location.j] = SUPER_FOOD;
//     //renderCell(location, SUPER_FOOD);

//     location = { i: 1, j: gBoard[0].length - 2 };
//     gBoard[location.i][location.j] = SUPER_FOOD;
//     //renderCell(location, SUPER_FOOD);

//     location = { i: gBoard.length - 2, j: gBoard[0].length - 2 };
//     gBoard[location.i][location.j] = SUPER_FOOD;
//     //renderCell(location, SUPER_FOOD);
// }
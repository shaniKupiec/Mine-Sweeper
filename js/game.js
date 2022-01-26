'use strict'
const ONE = '<img src="img/num1.png" />';
const TWO = '<img src="img/num2.png" />';
const THREE = '<img src="img/num3.png" />';
const FOUR = '<img src="img/num4.png" />';
const FIVE = '<img src="img/num5.png" />';
const SIX = '<img src="img/num6.png" />';
const EMPTY = '<img src="img/empty.png" />';
const HIDE = '<img src="img/cover.png" />';
const MINE = '💣';
const RED_MINE = '<img src="img/red-bomb.png" />';
const FLAG = '<img src="img/flag.png" />';

// block open window on click right
const noContext = document.querySelector('#noContextMenu');
noContext.addEventListener('contextmenu', e => {
    e.preventDefault();
});

var gBoard;
var gLevel;
var gGame;
var gFirstClick;
var gNumbers = [EMPTY, ONE, TWO, THREE, FOUR, FIVE, SIX];


function init() {
}

// after the user chose size
function startGame(size) {
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    gameSize(size);
    gBoard = createMat(gLevel.SIZE);
    buildBoard(gBoard, '.board-container');
    gFirstClick = true;
}

// set number of mines
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

// after the game is over
function gameOver(isWin, location) {
    if (isWin) {
        // add smiling face
    } else {
        // add sad face
        // open all closed mines, and make the one the user clicked on - red
        openMins();
        renderCell(location, RED_MINE);
    }
    var msg = 'Game over- you ';
    msg += (isWin) ? 'won' : 'lose';
    console.log(msg);
    gGame.isOn = false;
}

// check if there is a victoty
function isVictory() {
    return gGame.shownCount + gGame.markedCount === gLevel.SIZE ** 2;
}

// opens mins in case the user lose the game
function openMins() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            if (cell.isMine) {
                cell.isShown = true;
                renderCell(getLocation(i, j), MINE);
                gLevel.minesNum--;
            }
            if (gLevel.minesNum) return;
        }
    }
}

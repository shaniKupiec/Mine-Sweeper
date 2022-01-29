'use strict'
const ONE = '<img src="img/num1.png" />';
const TWO = '<img src="img/num2.png" />';
const THREE = '<img src="img/num3.png" />';
const FOUR = '<img src="img/num4.png" />';
const FIVE = '<img src="img/num5.png" />';
const SIX = '<img src="img/num6.png" />';
const SEVEN = '7️⃣';
const EIGHT = '8️⃣';

const EMPTY = '<img src="img/empty.png" />';
const HIDE = '<img src="img/cover.png" />';
const MINE = '<img src="img/black-bomb.png" />'
const RED_MINE = '<img src="img/red-bomb.png" />';
const VAGUE_MINE = '<img src="img/vague-bomb.png" />';
const FLAG = '<img src="img/flag.png" />';
const RED_FLAG = '<img src="img/red-flag.png" />';

const SMILE = '<img src="img/smile.png" />';
const SAD = '<img src="img/sad.png" />';
const SHOCK = '<img src="img/shock.png" />';
const SUNGLASSES = '<img src="img/sunglasses.png" />';

const LIFE = '❤️';
const HINT = '💡';
const SAFE = '🦺';

// block open window on click right
const noContext = document.querySelector('#noContextMenu');
noContext.addEventListener('contextmenu', e => {
    e.preventDefault();
});

var gBoard;
var gLevel;
var gGame;
var gWatchInterval;
var gStartTime;
var gCreatMines;
var gLocalStorageIsEmpty = true;
var gStack;
var gRecentLevel = 8; // for case the user starts the game with clicking on smiley
var gNumbers = [EMPTY, ONE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT];


function init() {
    render(SMILE, '.overGame span');
    render('00:00', '.timer');
    var elButtons = document.querySelector('.underGame');
    elButtons.style.display = 'none';

    gCreatMines = {
        inProcess: false,
        minesNum: 0
    };

    showBestTime();
}

// after the user chose size
function startGame(size) {
    if (size) gRecentLevel = size;
    else size = gRecentLevel; // in case the user clicked on smiley to start over
    gameSize(size);
    var lives = (size === 4) ? 1 : 3; // if there is a size 4, the user gets only 1 life, hints, and safe clicks
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        lives: lives,
        hints: lives,
        safeClicks: lives,
        firstClick: true,
        isHint: false
    }
    gBoard = createMat(gLevel.SIZE);
    buildBoard(gBoard, '.board-container');

    var elAddData = document.querySelector('.additional-data');
    elAddData.style.display = 'block'; // adds lives and hints symbols

    var elHintButton = document.querySelector('.hint-on');
    elHintButton.style.backgroundColor = 'rgb(69, 168, 69)'; //change hint button to green

    var elClickButton = document.querySelector('.safe-click-on');
    elClickButton.style.backgroundColor = 'rgb(69, 168, 69)'; //change safe click button to green

    var elUndoButton = document.querySelector('.undo-on');
    elUndoButton.style.backgroundColor = 'rgb(69, 168, 69)'; //change safe click button to green

    renderAdditional(LIFE, '.lives span', gGame.lives);
    renderAdditional(HINT, '.hints span', gGame.hints);
    renderAdditional(SAFE, '.safes span', gGame.safeClicks);
    endStopWatch();
    init();
    gStack = [];
}

// set number of mines
function gameSize(size = gRecentLevel) {
    var minesNum;
    if (size === 4) minesNum = 2;
    else if (size === 8) minesNum = 12;
    else minesNum = 30;
    gLevel = {
        SIZE: size,
        MINES: minesNum
    };
}

// after the game is over
function gameOver(isWin, location) {
    // open all closed mines, and make the one the user clicked on - red, and the wrong flags - red
    openMins();
    if (isWin) {
        render(SUNGLASSES, '.overGame span');
        storeBestTime();
    } else {
        render(SAD, '.overGame span');
        renderCell(location, RED_MINE);
    }
    endStopWatch();
    var msg = 'Game over- you ';
    msg += (isWin) ? 'won' : 'lose';
    console.log(msg);
    gGame.isOn = false;

    var elAddData = document.querySelector('.underGame');
    elAddData.style.display = 'none';
}

// check if there is a victoty
function isVictory() {
    return gGame.shownCount + gGame.markedCount === gLevel.SIZE ** 2 && gGame.markedCount === gLevel.MINES;
}

// opens mins in case the user lose the game
// does not open in case of marked with flag
// shows wrong flags mark
function openMins() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            if (cell.isMine && !cell.isShown) {
                if (!cell.isMarked) {
                    cell.isShown = true;
                    renderCell(getLocation(i, j), MINE);
                }
                gLevel.minesNum--;
            } else if (cell.isMarked) renderCell(getLocation(i, j), RED_FLAG);
            if (gLevel.minesNum) return;
        }
    }
}

function storeBestTime() {
    var now = Date.now();
    var gameDuration = ((now - gStartTime) / 1000).toFixed(3);
    var level = gLevel.SIZE;
    var bestTime = localStorage.getItem(level);
    if (!bestTime || gameDuration < bestTime) {
        if (!bestTime) {
            if (gLocalStorageIsEmpty) { // if it's the first win - show table
                var elFirstTR = document.querySelector(`[data-num="0"]`);
                elFirstTR.style.display = 'block';
                gLocalStorageIsEmpty = false;
            } // if it's the first win for level - show row
            var elTr = document.querySelector(`[data-num="${level}"]`)
            elTr.style.display = 'block';
        } else {
            localStorage.removeItem(level);
        }
        localStorage.setItem(level, gameDuration);
        var elTd = document.querySelector(`[data-num="${level}"] .bestTime`)
        elTd.innerText = gameDuration;
    }
}

function showBestTime() { // work on
    var isLocalStorageEmpty = true;
    for (var level = 4; level < 13; level++) {
        if (level % 4) continue;
        var bestTime = localStorage.getItem(level);
        if (bestTime) {
            var elTr = document.querySelector(`[data-num="${level}"]`)
            elTr.style.display = 'block';
            var elTd = document.querySelector(`[data-num="${level}"] .bestTime`)
            elTd.innerText = bestTime;
            isLocalStorageEmpty = false;
        }
    }
    if (!isLocalStorageEmpty) { // show table if there is a score in local storage
        var elFirstTR = document.querySelector(`[data-num="0"]`);
        elFirstTR.style.display = 'block';
        gLocalStorageIsEmpty = false;
    }
}

function manuallyCreate() {
    startGame();
    gCreatMines.inProcess = true;
}

function toggelMine(location, isAdd) {
    var cell = gBoard[location.i][location.j];
    cell.isMine = isAdd;
    var value = isAdd ? MINE : HIDE;
    renderCell(location, value);

    var elButton = document.querySelector('.top .play');
    if (isAdd) {
        gCreatMines.minesNum++;
        if (gCreatMines.minesNum) elButton.style.display = 'block'; //adds play button
    } else {
        gCreatMines.minesNum--;
        if (!gCreatMines.minesNum) elButton.style.display = 'none'; //removes play button
    }
}

function play(isRegular, location) { // first click or start to play after manually positioned
    if (isRegular) {
        setMines(location);
    }
    else {
        gCreatMines.inProcess = false;
        gLevel.MINES = gCreatMines.minesNum;
    }
    gGame.firstClick = false;
    renderBoard();
    startStopWatch();
    var elAddData = document.querySelector('.underGame');
    elAddData.style.display = 'block'; // show buttons: hints, safe clicks
}

function undo() {
    if (!gStack.length) return;
    var lastTurn = gStack.pop();
    var location = Object.values(lastTurn)[0];
    switch (Object.keys(lastTurn)[0]) {
        case 'addFlag': // remove flag
            var cell = gBoard[location.i][location.j];
            renderCell(location, HIDE);
            gGame.markedCount--;
            cell.isMarked = false;
            break;
        case 'removeFlag': // add flag
            var cell = gBoard[location.i][location.j];
            renderCell(location, FLAG);
            gGame.markedCount++;
            cell.isMarked = true;
            break;
        case 'openCell': // hide cell
            closeCell(location);
            break;
        case 'openCells': // hind all cells
            for (let i = 0; i < location.length; i++) {
                closeCell(location[i]);
            }
            break;
        case 'openMine': // close a mine
            closeCell(location);
            gLevel.MINES++;
            break;
    }
    if (!gStack.length) {
        var elUndoButton = document.querySelector('.undo-on');
        elUndoButton.style.backgroundColor = 'red'; // telling the user that the button does not work anymore
    }
}

function closeCell(location) {
    var cell = gBoard[location.i][location.j];
    renderCell(location, HIDE);
    cell.isShown = false;
    gGame.shownCount--;
}
'use strict'
const ONE = '<img src="img/num1.png" />';
const TWO = '<img src="img/num2.png" />';
const THREE = '<img src="img/num3.png" />';
const FOUR = '<img src="img/num4.png" />';
const FIVE = '<img src="img/num5.png" />';
const SIX = '<img src="img/num6.png" />';

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
var gFirstWin = true;
var gRecentLevel = 8; // for case the user starts the game with clicking on smiley
var gNumbers = [EMPTY, ONE, TWO, THREE, FOUR, FIVE, SIX];


function init() {
    render(SMILE, '.overGame span');
    render('00:00', '.time');
    var addData = document.querySelector('.underGame');
    addData.style.display = 'none';
}

// after the user chose size
function startGame(size) {
    var lives = (size === 4) ? 1 : 3; // if there is a size 4, the user gets only 1 life
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        lives: lives,
        hints: 3,
        firstClick: true,
        isHint: false
    }
    if (size) gRecentLevel = size; // in case the user clicked on smiley to start over
    gameSize(size);
    gBoard = createMat(gLevel.SIZE);
    buildBoard(gBoard, '.board-container');

    var addData = document.querySelector('.additional-data');
    addData.style.display = 'block'; // adds lives and hints symbols

    var addData = document.querySelector('.underGame');
    addData.style.display = 'none'; // hide the hints button

    renderAdditional(LIFE, '.lives span', gGame.lives);
    renderAdditional(HINT, '.hints span', gGame.hints);
    endStopWatch();
    init();
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
function gameOver(isWin, location = getLocation(0, 0)) {
    // open all closed mines, and make the one the user clicked on - red, and the wrong flags - red
    openMins();
    if (isWin) {
        render(SUNGLASSES, '.overGame span');
        setLocalStorge();
    } else {
        render(SAD, '.overGame span');
        renderCell(location, RED_MINE);
    }
    endStopWatch();
    var msg = 'Game over- you ';
    msg += (isWin) ? 'won' : 'lose';
    console.log(msg);
    gGame.isOn = false;

    var addData = document.querySelector('.underGame');
    addData.style.display = 'none';
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

function setLocalStorge() {
    var now = Date.now();
    var time = ((now - gStartTime) / 1000).toFixed(3);
    var level = gLevel.SIZE;
    var lastTime = localStorage.getItem(level);
    console.log('time', time);
    console.log('lastTime', lastTime);
    if (!lastTime || time < lastTime) {
        if (!lastTime) {
            if (gFirstWin) { // if it's the first win - show table
                var elFirstTR = document.querySelector(`[data-num="0"]`);
                elFirstTR.style.display = 'block';
                gFirstWin = false;
            } // if it's the first win for level - show row
            var elTr = document.querySelector(`[data-num="${level}"]`)
            elTr.style.display = 'block';
        } else{
            localStorage.removeItem(level);
            localStorage.setItem(level, time);
        }
        var elTd = document.querySelector(`[data-num="${level}"] .fastTime`)
        elTd.innerText = time;
    }
}
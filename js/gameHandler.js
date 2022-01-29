'use strict'

function createCell() {
    return {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    }
}

function buildBoard(mat, selector) {
    var strHTML = '<table border="0" class="game"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var className = `cell cell-${i}-${j}`;
            strHTML += `<td class="${className}" onmousedown="cellClicked(event)">${HIDE}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}

// add mines in random places
function setMines(location) {
    // turning the mat to one array so we can draw random cell.
    // we also remove the first clicked cell from the array - so the first click wont be a mine
    var cells = matToArray();
    var indexL = location.i * gBoard[0].length + location.j;
    cells.splice(indexL, 1);
    for (var i = 0; i < gLevel.MINES; i++) {
        var cell = drawNum(cells);
        cell.isMine = true;
    }
}

function renderBoard() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            setMinesNegsCount(getLocation(i, j));
            renderCell(getLocation(i, j), HIDE);
        }
    }
}

// count number of mines neighbors
function setMinesNegsCount(location) {
    var count = 0
    var rowIdx = location.i;
    var colIdx = location.j;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var currCell = gBoard[i][j];
            if (currCell.isMine) count++
        }
    }
    gBoard[rowIdx][colIdx].minesAroundCount = count;
}

function cellClicked(event) {
    if (typeof event !== 'object') return;
    var className = event.currentTarget.className;
    var location = getLocationFromClass(className);
    switch (event.button) {
        case 0:
            openCell(location);
            break;
        case 2:
            setFlag(location);
            break;
    }
    if (gStack.length === 1) {
        var elUndoButton = document.querySelector('.undo-on');
        elUndoButton.style.backgroundColor = 'rgb(69, 168, 69)'; //change safe click button to green
    }
}

function openCell(location) {
    var cell = gBoard[location.i][location.j];

    if (!gGame.isOn) return;
    if (gCreatMines.inProcess) {
        toggelMine(location, !cell.isMine); // adds or removes mine in manually positioned
        return;
    }
    if (cell.isShown) return;
    if (cell.isMarked) return;
    if (gGame.firstClick) play(true, location); // when it's the first click we need to set mines and render 
    if (gGame.isHint) {
        hintMode(location);
        return;
    }
    if (cell.isMine) {
        // losing game or reduce life
        renderAdditional(LIFE, '.lives span', --gGame.lives);
        if (!gGame.lives) {
            gameOver(false, location);
            return;
        }
        renderCell(location, VAGUE_MINE);
        cell.isShown = true;
        gLevel.MINES--;
        gGame.shownCount++;
        gStack.push({ openMine: location });
    } else {
        if (!cell.minesAroundCount) {
            var opendCells = [];
            fullExpand(location, opendCells);
            gStack.push({ openCells: opendCells });
        }
        else {  // open cell
            var value = gNumbers[cell.minesAroundCount];
            renderCell(location, value);
            cell.isShown = true;
            gGame.shownCount++;
            gStack.push({ openCell: location });
        }
    }
    if (isVictory()) gameOver(true, location);
}

function setFlag(location) {
    var cell = gBoard[location.i][location.j];

    if (!gGame.isOn) return;
    if (cell.isShown) return;
    if (cell.isMarked) {
        //remove flag
        renderCell(location, HIDE);
        gGame.markedCount--;
        cell.isMarked = false;
        gStack.push({ removeFlag: location });
        return;
    }
    // add flag
    renderCell(location, FLAG);
    gGame.markedCount++;
    cell.isMarked = true;
    gStack.push({ addFlag: location });

    if (isVictory()) gameOver(true, location);
}

function hintMode(location) {
    gGame.isHint = false;
    var rowIdx = location.i;
    var colIdx = location.j;
    var hideCells = [];
    var locations = [];
    var value;
    // opens
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            var cell = gBoard[i][j];
            if (cell.isShown) continue;
            if (cell.isMine) value = MINE;
            else value = gNumbers[cell.minesAroundCount];
            renderCell(getLocation(i, j), value);
            hideCells.push(cell);
            locations.push(getLocation(i, j));
        }
    }
    // close in one second
    setTimeout(function () {
        for (var i = 0; i < hideCells.length; i++) {
            var cell = hideCells[i];
            var location = locations[i];
            if (cell.isMarked) value = FLAG;
            else value = HIDE;
            renderCell(location, value);
        }
    }, 1000);
}

function fullExpand(location, opendCells) {
    var rowIdx = location.i;
    var colIdx = location.j;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            var cell = gBoard[i][j];
            if (cell.isMarked || cell.isMine || cell.isShown) continue;
            var value = gNumbers[cell.minesAroundCount];
            cell.isShown = true;
            renderCell(getLocation(i, j), value);
            gGame.shownCount++;
            opendCells.push(getLocation(i, j));
            if (!cell.minesAroundCount) fullExpand(getLocation(i, j), opendCells);
        }
    }
    return opendCells;
}

function hintOn() {
    if (!gGame.hints) return;
    gGame.isHint = true;
    renderAdditional(HINT, '.hints span', --gGame.hints);
    if (!gGame.hints) {
        var elButton = document.querySelector('.hint-on');
        elButton.style.backgroundColor = 'red'; // telling the user that the button does not work anymore
    }
}

function safeClickOn() {
    if (!gGame.safeClicks) return;

    renderAdditional(SAFE, '.safes span', --gGame.safeClicks);
    var emptys = emptyCells();
    var location = drawNum(emptys);
    var selector = '.' + getClassName(location);
    var elCell = document.querySelector(selector);
    elCell.style.backgroundColor = 'rgb(212, 96, 96)';

    setTimeout(function () {
        elCell.style.backgroundColor = 'rgb(185, 185, 185)';
    }, 2000);

    if (!gGame.safeClicks) {
        var elClickButton = document.querySelector('.safe-click-on');
        elClickButton.style.backgroundColor = 'red'; // telling the user that the button does not work anymore
        return;
    }
}
'use strict'

function buildBoard(mat, selector) {
    var strHTML = '<table border="0"><tbody>';
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
    // console.log('strHTML', strHTML);
}

// add mines in random places
function setMines(location) {
    // turning the mat to one array so we can draw random cell.
    // we also remove the first clicked cell from the array - so the first click wont be a mine
    var cells = matToArray();
    var indexL = location.i * gBoard[0].length + location.j;
    cells.splice(indexL, 1);
    // console.log('cells', cells);
    for (var i = 0; i < gLevel.MINES; i++) {
        var cell = drawNum(cells);
        cell.isMine = true;
    }
}

function renderBoard() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            setMinesNegsCount(getLocation(i, j));
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
}

function openCell(location) {
    var cell = gBoard[location.i][location.j];

    if (!gGame.isOn) return;
    if (gFirstClick) { // when it's the first click we need to set mines and render
        gFirstClick = false;
        setMines(location);
        renderBoard();
    }
    if (cell.isShown) return;
    if (cell.isMarked) return;
    if (cell.isMine) {
        // losing game
        console.log('1game over you lost');
        gameOver(false, location);
        return;
    }
    // open cell
    var value = gNumbers[cell.minesAroundCount];
    renderCell(location, value);
    gGame.shownCount++;

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
        return;
    }
    // add flag
    renderCell(location, FLAG);
    gGame.markedCount++;
    cell.isMarked = true;

    if (isVictory()) gameOver(true, location);
}

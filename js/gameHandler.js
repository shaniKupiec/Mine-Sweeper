'use strict'

function renderBoard(mat, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            setMinesNegsCount(getLocation(i, j));
            var cell = mat[i][j];
            var className = `cell cell-${i}-${j}`;
            var value = HIDE;
            var location = getLocation(i, j);
            // console.log(location);
            if (cell.isShown) {
                className += ' shown';
                if (cell.isMine) value = MINE;
                else value = cell.minesAroundCount;
            }
            strHTML += `<td class="${className}" onmousedown="cellClicked(event)">${value}</td>`
        }
        // onmousedown="WhichButton(event)"
        // onclick="f(this)"
        // onclick="cellClicked(this)"
        // onclick="cellClicked(${location})"
        // oncontextmenu="event.preventDefault();"
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
    console.log('strHTML', strHTML);
}

// var cell = document.querySelector('cell-0-0');
// cell.addEventListener('click', WhichButton);

function cellClicked(event) {
    // console.log('event',event);
    // console.log('event.currentTarget',event.currentTarget);
    // console.log('event.currentTarget.className',event.currentTarget.className);
    // console.log('event.button',event.button);
    if(typeof event !== 'object') return;
    var className = event.currentTarget.className;
    // console.log('className',className);
    var location = getLocationFromClass(className);
    switch (event.button) {
        case 0:
            console.log('left');
            openCell(location);
            break;
        case 2:
            console.log('right');
            setFlag(location);
            break;
    }
}

// location object {i, j}
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
    // renderCell(location, count);
}

function openCell(location){
    console.log('open');
    var cell = gBoard[location.i][location.j];
    console.log('cell',cell);
    if(cell.isShown){
        console.log('open already');
        return
    }
    if(cell.isMarked){
        console.log('the cell is marked');
        return;
    }
    if(cell.isMine){
        console.log('game over you lost');
        gameOver(false);
        return;
    }
    var value = gNumbers[cell.minesAroundCount];
    renderCell(location, value);
}

function setFlag(){
    console.log('flag');
}

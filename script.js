var countRow = 0;
var countBombs = 0;
var bomb = 10;
var field = [];
var complexity;
var win = 0;
var emptySquare = 0;
var countFlags = 0;


createLevel = () => {
    win = 0;
    field = [];
    if (document.formfield !== undefined) {
        complexity = document.formfield.complexity.selectedIndex;
    } else {
        complexity = 1;
    }
    switch (complexity) {
        case 0:
            countRow = 8;
            countBombs = 10;
            break;
        case 1:
            countRow = 16;
            countBombs = 40;
            break;
        case 2:
            countRow = 24;
            countBombs = 100;
            break;
    }
    countFlags = countBombs;
    document.querySelector('.countFlags').textContent = countFlags;
    emptySquare = countRow ** 2 - countBombs;
    document.querySelector('.countEmptySquare').textContent = emptySquare;

    for (var i = 0; i < countRow; i++) {
        field[field.length] = [];
        for (var j = 0; j < countRow; j++) {
            field[i][j] = 0;
        }
    }
    var xBomb, yBomb;
    for (var i = 0; i < countBombs; i++) {
        do {
            xBomb = Math.round((countRow - 1) * Math.random());
            yBomb = Math.round((countRow - 1) * Math.random());
        } while (field[xBomb][yBomb] == bomb);
        field[xBomb][yBomb] = bomb;
    }
    preparationField();
    draw();
};

draw = () => {
    var vField = document.querySelector('.field');
    var out = '';
    for (var i = 0; i < countRow; i++) {
        for (var j = 0; j < countRow; j++) {
            out += `<div class="filling-${complexity}" data-x="${i}" data-y="${j}"></div>`;//${field[i][j]}
        }
    }
    vField.innerHTML = out;
    vField.onclick = handlClick;
    vField.oncontextmenu = handlContextClick;
}

handlClick = (event) => {
    if ((win == -1)) {
        createLevel();
        return;
    }
    if((event.target.dataset.x == undefined) || (event.target.classList.contains('flag')) || (event.target.classList.contains('checked'))){
        return;
    }
    if (field[event.target.dataset.x][event.target.dataset.y] == bomb) {
        win = -1;
        event.target.classList.add('bomb');
    } else {
        openField(event.target);
    }
}

handlContextClick = (event) => {
    event.preventDefault();
    if (win == -1 || event.target.classList.contains('checked')) {
        return;
    }
    if (event.target.classList.contains('flag')) {
        event.target.classList.remove('flag');
        countFlags++;
    } else {
        event.target.classList.add('flag');
        countFlags--;
    }
    document.querySelector('.countFlags').textContent = countFlags;
}

openField = (target) => {
    emptySquare--;
    document.querySelector('.countEmptySquare').textContent = emptySquare;
    var x = Number(target.dataset.x);
    var y = Number(target.dataset.y);
    target.classList.add('checked');
    if (field[x][y] == 0) {
        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                switch (i) {
                    case 0:
                        if (j == 0) {
                            break;
                        }
                    default:
                        if ((i + x >= 0) && (i + x <= countRow - 1) && (j + y >= 0) && (j + y <= countRow - 1)) {
                            var nextTarget = document.querySelectorAll(`.filling-${complexity}`)[(i + x) * countRow + j + y];
                            if (!nextTarget.classList.contains('checked')) {
                                openField(nextTarget);
                            }
                        }
                        break;
                }
            }
        }
    } else {
        target.textContent = field[x][y];
    }
}

preparationField = () => {
    var countAroundBombs = 0;
    for (var i = 0; i < countRow; i++) {
        for (var j = 0; j < countRow; j++) {
            countAroundBombs = 0;
            if (field[i][j] !== bomb) {
                for (var k = -1; k < 2; k++) {
                    for (var y = -1; y < 2; y++) {
                        switch (k) {
                            case 0:
                                if (y == 0) {
                                    break;
                                }
                            default:
                                if ((i + k >= 0) && (i + k <= countRow - 1) && (j + y >= 0) && (j + y <= countRow - 1))
                                    if (field[i + k][j + y] == bomb) {
                                        countAroundBombs++;
                                    }
                                break;
                        }
                    }
                }
                field[i][j] = countAroundBombs;
            }
        }
    }
}


document.addEventListener("DOMContentLoaded", createLevel);
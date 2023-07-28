let timeOut;
let isBlastsound = false;

function getMinePositions(length, breadth, numberofmines) {
    const positions = [];
    while (numberofmines > 0) {
        const x = Math.floor(Math.random() * breadth);
        const y = Math.floor(Math.random() * length);

        if (!positions.some((position) => position.x === x && position.y === y)) {
            positions.push({ x, y });
            numberofmines--;
        }
    }

    return positions;
}

function debounce(callback, delay) {
    return function (...args) {
        if (args[0] == "blast.mp3") isBlastsound = true;
        if (timeOut) clearTimeout(timeOut)
        timeOut = setTimeout(() => {
            if (isBlastsound) {
                callback("blast.mp3")
                return
            }
            callback(...args)
        }, delay)
    }
}

const debounceFunction = debounce(playSound, 0)

export function createBoard(length, breadth, numberofmines) {
    const board = [];
    const minePositions = getMinePositions(length, breadth, numberofmines);
    for (let row = 0; row < breadth; row++) {
        const Row = [];
        for (let col = 0; col < length; col++) {
            const element = document.createElement('div');
            element.classList.add('hidden');
            const tile = {
                element,
                x: row,
                y: col,
                mine: minePositions.some((position) => position.x === row && position.y === col),
                get status() {
                    return this.element.classList.value
                },
                set status(value) {
                    this.element.classList.value = value
                }
            }
            Row.push(tile);
        }
        board.push(Row);
    }

    return board;
}

function adjacentTiles(board, tile) {
    const tiles = [];
    let offSetTile;
    for (let offsetx = -1; offsetx <= 1; offsetx++) {
        for (let offsety = -1; offsety <= 1; offsety++) {
            offSetTile = board[tile.x + offsetx]?.[tile.y + offsety];
            if (offSetTile) tiles.push(offSetTile);
        }
    }
    return tiles;
}

export function markTile(tile) {
    if (tile.status != 'hidden' && tile.status != 'marked') return;
    if (tile.status == "marked") tile.status = "hidden";
    else
        tile.status = "marked";
    playSound("marked.wav")
}

function playSound(fileName) {
    let audio = new Audio(fileName);
    audio.play()
}

export function revealTile(board, tile) {
    if (tile.status != 'hidden' && tile.status != 'marked') return;
    if (tile.status == 'marked') return;

    if (tile.mine) {
        tile.status = "mine"
        debounceFunction("blast.mp3")
        return;
    }

    tile.status = "revealed";
    const nearByTiles = adjacentTiles(board, tile);
    const mines = nearByTiles.filter(tile => tile.mine);
    if (mines.length == 0) {
        nearByTiles.forEach((tile) => revealTile(board, tile));
    }
    else {
        const number = document.createElement("h3");
        number.innerText = mines.length
        switch (mines.length) {
            case 1: tile.status = tile.status + " " + "blue"
                break;
            case 2: tile.status = tile.status + " " + "yellow"
                break;
            case 3: tile.status = tile.status + " " + "pink"
                break;
            case 4: tile.status = tile.status + " " + "green"
                break;
            case 5: tile.status = tile.status + " " + "violet"
                break;
        }
        tile.element.append(number);
    }
    debounceFunction('reveal.wav')
}

export function checkLose(tile) {
    if (tile.mine && tile.status != "marked") {
        return true;
    }

    else return false;
}

export function checkWin(board) {
    return board.every(row => {
        return row.every(tile => {
            return (tile.status == "revealed" || (tile.mine && (tile.status == "marked" || tile.status == "hidden")))
        })
    })
}


function getMinePositions(size,numberofmines){
    const positions = [];
    while(numberofmines>0){
        const x = Math.floor(Math.random()*size);
        const y = Math.floor(Math.random()*size);

        if(!positions.some((position)=>position.x===x && position.y===y)){
            positions.push({x,y});
            numberofmines--;
        }
    }

    return positions;
}

export function createBoard(size, numberofmines) {
    const board = [];
    const minePositions = getMinePositions(size,numberofmines);
    for (let row = 0; row < size; row++) {
        const Row = [];
        for (let col = 0; col < size; col++) {
            const element =  document.createElement('div');
            element.classList.add('hidden');
            const tile = {
                element,
                x:row,
                y:col,
                mine:minePositions.some((position)=>position.x===row && position.y===col),
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

function adjacentTiles(board,tile) {
    const tiles= [];
    let offSetTile;
    for(let offsetx = -1; offsetx <= 1; offsetx++) {
        for(let offsety = -1; offsety <= 1; offsety++) {
           offSetTile = board[tile.x+offsetx]?.[tile.y+offsety];
           if(offSetTile) tiles.push(offSetTile);
        }
    }
    return tiles;
}
export function markTile(tile){
    if(tile.status != 'hidden'&& tile.status != 'marked')
     return;
    if(tile.status == "marked"){
        tile.status = "hidden";
    }
    else
    tile.status = "marked";
}

export function revealTile(board,tile){ 
    if(tile.status != 'hidden'&& tile.status != 'marked') return;
    if(tile.status == 'marked')return;

    if(tile.mine){
        tile.status = "mine"
        return;
    }
    
    tile.status ="revealed";
    const nearByTiles = adjacentTiles(board,tile);
    const mines = nearByTiles.filter(tile => tile.mine);
    if(mines.length==0){
      nearByTiles.forEach((tile)=>revealTile(board,tile));
    }
    else{
    const number = document.createElement("h3");
    number.innerText = mines.length
    switch(mines.length){
        case 1: number.style.color ="red"
        break;
        case 2: number.style.color ="blue"
        break;
        case 3: number.style.color ="green"
        break;
        case 4: number.style.color ="pink"
        break;
        case 5: number.style.color ="purple"
        break;
        case 6: number.style.color ="violet"
        break;
    }
     tile.element.append(number);
    }
}

export function checkLose(tile){
    if(tile.mine&&tile.status!="marked"){
        return true;
    }

    else return false;
}

export function checkWin(board){
    return board.every(row => {
         return row.every(tile => {
            return( tile.status == "revealed" || (tile.mine && (tile.status == "marked" || tile.status =="hidden")))})
    })
}
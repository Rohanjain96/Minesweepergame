import { checkLose, checkWin, createBoard, markTile, revealTile } from "./minesweeper.js";

const boardsize = 10;
const mines = 15;
const numerOfFlags =  15;
const board = createBoard(boardsize, mines);
const boardElement = document.querySelector(".board");
const flagleftTitle = document.querySelector("#flagleft");
const playagainbutton = document.querySelector(".playagain");
flagleftTitle.innerText = numerOfFlags
board.forEach((Row)=>{
    Row.forEach((tile)=>{
        boardElement.append(tile.element);
        tile.element.addEventListener("click", (e)=>{
            revealTile(board,tile);
            checkGameEnd(board,tile)
        })
        tile.element.addEventListener("contextmenu", (e)=>{
            e.preventDefault();
            markTile(tile);
            howMuchFlagLeft();
        })
    })
})
boardElement.style.setProperty("--size",boardsize);


function howMuchFlagLeft(){
   const flagLeft = board.reduce((count,row)=>{
    return count+row.filter((tile)=>tile.status=="marked").length;
   },0);
   flagleftTitle.innerText = numerOfFlags-flagLeft;
}

function checkGameEnd(board,tile){
    const win = checkWin(board);
    const lose = checkLose(tile)
    console.log("outside:",win)
    if(win||lose){
        boardElement.addEventListener("contextmenu", stopProp,{capture:true}); 
        boardElement.addEventListener("click", stopProp,{capture:true}); 
    }
    
    if(lose){
        console.log("inside:",lose)
        document.querySelector(".gameover").style.display="block";
        board.forEach(row=>row.forEach(tile=>revealTile(board,tile)));
        playagainbutton.style.opacity= 1;
    }
    
    if(win){
        console.log("inside:",win)
        document.querySelector(".gamewin").style.display="block";
        playagainbutton.style.opacity= 1;

    }
}

function stopProp(e){
    e.stopImmediatePropagation()
}

playagainbutton.addEventListener("click", function(){ 
    window.location.reload("true")
})


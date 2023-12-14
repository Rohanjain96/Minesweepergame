import { checkLose, checkWin, createBoard, markTile, revealTile } from "./minesweeper.js";
let mines;
let length;
let breadth;
let numerOfFlags;
let board;
let level = localStorage.getItem("level") || "medium"
let second = 0;
let interval;
const boardElement = document.querySelector(".board");
const flagleftTitle = document.querySelector("#flagleft");
const playagainbutton = document.querySelector(".playagain");
const timer = document.querySelector(".timer span");
const width = window.innerWidth;


document.addEventListener('DOMContentLoaded', function () {
    const customSelect = document.querySelector('.custom-select');
    const selectSelected = customSelect.querySelector('.select-selected');
    const selectOptions = customSelect.querySelector('.select-options');
    selectOptions.style.display = 'none'
    selectSelected.textContent = level.charAt(0).toUpperCase() + level.substring(1)||"Medium";
    startTimer()
    showBoard()

    // Toggle the options when the select is clicked
    selectSelected.addEventListener('click', function () {
        selectOptions.style.display = selectOptions.style.display !== 'none' ? 'none' : 'block';
    });

    // Handle option selection
    const selectOptionElements = customSelect.querySelectorAll('.select-option');
    for (const optionElement of selectOptionElements) {
        optionElement.addEventListener('click', function () {
            level = optionElement.getAttribute("data-value");
            localStorage.setItem('level',level)
            selectSelected.textContent = optionElement.textContent;
            selectOptions.style.display = 'none';
            second = 0;
            clearInterval(interval)
            startTimer()
            showBoard()
            window.location.reload("true")
        });
    }
});

function startTimer() {
    interval = setInterval(() => {
        second++;
        timer.innerText = second
    }, 1000)
}

function pauseTimer() {
    clearInterval(interval)
}

function showBoard() {
    switch (level) {
        case "easy": length = 12;
            breadth = 6;
            mines = 15;
            break;
        case "medium": length = 15;
            breadth = 9;
            mines = 25;
            break;
        case "hard": length = 20;
            breadth = 9;
            mines = 35;
    }

    let temp

    if (width <= "768") {
        temp = length;
        length = breadth;
        breadth = temp
    }

    board = createBoard(length, breadth, mines);
    numerOfFlags = mines;
    flagleftTitle.innerText = numerOfFlags

    boardElement.innerHTML = ''

    board.forEach((Row) => {
        Row.forEach((tile) => {
            boardElement.append(tile.element);
            tile.element.addEventListener("click", (e) => {
                revealTile(board, tile);
                checkGameEnd(board, tile)
            })
            tile.element.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                markTile(tile);
                howMuchFlagLeft();
            })
        })
    })
    boardElement.style.setProperty("--length", length);
    boardElement.style.setProperty("--breadth", breadth);
}

function howMuchFlagLeft() {
    const flagLeft = board.reduce((count, row) => {
        return count + row.filter((tile) => tile.status == "marked").length;
    }, 0);
    flagleftTitle.innerText = String(numerOfFlags - flagLeft);
}

function checkGameEnd(board, tile) {
    const win = checkWin(board);
    const lose = checkLose(tile)
    if (win || lose) {
        boardElement.addEventListener("contextmenu", stopProp, { capture: true });
        boardElement.addEventListener("click", stopProp, { capture: true });
    }

    if (lose) {
        document.querySelector(".gameover").style.display = "block";
        board.forEach(row => row.forEach(tile => revealTile(board, tile)));
        playagainbutton.style.opacity = 1;
        pauseTimer()
    }

    if (win) {
        document.querySelector(".gamewin").style.display = "block";
        playagainbutton.style.opacity = 1;
        pauseTimer()
    }
}

function stopProp(e) {
    e.stopImmediatePropagation()
}

playagainbutton.addEventListener("click", function () {
    window.location.reload("true")
})


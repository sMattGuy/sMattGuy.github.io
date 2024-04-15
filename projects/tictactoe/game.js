const statusDisplay = document.querySelector('.game--status');

let gameActive = true;
let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];

const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `You are X! Good luck!`;

statusDisplay.innerHTML = currentPlayerTurn();
//win states
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

//helper functions 
function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
}

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    handlePlayerChange();
}

//buttons on screen including board
function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
	findBestMove();
}
function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
}

//AI code
let player = "O";
function findBestMove(){
	let bestVal = -999999;
	let bestMove = null;
	let boardCopy = gameState;
	for(let i=0;i<9;i++){
		if(boardCopy[i] === ''){
			//open space to evaluate
			boardCopy[i] = player;
			let moveVal = miniMax(boardCopy, 0, false);
			boardCopy[i] = "";
			if(moveVal > bestVal){
				bestMove = i;
				bestVal = moveVal;
			}
		}
	}
	if(bestMove == null){
		
	}
	else{
		gameState[bestMove] = "O";
		document.getElementById(bestMove).innerHTML = "O";
	}
	
	handleResultValidation();
}
function evaluate(board){
	for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = board[winCondition[0]];
        let b = board[winCondition[1]];
        let c = board[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            if(a === "X")
				return -10;
			else
				return 10;
        }
    }
	return 0;
}
function miniMax(board, depth, maxingPlayer){
	let score = evaluate(board);
	if(score == 10 || score == -10){
		return score;
	}
	if(!board.includes("")){
		return 0;
	}
	if(maxingPlayer){
		let bestValue = -99999;
		for(let i=0;i<9;i++){
			if(gameState[i] === ''){
				board[i] = "O";
				bestValue = Math.max(bestValue, miniMax(board, depth+1,!maxingPlayer));
				board[i] = "";
			}
		}
		return bestValue;
	}
	else{
		let bestValue = 99999;
		for(let i=0;i<9;i++){
			if(gameState[i] === ''){
				board[i] = "X";
				bestValue = Math.min(bestValue, miniMax(board, depth+1,!maxingPlayer));
				board[i] = "";
			}
		}
		return bestValue;
	}
}
//updating the document
document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.game--restart').addEventListener('click', handleRestartGame);
let prevElement = null;
document.addEventListener('mousemove',
    function(e){
        let elem = e.target || e.srcElement;
		if(elem.classList.contains("cell")){
			if (prevElement != null){
				prevElement.classList.remove("mouseOn");
			}
			elem.classList.add("mouseOn");
			prevElement = elem;
		}
		else{
			if (prevElement != null){
				prevElement.classList.remove("mouseOn");
			}
		}
    },true);
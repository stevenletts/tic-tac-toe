import "./style.css";

// Player factory
const Player = (sign) => {
  let _sign = sign;

  const getSign = () => {
    return _sign;
  };

  return { getSign };
};

// Board module
const gameBoard = (() => {
  // generate board array
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => {
    return board;
  };

  const setSq = (index, sign) => {
    board[index] = sign;
  };

  const getSq = (index) => {
    return board[index];
  };

  const reset = () => {
    const boardLen = board.length;
    for (let i = 0; i < boardLen; i++) {
      board[i] = "";
    }
  };

  return { getBoard, getSq, setSq, reset };
})();

// Game Controller
const Game = (() => {
  let p1 = Player("x");
  let p2 = Player("o");
  let freeSquares = 9;
  let won = false;

  const currentSign = () => {
    return freeSquares % 2 === 1 ? p1.getSign() : p2.getSign();
  };

  const playTurn = (sq) => {
    gameBoard.setSq(sq, currentSign());
    if (checkWinner(sq)) {
      won = true;
      let winner = currentSign();

      DisplayController.setWin(winner);
      return;
    }
    if (freeSquares === 1) {
      won = true;
      DisplayController.setWin("draw");
      return;
    }
    freeSquares--;
    DisplayController.setMsg(`Player ${currentSign()}`);
  };

  const checkWinner = (sq) => {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winningCombos
      .filter((combo) => combo.includes(sq))
      .some((possCombo) =>
        possCombo.every((index) => gameBoard.getSq(index) === currentSign())
      );
  };
  const getWon = () => {
    return won;
  };
  const reset = () => {
    freeSquares = 9;
    won = false;
  };
  return { playTurn, reset, getWon };
})();

const DisplayController = (() => {
  const squares = document.querySelectorAll(".square");
  const message = document.getElementById("status");
  const resetBtn = document.getElementById("reset-btn");

  resetBtn.addEventListener("click", (e) => {
    Game.reset();
    gameBoard.reset();
    update();
  });

  squares.forEach((square) => {
    square.addEventListener("click", (e) => {
      if (Game.getWon() || e.target.textContent !== "") return;
      else {
        Game.playTurn(parseInt(e.target.dataset.index));
        update();
      }
    });
  });

  const update = () => {
    let square = squares.length;
    for (let i = 0; i < square; i++) {
      squares[i].textContent = gameBoard.getSq(i);
    }
  };

  const setMsg = (msg) => {
    message.textContent = msg;
  };

  const setWin = (winner) => {
    if (winner === "draw") {
      setMsg("Draw");
    } else {
      setMsg(`Player ${winner} wins!`);
    }
  };
  return { setMsg, setWin, update };
})();

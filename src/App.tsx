
import { useNavigate } from "react-router-dom";
import { MouseEventHandler, useState } from 'react';
import "./App.css";
// 井棋游戏配置
// 井棋单元格自定义组件
type SquareType = {
  value: any, onSquareClick: MouseEventHandler<HTMLButtonElement> | undefined
}
const Square = (props: SquareType) => {
  const { value, onSquareClick } = props
  return (
    <button className={"square"} onClick={onSquareClick}>
      {value}
    </button>
  );
}
type text = {
  xIsNext: boolean, squares: any, onPlay: (nextSquares: (String | null)[]) => void
}
// 井棋棋盘
const Board = (props: text) => {
  const { xIsNext, squares, onPlay } = props
  // 判断是否获胜
  function calculateWinner(squares: Array<[]>) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  // 单元格单击事件
  function handleClick(i: number) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }
  // 棋盘小标题
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }
  return (
    <>
      <div className={"status"}>{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  )
}

function App() {
  const [xIsNext, setXIsNext] = useState(true);
  // [Array(9).fill(null)] 是一个包含单个元素的数组，它本身是一个包含 9 个 null 的数组。
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // 要渲染当前落子的方块，你需要从 history 中读取最后一个 squares 数组。
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares: Array<null | String>) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }
  const navigate = useNavigate();
  return (
    <div className="App">
      <div>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="AppRight">
        <div>
          <button onClick={() => navigate('/gobang')}>跳转</button>
          <button onClick={() => navigate('/wellchess')}>跳转</button>
        </div>
        <div>
          悔棋
        </div>
      </div>
    </div>
  );
}

export default App;

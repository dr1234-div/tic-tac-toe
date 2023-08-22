import { useNavigate } from 'react-router-dom';
import './index.css'
import useHook from "./useHook";
import { useState } from 'react';
const GobangHook = () => {
  type palyArrType = {
    row: number,
    col: number,
    chess: number
  }[]
  let { play, setpalyArr, chessman, palyArr, setChess, setChessmMan } = useHook()
  const navigate = useNavigate();
  const border = Array(20).fill(null)
  const [history, setHistory] = useState<palyArrType>([]);

  // 当前步骤状态存储
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  function playChess(rowIndex: number, colIndex: number) {
    if (chessman === '获胜者：黑棋' || chessman === '获胜者：白棋') return

    // 每次下棋都会更新history
    let nextHistory;
    if (currentSquares === palyArr[palyArr.length - 1]) {
      nextHistory = [...history.slice(0, currentMove + 1)]
    } else {
      nextHistory = [...history.slice(0, currentMove + 1), palyArr[palyArr.length - 1]]
    }
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1);
    play(rowIndex, colIndex)
  }

  // 渲染黑白棋子
  const Teml = (rowIndex: number, colIndex: number) => {
    if (palyArr.find((item: { row: number, col: number, chess: number }) => item.row === rowIndex && item.col === colIndex)) {
      return palyArr.find(
        (item: { row: number, col: number, chess: number }) => item.row === rowIndex && item.col === colIndex
      )?.chess === 1 ? (
        <div className="chessboard-cell-black"></div>
      ) : (
        <div className="chessboard-cell-white"></div>
      )
    } else {
      return (
        <div
          className="chessboard-cell-click"
          onClick={() => playChess(rowIndex, colIndex)}
        ></div>
      )
    }
  }

  // 记录棋子状态
  const moves = history.map((_, index, array) => {
    // 描述
    let description;
    index > 0 ? (description = '跳转到步骤：' + index) : (description = '开始游戏')
    return (
      <li key={index}>
        <button onClick={() => jumpTo(index)}>{'跳转到步骤：' + Number(index + 1)}</button>
      </li>
    );
  })

  // 点击跳转到指定步骤的回调函数
  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove)
    const nextHistory = history.slice(0, nextMove + 1)
    const filterArr = nextHistory.filter(value => value != undefined)
    const lastFilterArr = filterArr[filterArr.length - 1]
    console.log(lastFilterArr);
    if (lastFilterArr.chess === 2) {
      setChessmMan('下一位：黑棋')
    } else {
      setChessmMan('下一位：白棋')
    }
    setChess(lastFilterArr.chess)
    setpalyArr(filterArr)

  }
  return (
    <div className="chessboard-wrapper">
      <div>
        <h1 className='h1Style'>{chessman}</h1>
        <div className="chessboard">
          {border.map((row, rowIndex) => (
            <div className="chessboard-row" key={`row + ${rowIndex}`}>
              {border.map((col, colIndex) => (
                <div className="chessboard-col" key={`col + ${colIndex}`}>
                  <div className="chessboard-cell">
                    {Teml(rowIndex, colIndex)}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className='chessboard-right'>
        <div>
          <button className='gameChange' onClick={() => navigate('/wellchess')}>井棋游戏</button>
        </div>
        <div className='stateContent'> <ul className="styoo">{moves}</ul></div>
      </div>
    </div>

  );
}

export default GobangHook
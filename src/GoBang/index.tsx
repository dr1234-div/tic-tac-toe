import { useNavigate } from 'react-router-dom';
import './index.css'
import useHook from "./useHook";
const GobangHook = () => {
  let { play, setpalyArr, chessman, palyArr } = useHook()
  const navigate = useNavigate();
  const border = Array(20).fill(null)

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
          onClick={() => play(rowIndex, colIndex)}
        ></div>
      )

    }
  }
  // 记录棋子状态
  const moves = palyArr.map((_, index, array) => {
    // 描述
    let description;
    index > 0 ? (description = '跳转到步骤：' + index) : (description = '开始游戏')
    return (
      <li key={index}>
        <button onClick={() => jumpTo(index)}>{description}</button>
      </li>
    );
  })

  // 点击跳转到指定步骤的回调函数
  function jumpTo(nextMove: number) {
    const nextHistory = palyArr.splice(0, nextMove)
    setpalyArr(nextHistory)
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
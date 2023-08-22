import { useState } from "react";
import Board from "./compents/Board";
import { useNavigate } from "react-router-dom";

// 井棋子
const WellChess = () => {
    // [Array(9).fill(null)] 是一个包含单个元素的数组，它本身是一个包含 9 个 null 的数组。
    const [history, setHistory] = useState([Array(9).fill(null)]);

    // 当前步骤状态存储
    const [currentMove, setCurrentMove] = useState(0);

    // 判断下一步是否是X
    const xIsNext = currentMove % 2 === 0;

    // 要渲染当前落子的方块，你需要从 history 中读取最后一个 squares 数组。
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares: Array<null | String>) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    // 点击跳转到指定步骤的回调函数
    function jumpTo(nextMove: number) {
        setCurrentMove(nextMove);
    }

    // 动态生成跳转按钮
    const moves = history.map((squares, move: number) => {
        let description;
        if (move > 0) {
            description = '跳转到步骤：' + move;
        } else {
            description = '开始游戏';
        }
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });
    const navigate = useNavigate();
    return (
        <div className="chessboard-wrapper">
            <div >
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className='chessboard-right'>
                <div>
                    <button className='gameChange' onClick={() => navigate('/gobang')}>五子棋游戏</button>
                </div>
                <div className='stateContent'>
                    <ul className="styoo">{moves}</ul>
                </div>
            </div>
        </div>
    )
}
export default WellChess;

import React, { useState } from 'react';
import Board from './compents/Board';
import { useNavigate } from 'react-router-dom';

/**
 *@description 井子棋组件
 */
const WellChess = () => {
    const [history, setHistory] = useState([Array(9).fill(null)]);

    // 当前步骤状态存储
    const [currentMove, setCurrentMove] = useState(0);

    // 判断下一步是否是X
    const xIsNext = currentMove % 2 === 0;

    // 要渲染当前落子的方块，你需要从 history 中读取最后一个 squares 数组。
    const currentSquares = history[currentMove];

    /**
     * @param {(Array<null | string>)} nextSquares 接受最新的棋子状态数组，
     * @description 下棋动作的监听函数，存储井字棋每个步骤的状态以及最新的步骤索引
     */
    function handlePlay (nextSquares: Array<null | string>) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    /**
     * @param {number} nextMove 指定的步骤索引
     * @description 点击跳转到指定步骤的回调函数
     */
    function jumpTo (nextMove: number) {
        if (sessionStorage.getItem('isWin') === '获胜者: O' || sessionStorage.getItem('isWin') === '获胜者: X') {
            alert('注意：获胜后将无法进行悔棋！！！');
            return;
        }
        setCurrentMove(nextMove);
    }

    // 动态生成跳转按钮
    const moves = history.map((squares, move: number) => {
        let description;
        if (move > 0) {
            description = `跳转到步骤：${move}`;
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
    );
};
export default WellChess;

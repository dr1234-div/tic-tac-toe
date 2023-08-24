import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import useHook from './useHook';

/**
 *@description GobangHook 五子棋的自定义组件
 *@return 渲染棋盘、游戏类型的切换按钮以及历史记录的跳转按钮
 */
const GobangHook = () => {
    type palyArrType = {
        row: number;
        col: number;
        chess: number;
    }[]
    const { play, setpalyArr, chessman, palyArr, setChess, setChessmMan } = useHook();
    const navigate = useNavigate();
    const border = Array(20).fill(null);
    const [history, setHistory] = useState<palyArrType>([]);

    // 当前步骤状态存储
    const [currentMove, setCurrentMove] = useState(0);
    const currentSquares = history[currentMove];

    /**
     * @param {number} rowIndex 棋子的水平坐标
     * @param {number} colIndex 棋子的垂直坐标
     * @description 该函数实现对下棋动作的回调监听，每次执行都会保存以往的历史记录和当前的索引和执行play函数
     */
    function playChess (rowIndex: number, colIndex: number) {
        if (chessman === '获胜者：黑棋' || chessman === '获胜者：白棋') return;

        // 每次下棋都会更新history
        let nextHistory;
        if (currentSquares === palyArr[palyArr.length - 1]) {
            nextHistory = [...history.slice(0, currentMove + 1)];
        } else {
            nextHistory = [...history.slice(0, currentMove + 1), palyArr[palyArr.length - 1]];
        }
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        play(rowIndex, colIndex);
    }

    /**
     * @param {number} rowIndex 棋子的横坐标
     * @param {number} colIndex 棋子的纵坐标
     * @return {node} 返回一个节点，用于渲染黑棋或白棋
     */
    const teml = (rowIndex: number, colIndex: number) => {
        if (palyArr.find((item: { row: number, col: number, chess: number }) => item.row === rowIndex && item.col === colIndex)) {
            return palyArr.find((item: { row: number, col: number, chess: number }) => item.row === rowIndex && item.col === colIndex)?.chess === 1 ? (
                <div className="chessboard-cell-black"></div>
            ) : (
                <div className="chessboard-cell-white"></div>
            );
        }
        return (
            <div
                className="chessboard-cell-click"
                onClick={() => playChess(rowIndex, colIndex)}
            ></div>
        );
    };

    // 记录棋子状态
    const moves = history.map((__, index) => {
        return (
            <li key={index}>
                <button onClick={() => jumpTo(index)}>{`跳转到步骤：${Number(index + 1)}`}</button>
            </li>
        );
    });

    /**
     * @param {number} nextMove 传入指定的步骤数
     * @return {node} 跳转到指定的棋盘状态
     */
    function jumpTo (nextMove: number) {
        // 获胜后将不能进行悔棋
        if (chessman === '获胜者：黑棋' || chessman === '获胜者：白棋') {
            alert('注意：获胜后将无法进行悔棋！！！');
            return;
        }
        setCurrentMove(nextMove);
        const nextHistory = history.slice(0, nextMove + 1);
        const filterArr = nextHistory.filter(value => value !== undefined);
        const lastFilterArr = filterArr[filterArr.length - 1];
        if (lastFilterArr.chess === 2) {
            setChessmMan('下一位：黑棋');
        } else {
            setChessmMan('下一位：白棋');
        }
        setChess(lastFilterArr.chess);
        setpalyArr(filterArr);
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
                                        {teml(rowIndex, colIndex)}
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
};

export default GobangHook;

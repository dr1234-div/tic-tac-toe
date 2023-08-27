import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import useGoBang from './useGoBang';
import type { playArrType } from '../App.d';
import ChessType from './components/ChessType';
// import GoBangBoard from './components/GoBangBoard';
// 提出来，避免重复计算带来性能消耗
const border = Array(20).fill(null);

/**
 *@description GobangHook 五子棋的自定义组件
 *@return 渲染棋盘、游戏类型的切换按钮以及历史记录的跳转按钮
 */
const GobangHook = () => {
    const { play, setPlayArr, chessStatus, setChessStatus, playArr, setChess  } = useGoBang();
    const navigate = useNavigate();
    const [history, setHistory] = useState<playArrType>([]);

    // 当前步骤状态存储
    const [currentMove, setCurrentMove] = useState(0);

    // 当前棋盘棋子的状态
    const currentSquares = history[currentMove];

    /**
     * @param {number} rowIndex 棋子的水平坐标
     * @param {number} colIndex 棋子的垂直坐标
     * @description 该函数实现对下棋动作的回调监听，每次执行都会保存以往的历史记录和当前的索引和执行play函数
     */
    function playChess (rowIndex: number, colIndex: number) {
        if (chessStatus === '获胜者：黑棋' || chessStatus === '获胜者：白棋') return;

        // 每次下棋都会更新history，判断的目的是在游戏结束后阻止继续下棋而导致历史记录跳转按钮的继续渲染
        let nextHistory;
        if (currentSquares === playArr[playArr.length - 1]) {
            nextHistory = [...history.slice(0, currentMove + 1)];
        } else {
            nextHistory = [...history.slice(0, currentMove + 1), playArr[playArr.length - 1]];
        }
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        play(rowIndex, colIndex);
    }
    // 渲染棋子历史记录跳转按钮
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
        if (chessStatus === '获胜者：黑棋' || chessStatus === '获胜者：白棋') {
            alert('注意：获胜后将无法进行悔棋！！！');
            return;
        }
        setCurrentMove(nextMove);
        const nextHistory = history.slice(0, nextMove + 1);
        const lastFilterArr = nextHistory[nextHistory.length - 1];
        setChessStatus(`下一位玩家：${lastFilterArr.chess === 1 ? '黑' : '白'}棋`);
        // newChessStatus = `下一位：${lastFilterArr.chess === 1 ? '黑' : '白'}棋`;
        setChess(lastFilterArr.chess);
        setPlayArr(nextHistory);
    }
    return (
        <div className="chessboardWapper">
            <div>
                <h1 className='h1Style'>{chessStatus}</h1>
                <div className="chessboard">
                    {/* 生成20个棋盘行和20个棋盘列 */}
                    {/* <GoBangBoard playArr={playArr} playChess={playChess}/> */}
                    {border.map((row, rowIndex) => (
                        <div className="chessboardRow" key={`row + ${rowIndex}`}>
                            {border.map((col, colIndex) => (
                                <div className="chessboardCol" key={`col + ${colIndex}`}>
                                    <div className="chessboardCell">
                                        <ChessType rowIndex={ rowIndex } colIndex={colIndex} playArr={playArr} onPlay={playChess}/>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className='chessboardRight'>
                <div>
                    <button className='gameChange' onClick={() => navigate('/wellchess')}>井棋游戏</button>
                </div>
                <div className='stateContent'> <ul className="styoo">{moves}</ul></div>
            </div>
        </div>

    );
};

export default GobangHook;

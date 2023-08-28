import { useState } from 'react';

/**
 * @description 对井棋不共用的数据和方法进行封装
 */
const useWellChessIndex = (initialState:number) => {
    const [currentMove, setCurrentMove] = useState(initialState);
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const currentSquares = history[currentMove];
    /**
     * @param {(Array<null | string>)} nextSquares 接受最新的棋子状态数组，
     * @description 下棋动作的监听函数，存储井字棋每个步骤的状态以及最新的步骤索引
     */
    function playChess (nextSquares: Array<null | string>) {
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

    return {
        currentSquares,
        currentMove,
        history,
        setHistory,
        setCurrentMove,
        playChess,
        jumpTo,
    };
};
export default useWellChessIndex;

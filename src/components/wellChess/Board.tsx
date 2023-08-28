import React from 'react';
import Square from './Squre';
import { BoardType } from '../../App.d';


/**
 * @param {boolean} props.xIsNext 下一个是不是X
 * @param {Array<null | string>} props.squares 保存着当前棋盘上的棋子状态的数组
 * @param {void} props.onPlay 单元格的点击监听回调
 * @return {*}
 */
const Board = (props: BoardType) => {
    const { xIsNext, squares, onPlay } = props;

    /**
     * @param {(Array<null | string>)} squares 保存着当前棋盘上的棋子状态的数组
     * @description 声明变量保存所有获胜的坐标代码，通过循环遍历是否相同来判断是否获胜
     */
    function calculateWinner (squares: Array<null | string>) {
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
        for (let index = 0; index < lines.length; index++) {
            const [one, two, three] = lines[index];
            if (squares[one] && squares[one] === squares[two] && squares[one] === squares[three]) {
                return squares[one];
            }
        }
        return null;
    }

    /**
     * @param {number} index 棋子所在位置的数组索引
     * @return {*} 单元格点击事件
     */
    function handleClick (index: number) {
        if (calculateWinner(squares) || squares[index]) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[index] = 'X';
        } else {
            nextSquares[index] = 'O';
        }
        onPlay(nextSquares);
    }

    // 棋盘小标题
    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = `获胜者: ${winner}`;
    } else {
        status = `下一位玩家: ${xIsNext ? 'X' : 'O'}`;
    }
    sessionStorage.setItem('isWin', status);
    return (
        <>
            <div className={'status'}><h1>{status}</h1></div>
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
    );
};
export default Board;

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
    const { xIsNext, squares, border,  onPlay, isWinner } = props;
    let status = '';
    isWinner ? status = `获胜者: ${isWinner === '先手' ? 'X' : 'O'}` : status = `下一位玩家: ${xIsNext === '先手' ? 'X' : 'O'}`;
    return (
        <>
            <div className={'status'}><h1>{status}</h1></div>
            <div>
                {border
                    .map((__, rowIndex) => (
                        <div className="board-row" key={rowIndex}>
                            {border
                                .map((__, colIndex) => {
                                    const squareIndex = (rowIndex * 3) + colIndex;
                                    return (
                                        <Square
                                            key={squareIndex}
                                            value={xIsNext}
                                            onSquareClick={onPlay}
                                            playArr={squares}
                                            rowIndex={rowIndex}
                                            colIndex={colIndex}
                                        />
                                    );
                                })}
                        </div>
                    ))}
            </div>
        </>
    );
};
export default Board;

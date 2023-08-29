import React from 'react';
import ChessType from './ChessType';
import { GoBangBoardType } from '../../App.d';

/**
 *@param {playArrType} playArr 已下棋子的数组
 *@param {void} playChess 下棋动作监听回调
 * @return {*}
 */
const GoBangBoard = (props:GoBangBoardType) => {
    const {  border, newPlayArr, onPlayChess, chessStatus } = props;
    return (
        <>
            <h1 className='h1-style'>{chessStatus === '先手' ? '下一位：黑棋' : '下一位：白棋'}</h1>
            <div className="chess-board">
                {border.map((row:number, rowIndex:number) => (
                    <div className="chess-board-row" key={`row + ${rowIndex}`}>
                        {border.map((col:number, colIndex:number) => (
                            <div className="chess-board-col" key={`col + ${colIndex}`}>
                                <div className="chess-board-cell">
                                    <ChessType rowIndex={ rowIndex } colIndex={colIndex} playArr={newPlayArr} onPlay={onPlayChess}/>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </>

    );
};

export default GoBangBoard;

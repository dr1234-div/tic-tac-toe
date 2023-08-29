import React from 'react';
import ChessType from './ChessType';
import { GoBangBoardType } from '../../App.d';

/**
 *@param {playArrType} playArr 已下棋子的数组
 *@param {void} playChess 下棋动作监听回调
 * @return {*}
 */
const GoBangBoard = (props:GoBangBoardType) => {
    const {  border, newPlayArr, onPlayChess, chessStatus, isWinner } = props;
    let status = '';
    isWinner ? status = `获胜者: ${isWinner === '先手' ? '黑棋' : '白棋'}` : status = `下一位玩家: ${chessStatus === '先手' ? '黑棋' : '白棋'}`;
    return (
        <>
            <h1 className='h1-style'>{status}</h1>
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

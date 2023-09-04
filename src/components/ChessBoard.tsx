import React from 'react';
import { ChessBoardType } from '../App.d';
import ChessType from './ChessType';
import { useAppSelector } from '../myHooks/useReduxHooks';

/**
 *@description 用于渲染不同的棋盘
 */
const ChessBoard = (props:ChessBoardType) => {
    const { goBangIsNext, border, onPlayChess } = props;
    const winner = useAppSelector((statue) => statue.winner);
    const chess = useAppSelector((statue) => statue.chess);
    let status = '';
    if (goBangIsNext) {
        winner ? status = `获胜者: ${winner === '先手' ? 'X' : 'O'}` : status = `下一位玩家: ${chess === '先手' ? 'X' : 'O'}`;
    } else {
        winner ? status = `获胜者: ${winner === '先手' ? '黑棋' : '白棋'}` : status = `下一位玩家: ${chess === '先手' ? '黑棋' : '白棋'}`;
    }
    return (
        <>
            <h1>{status}</h1>
            <div className= {goBangIsNext ? '' : 'chess-board'} >
                {border.map((row:number, rowIndex:number) => (
                    <div className= {goBangIsNext ? 'board-row' : 'chess-board-row'}  key={`row + ${rowIndex}`}>
                        {border.map((col:number, colIndex:number) => (
                            goBangIsNext
                                ?  <ChessType key={(rowIndex * 3) + colIndex} goBangIsNext={goBangIsNext} rowIndex={ rowIndex } colIndex={colIndex}  onPlay={onPlayChess}/>
                                :  <div className="chess-board-col" key={`col + ${colIndex}`}>
                                    <div className="chess-board-cell">
                                        <ChessType goBangIsNext={goBangIsNext} rowIndex={ rowIndex } colIndex={colIndex}  onPlay={onPlayChess}/>
                                    </div>
                                </div>
                        ))}

                    </div>
                ))}
            </div>
        </>

    );
};

export default ChessBoard;

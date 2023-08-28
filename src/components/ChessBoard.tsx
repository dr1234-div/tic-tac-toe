import React from 'react';
import Board from './wellChess/Board';
import ChessType from './goBang/ChessType';
import { ChessBoardType } from '../App.d';


/**
 *@description 用于渲染不同的棋盘
 */
const ChessBoard = (props:ChessBoardType) => {
    const { goBangIsNext, xIsNext, currentSquares, onPlayChess, chessStatus, border, playArr, onGoBangPlayChess } = props;
    if (goBangIsNext) {
        return <Board xIsNext={xIsNext} squares={currentSquares} onPlay={onPlayChess} />;
    }
    return (
        <>
            <h1 className='h1Style'>{chessStatus}</h1>
            <div className="chessboard">
                {border.map((row:number, rowIndex:number) => (
                    <div className="chessboardRow" key={`row + ${rowIndex}`}>
                        {border.map((col:number, colIndex:number) => (
                            <div className="chessboardCol" key={`col + ${colIndex}`}>
                                <div className="chessboardCell">
                                    <ChessType rowIndex={ rowIndex } colIndex={colIndex} playArr={playArr} onPlay={onGoBangPlayChess}/>
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

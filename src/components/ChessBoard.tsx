import React from 'react';
import Board from './wellChess/Board';
import { ChessBoardType } from '../App.d';
import GoBangBoard from './goBang/GoBangBoard';

/**
 *@description 用于渲染不同的棋盘
 */
const ChessBoard = (props:ChessBoardType) => {
    const { goBangIsNext, xIsNext, currentSquares, onPlayChess, chessStatus, border, playArr, onGoBangPlayChess } = props;
    if (goBangIsNext) {
        return <Board xIsNext={xIsNext} squares={currentSquares} onPlay={onPlayChess} />;
    }
    return <GoBangBoard border={border} newPlayArr={playArr} onPlayChess={onGoBangPlayChess} chessStatus={chessStatus}/>;
};

export default ChessBoard;

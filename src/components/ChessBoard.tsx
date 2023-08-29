import React from 'react';
import Board from './wellChess/Board';
import { ChessBoardType } from '../App.d';
import GoBangBoard from './goBang/GoBangBoard';

/**
 *@description 用于渲染不同的棋盘
 */
const ChessBoard = (props:ChessBoardType) => {
    const { goBangIsNext, chessStatus, border, playArr, isWinner, onPlayChess } = props;
    if (goBangIsNext) {
        return <Board border={border} xIsNext={chessStatus} squares={playArr} onPlay={onPlayChess} isWinner={isWinner}/>;
    }
    return <GoBangBoard border={border} newPlayArr={playArr} onPlayChess={onPlayChess} chessStatus={chessStatus} isWinner={isWinner}/>;
};

export default ChessBoard;

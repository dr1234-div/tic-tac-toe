// 文件数据类型

import { MouseEventHandler } from 'react';

// 井棋单元格自定义组件
export type SquareType = {
    value: string | null; onSquareClick: MouseEventHandler<HTMLButtonElement> | undefined;
};
export type playArrType = {
    row: number;
    col: number;
    chess: string;
}[];
export type ChessTypeProps = {
    rowIndex: number;
    colIndex: number;
    playArr: playArrType;
    onPlay: (rowIndex: number, colIndex: number) => void;
};

// 渲染历史记录跳转的组件数据类型
export type HistoryStepType = {
    history:{}[];
    onjumpTo:()=>void;
}
// 井棋棋盘自定义组件数据类型
export type BoardType = {
    xIsNext: boolean; squares: Array<null | string>; onPlay: (nextSquares: (string | null)[]) => void;
}
// 五子棋棋盘自定义组件数据类型
export type GoBangBoardType = {
    border: Array<T>;
    newPlayArr: playArrType;
    chessStatus:string;
    onPlayChess: (rowIndex: number, colIndex: number) => void;
}
// 棋盘自定义组件数据类型
export type ChessBoardType = {
    goBangIsNext: boolean;
    xIsNext: boolean;
    currentSquares: Array<null | string>;
    onPlayChess: (nextSquares: Array<null | string>) => void;
    chessStatus: string;
    border: Array<T>;
    playArr: playArrType;
    onGoBangPlayChess: (rowIndex: number, colIndex: number) => void;

}

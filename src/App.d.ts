// 井棋单元格自定义组件
export type SquareType = {
    value: string | null;
    rowIndex:number;
    colIndex:number;
    onSquareClick: (rowIndex: number, colIndex: number) => void;
    playArr:playArrType;
};
export type playArrType = {
    row: number;
    col: number;
    chess: string;
}[];
export type ChessTypeProps = {
    rowIndex: number;
    colIndex: number;
    goBangIsNext: boolean;
    onPlay: (rowIndex: number, colIndex: number) => void;
};

// 渲染历史记录跳转的组件数据类型
export type HistoryStepType = {
    history:{}[];
    onjumpTo:()=>void;
}
// 井棋棋盘自定义组件数据类型
export type BoardType = {
    xIsNext: string;
    squares: playArrType;
    border: Array<T>;
    onPlay: (rowIndex: number, colIndex: number) => void;
    winner:string;
}
// 五子棋棋盘自定义组件数据类型
export type GoBangBoardType = {
    border: Array<T>;
    newPlayArr: playArrType;
    chessStatus:string;
    onPlayChess: (rowIndex: number, colIndex: number) => void;
    winner:string;
}
// 棋盘自定义组件数据类型
export type ChessBoardType = {
    goBangIsNext: boolean;
    border: Array<T>;
    onPlayChess: (rowIndex: number, colIndex: number) => void;

}
// 切片的数据类型定义
export type sliceType = {
    chess: string;
    history: playArrType;
    winner: string;
    playArr: playArrType;
}

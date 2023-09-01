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
    xIsNext: string;
    squares: playArrType;
    border: Array<T>;
    onPlay: (rowIndex: number, colIndex: number) => void;
    isWinner:string;
}
// 五子棋棋盘自定义组件数据类型
export type GoBangBoardType = {
    border: Array<T>;
    newPlayArr: playArrType;
    chessStatus:string;
    onPlayChess: (rowIndex: number, colIndex: number) => void;
    isWinner:string;
}
// 棋盘自定义组件数据类型
export type ChessBoardType = {
    goBangIsNext: boolean;
    border: Array<T>;
    onPlayChess: (rowIndex: number, colIndex: number) => void;
    isWinner:string;
    chess: string;
}

export type StateType = {
    goBangIsNext: boolean;
    gameConfig: { chessBorder: number, winCount: number };
    chessArr: playArrType[];
};
// redux中的数据和方法，为connt提供类型
export type propType = {
    history: playArrType;
    isWinner: string;
    chess: string;
    playArr: playArrType;
    setHistory: (value: playArrType) => void;
    setPlayArr: (value: playArrType) => void;
    setChess: (value: string) => void;
    setIsWinner: (value: string) => void;

}
export type ChessStateType = {
    chessClass: {
        hasChess: string;
        noChess: string;
        chessType: string;
    };
}
// 切片的数据类型定义
export type sliceType = {
    chess: string;
    history: playArrType;
    isWinner: string;
    playArr: playArrType;
}

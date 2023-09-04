import React from 'react';
import { ChessTypeProps } from '../App.d';
import { useAppSelector } from '../myHooks/useReduxHooks';
/**
 *@param {number} rowIndex 棋子横坐标
 *@param {nummber} colIndex 棋子纵坐标
 @param {array} playArr 棋盘上已下棋子的数据数组，包含其横纵坐标以及该棋子的颜色
 @param {void} onPlay 下棋动作的监听回调
 * @return {*}
 */
const ChessType = (props: ChessTypeProps) => {
    const { rowIndex, colIndex, goBangIsNext, onPlay } = props;
    const playArr = useAppSelector((statue) => statue.playArr);
    const haveChess = playArr.find((item: { row: number, col: number, chess: string }) => item.row === rowIndex && item.col === colIndex);

    // 由棋子的样式
    let hasChessClass = '';
    // 无棋子的样式
    let noChessClass = '';
    // 棋子类型
    let chessType = '';

    if (goBangIsNext) {
        hasChessClass = 'square';
        noChessClass = 'square';
        chessType = haveChess?.chess === '先手' ? 'X' : 'O';
    } else {
        hasChessClass = haveChess?.chess === '先手' ? 'chess-board-cell-black' : 'chess-board-cell-white',
        noChessClass = 'chess-board-cell-click';
        chessType = '';
    }

    // 根据坐标判断当前位置是否已有棋子，若有根据chess来渲染黑棋或白棋，表示该区域无子，会渲染一个可点击区域，用来处理下棋逻辑
    if (haveChess) {
        return <div className={hasChessClass}>{chessType}</div>;
    }
    return (
        <div
            className={noChessClass}
            onClick={() => onPlay(rowIndex, colIndex)}
        ></div>
    );
};

export default ChessType;

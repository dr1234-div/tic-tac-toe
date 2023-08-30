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
const ChessType = (props:ChessTypeProps) => {
    const { rowIndex, colIndex, goBangIsNext, onPlay } = props;
    const playArr = useAppSelector((statue) => statue.playArr);
    const haveChess =  playArr.find((item: { row: number, col: number, chess: string }) => item.row === rowIndex && item.col === colIndex);
    // 棋子的配置项
    const chessClass = {
        hasChess: '',
        noChess: '',
        chessType: '',
    };
    if (goBangIsNext) {
        chessClass.hasChess = 'square';
        chessClass.noChess = 'square';
        chessClass.chessType = haveChess?.chess === '先手' ? 'X' : 'O';
    } else {
        chessClass.hasChess = haveChess?.chess === '先手' ? 'chess-board-cell-black' : 'chess-board-cell-white',
        chessClass.noChess = 'chess-board-cell-click';
        chessClass.chessType = '';
    }

    // 根据坐标判断当前位置是否已有棋子，若有根据chess来渲染黑棋或白棋，表示该区域无子，会渲染一个可点击区域，用来处理下棋逻辑
    if (haveChess) {
        return  <div className={chessClass.hasChess}>{chessClass.chessType}</div>;
    }
    return (
        <div
            className={chessClass.noChess}
            onClick={() => onPlay(rowIndex, colIndex)}
        ></div>
    );
};

export default ChessType;

import React from 'react';
import type { ChessTypeProps } from '../../App.d';
/**
 *@param {number} rowIndex 棋子横坐标
 *@param {nummber} colIndex 棋子纵坐标
 @param {array} playArr 棋盘上已下棋子的数据数组，包含其横纵坐标以及该棋子的颜色
 @param {void} onPlay 下棋动作的监听回调
 * @return {*}
 */
const ChessType = (props:ChessTypeProps) => {
    const { rowIndex, colIndex, playArr, onPlay } = props;
    const haoChess =  playArr.find((item: { row: number, col: number, chess: number }) => item.row === rowIndex && item.col === colIndex);
    // 根据坐标判断当前位置是否已有棋子，若有根据chess来渲染黑棋或白棋，表示该区域无子，会渲染一个可点击区域，用来处理下棋逻辑
    if (haoChess) {
        return haoChess?.chess === 1 ? (
            <div className="chessboardCell-black"></div>
        ) : (
            <div className="chessboardCell-white"></div>
        );
    }
    return (
        <div
            className="chessboardCell-click"
            onClick={() => onPlay(rowIndex, colIndex)}
        ></div>
    );
};

export default ChessType;

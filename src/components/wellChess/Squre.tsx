import React from 'react';
import type { SquareType } from '../../App.d';
/**
 * @param {SquareType} props value表示棋子类型(X/O),onSquareClick表示单元格点击事件
 * @return {node} 然会井棋棋盘上的单个单元格
 */
const Square = (props: SquareType) => {
    const { playArr, rowIndex, colIndex, onSquareClick } = props;

    const haveChess =  playArr.find((item: { row: number, col: number, chess: string }) => item.row === rowIndex && item.col === colIndex);
    // 根据坐标判断当前位置是否已有棋子，若有根据chess来渲染黑棋或白棋，表示该区域无子，会渲染一个可点击区域，用来处理下棋逻辑
    if (haveChess) {
        return  <button className={'square'}>{haveChess?.chess === '先手' ? 'X' : 'O'}</button>;
    }

    return (
        <button className={'square'} onClick={() => onSquareClick(rowIndex, colIndex)}></button>
    );
};
export default Square;

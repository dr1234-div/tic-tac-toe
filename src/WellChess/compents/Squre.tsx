import React, { MouseEventHandler } from 'react';

// 井棋单元格自定义组件
type SquareType = {
    value: string | null;
    onSquareClick: MouseEventHandler<HTMLButtonElement> | undefined;
}

/**
 * @param {SquareType} props value表示棋子类型(X/O),onSquareClick表示单元格点击事件
 * @return {node} 然会井棋棋盘上的单个单元格
 */
const Square = (props: SquareType) => {
    const { value, onSquareClick } = props;
    return (
        <button className={'square'} onClick={onSquareClick}>
            {value}
        </button>
    );
};
export default Square;

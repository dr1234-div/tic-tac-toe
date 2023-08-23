import React, { MouseEventHandler } from 'react';

// 井棋单元格自定义组件
type SquareType = {
    value: string | null;
    onSquareClick: MouseEventHandler<HTMLButtonElement> | undefined;
}
const Square = (props: SquareType) => {
    const { value, onSquareClick } = props;
    return (
        <button className={'square'} onClick={onSquareClick}>
            {value}
        </button>
    );
};
export default Square;

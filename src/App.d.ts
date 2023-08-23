// 文件数据类型

import { MouseEventHandler } from 'react';

// 井棋单元格自定义组件
type SquareType = {
    value: string; onSquareClick: MouseEventHandler<HTMLButtonElement> | undefined;
}

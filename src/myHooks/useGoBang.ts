import { useMemo, useState } from 'react';
import { playArrType } from '../App.d';

let isWinner = '';
/**
 * @description 对五子棋不共用的数据和方法进行封装
 */
const useGoBangIndex = (initialState: number) => {
    // 记录已下的棋子数据，包含横纵坐标以及棋子的颜色,是一个对象数组
    const [playArr, setPlayArr] = useState<playArrType>([]);
    // 存储下一个存储下一个棋子的类型
    const [chess, setChess] = useState<string>('先手');
    // 声明整个棋盘的布局坐标数组，会生成一个20*20的二维数组
    const chessArr = useMemo(() => {
        let arr = Array(20).fill('');
        arr = arr.map(() => Array(20).fill(''));
        return arr;
    }, []);

    /**
     * @param {number} row 棋子横坐标
     * @param {number} col 棋子纵坐标
     * @description 用于判断下一步位黑棋/白棋，同步更新下一步棋子的颜色代码、
     * 棋子活动的历史记录以及判断是否获胜
     */
    const play = (row: number, col: number) => {
        if (getWinner(playArr, chess, chessArr, row, col)) return;
        const newPlayArr = [...playArr, { row, col, chess }];
        setPlayArr(newPlayArr);
        const nextHistory = [...goBangHistory.slice(0, goBangCurrentMove + 1), { row, col, chess }];
        setGoBangHistory(nextHistory);
        const newChess = chess === '先手' ? '后手' : '先手';
        setChess(newChess);
        setGoBangCurrentMove(nextHistory.length - 1);
    };

    /**
     * @param {playArrType} playArr 当前棋盘上的棋子状态数组
     * @param {number} chess 下一个棋子的颜色代码（1/2）
     * @param {playArrType[]} chessArr
     * @param {number} row 当前棋子的横坐标
     * @param {number} col 当前棋子的纵坐标
     * @description 用户判断是否有一方获胜
     */
    const getWinner = (
        playArr: playArrType,
        chess: string,
        chessArr: playArrType[],
        row: number,
        col: number
    ) => {
        const directions = [
            // 水平方向
            [0, 1],
            // 垂直方向
            [1, 0],
            // 右斜方向
            [1, 1],
            // 左斜方向
            [-1, 1],
        ];
        playArr.map((item) => {
            return (chessArr[item.row][item.col] = { ...item });
        });
        for (const direction of directions) {
            const [dx, dy] = direction;
            let count = 1;

            // 向正方向遍历
            let newRowIndex = row + dx;
            let newColndex = col + dy;
            while (newRowIndex >= 0 && newRowIndex < chessArr.length && newColndex >= 0 && newColndex < chessArr.length && chessArr[newRowIndex][newColndex].chess === chess) {
                count++;
                newRowIndex += dx;
                newColndex += dy;
            }

            // 向负方向遍历
            newRowIndex = row - dx;
            newColndex = col - dy;
            while (newRowIndex >= 0 && newRowIndex < chessArr.length && newColndex >= 0 && newColndex < chessArr.length && chessArr[newRowIndex][newColndex].chess === chess) {
                count++;
                newRowIndex -= dx;
                newColndex -= dy;
            }
            // 判断是否连续有五个相同的棋子
            if (count >= 5) {
                // eslint-disable-next-line no-console
                console.log(chess);
                isWinner = '已获胜';
                return chess;
            }
        }
    };
    const [goBangCurrentMove, setGoBangCurrentMove] = useState(initialState);
    const [goBangHistory, setGoBangHistory] = useState<playArrType>([]);
    const goBangCurrentSquares = goBangHistory[goBangCurrentMove];
    /**
 *
 *
 * @param {number} rowIndex
 * @param {number} colIndex
 * @return {*}
 */
    function goBangPlayChess (rowIndex: number, colIndex: number) {
        if (isWinner === '已获胜') return;
        play(rowIndex, colIndex);
    }
    /**
         *
         *
         * @param {number} nextMove
         * @return {*}
         */
    function goBangJumpTo (nextMove: number) {
        // 获胜后将不能进行悔棋
        if (isWinner === '已获胜') {
            alert('注意：获胜后将无法进行悔棋！！！');
            return;
        }
        setGoBangCurrentMove(nextMove);
        const nextHistory = goBangHistory.slice(0, nextMove + 1);
        const lastFilterArr = nextHistory[nextHistory.length - 1];
        setChess(lastFilterArr.chess);
        setPlayArr(nextHistory);
    }

    return {
        goBangCurrentSquares,
        goBangCurrentMove,
        goBangHistory,
        playArr,
        chess,
        setChess,
        setPlayArr,
        setGoBangCurrentMove,
        setGoBangHistory,
        goBangPlayChess,
        goBangJumpTo,
    };
};
export default useGoBangIndex;

import { useMemo, useState } from 'react';
import { playArrType } from '../App.d';
/**
 *@description 自定义hook,抽离逻辑代码，防止组件臃肿，封装了下棋的动作监听回调以及游戏获胜的判断方法
 */
const useGoBang = () => {
    // 记录已下的棋子数据，包含横纵坐标以及棋子的颜色,是一个对象数组
    const [playArr, setPlayArr] = useState<playArrType>([]);
    // 存储下一个存储下一个棋子的颜色
    const [chess, setChess] = useState<number | null>();
    // 记录标题
    const [chessStatus, setChessStatus] = useState('下一位玩家：黑棋');
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
        if (chessStatus === '获胜者：黑棋' || chessStatus === '获胜者：白棋') return;
        setChessStatus(`下一位玩家: ${chess === 1 ? '黑棋' : '白棋'}`);
        const newChess = chess === 1 ? 2 : 1;
        const newplayArr = [...playArr, { row, col, chess: newChess }];
        setChess(newChess);
        setPlayArr(newplayArr);
        getWinner(newplayArr, newChess, chessArr, row, col);
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
        chess: number,
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
                setChessStatus(`获胜者：${chess === 1 ? '黑棋' : '白棋'}`);
                return;
            }
        }
    };

    return {
        playArr,
        chessStatus,
        setChessStatus,
        play,
        setPlayArr,
        setChess,
    };
};
export default useGoBang;

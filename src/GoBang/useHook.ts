import { useState } from 'react';

/**
 *@description 自定义hook,抽离逻辑代码，防止组件臃肿，封装了下棋的动作监听回调以及游戏获胜的判断方法
 */
const useHook = () => {
    type palyArrType = {
        row: number;
        col: number;
        chess: number;
    }[];

    // 记录已下的棋子数据，包含横纵坐标以及棋子的颜色,是一个对象数组
    const [palyArr, setpalyArr] = useState<palyArrType>([]);
    const [chess, setChess] = useState<number | null>(null);

    // 声明整个棋盘的布局坐标数组，会生成一个20*20的二维数组
    /* *[
['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',......
]
*/
    const [chessArr] = useState(() => {
        let arr = Array(20).fill('');
        arr = arr.map(() => Array(20).fill(''));
        return arr;
    });

    // 存储下一个棋子的颜色，用于渲染棋盘上的title
    const [chessman, setChessmMan] = useState<string>('首位：黑棋');

    /**
     * @param {number} row 棋子横坐标
     * @param {number} col 棋子纵坐标
     * @description 用于判断下一步位黑棋/白棋，同步更新下一步棋子的颜色代码、
     * 棋子活动的历史记录以及判断是否获胜
     */
    const play = (row: number, col: number) => {
        if (chessman === '获胜者：黑棋' || chessman === '获胜者：白棋') return;
        const newChess = chess === 1 ? 2 : 1;
        const newPalyArr = [...palyArr, { row, col, chess: newChess }];
        if (newChess === 2) {
            setChessmMan('下一位：黑棋');
        } else {
            setChessmMan('下一位：白棋');
        }
        setChess(newChess);
        setpalyArr(newPalyArr);
        getWinner(newPalyArr, newChess, chessArr, row, col);
    };

    /**
     * @param {palyArrType} palyArr 当前棋盘上的棋子状态数组
     * @param {number} chess 下一个棋子的颜色代码（1/2）
     * @param {palyArrType[]} chessArr
     * @param {number} row 当前棋子的横坐标
     * @param {number} col 当前棋子的纵坐标
     * @description 用户判断是否有一方获胜
     */
    const getWinner = (
        palyArr: palyArrType,
        chess: number,
        chessArr: palyArrType[],
        row: number,
        col: number
    ) => {
        //  这里chessArr原数组并不会发生变化，map生成的新数组是根据palyArr的变化来变化的
        palyArr.map((item) => {
            return (chessArr[item.row][item.col] = { ...item });
        });

        // 分别对 上下，左右，左斜，右斜 方向进行判断是否产生winner
        let colCount = 0;

        // 上下
        for (let colNumber = col + 1; colNumber < 20; colNumber++) {
            if (chessArr[row][colNumber].chess !== chess) break;
            colCount++;
        }
        for (let colNumber = col - 1; colNumber >= 0; colNumber--) {
            if (chessArr[row][colNumber].chess !== chess) break;
            colCount++;
        }
        if (colCount >= 4) {
            chess === 1 ? setChessmMan('获胜者：黑棋') : setChessmMan('获胜者：白棋');
            colCount = 0;
            return;
        }

        // 左右
        let rowCount = 0;
        for (let rowNumber = row + 1; rowNumber < 20; rowNumber++) {
            if (chessArr[rowNumber][col].chess !== chess) break;
            rowCount++;
        }
        for (let rowNumber = row - 1; rowNumber >= 0; rowNumber--) {
            if (chessArr[rowNumber][col].chess !== chess) break;
            rowCount++;
        }
        if (rowCount >= 4) {
            chess === 1 ? setChessmMan('获胜者：黑棋') : setChessmMan('获胜者：白棋');
            rowCount = 0;
            return;
        }

        // 左斜
        let leftObliqueCount = 0;
        for (
            let iNumber = row + 1, jNumber = col - 1;
            iNumber < 20 && jNumber >= 0;
            iNumber++, jNumber--
        ) {
            if (chessArr[iNumber][jNumber].chess !== chess) break;
            leftObliqueCount++;
        }
        for (
            let iNumber = row - 1, jNumber = col + 1;
            iNumber >= 0 && jNumber < 20;
            iNumber--, jNumber++
        ) {
            if (chessArr[iNumber][jNumber].chess !== chess) break;
            leftObliqueCount++;
        }
        if (leftObliqueCount >= 4) {
            chess === 1 ? setChessmMan('获胜者：黑棋') : setChessmMan('获胜者：白棋');
            leftObliqueCount = 0;
            return;
        }

        // 右斜
        let rightObliqueCount = 0;
        for (
            let iNumber = row + 1, jNumber = col + 1;
            iNumber < 20 && jNumber < 20;
            iNumber++, jNumber++
        ) {
            if (chessArr[iNumber][jNumber].chess !== chess) break;
            rightObliqueCount++;
        }
        for (
            let iNumber = row - 1, jNumber = col - 1;
            iNumber >= 0 && jNumber >= 0;
            iNumber--, jNumber--
        ) {
            if (chessArr[iNumber][jNumber].chess !== chess) break;
            rightObliqueCount++;
        }
        if (rightObliqueCount >= 4) {
            chess === 1 ? setChessmMan('获胜者：黑棋') : setChessmMan('获胜者：白棋');
            rightObliqueCount = 0;
            return;
        }
    };

    return {
        palyArr,
        chessman,
        setChessmMan,
        play,
        setpalyArr,
        setChess,
    };
};
export default useHook;

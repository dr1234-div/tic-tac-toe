import { useState } from 'react';
import { playArrType } from '../App.d';

/**
 * @description 游戏的数据与配置
 */
const useChessGame = () => {
    const [gameConfig, serGameConfig] = useState({
        chessBorder: 3,
        winCount: 3,
    });

    // 记录已下的棋子数据，包含横纵坐标以及棋子的颜色,是一个对象数组
    const [playArr, setPlayArr] = useState<playArrType>([]);
    // 存储下一个存储下一个棋子的类型
    const [chess, setChess] = useState<string>('先手');
    // 记录获胜方
    const [isWinner, setIsWinner] = useState('');
    // 记录棋盘状态
    const [chessArr, setChessArr] = useState(() => {
        let arr = Array(gameConfig.chessBorder).fill('');
        arr = arr.map(() => Array(gameConfig.chessBorder).fill(''));
        return arr;
    });
    const [currentMove, setCurrentMove] = useState(0);
    const [history, setHistory] = useState<playArrType>([]);

    /**
     * @param {number} row 棋子横坐标
     * @param {number} col 棋子纵坐标
     * @description 用于判断下一步位黑棋/白棋，同步更新下一步棋子的颜色代码、
     * 棋子活动的历史记录以及判断是否获胜
     */
    const play = (row: number, col: number) => {
        const newPlayArr = [...playArr, { row, col, chess }];
        setPlayArr(newPlayArr);
        const nextHistory = [...history.slice(0, currentMove + 1), { row, col, chess }];
        setHistory(nextHistory);
        const newChess = chess === '先手' ? '后手' : '先手';
        setChess(newChess);
        setCurrentMove(nextHistory.length - 1);
        getWinner(playArr, chess, chessArr, row, col);
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
        const updatedChessArr = Array.from(chessArr, (item) => [...item]);
        playArr.forEach((item) => {
            updatedChessArr[item.row][item.col] = { ...item };
        });

        for (const direction of directions) {
            const [dx, dy] = direction;
            let count = 1;

            // 向正方向遍历
            let newRowIndex = row + dx;
            let newColndex = col + dy;
            while (newRowIndex >= 0 && newRowIndex < updatedChessArr.length && newColndex >= 0 && newColndex < updatedChessArr.length && updatedChessArr[newRowIndex][newColndex].chess === chess) {
                count++;
                newRowIndex += dx;
                newColndex += dy;
            }

            // 向负方向遍历
            newRowIndex = row - dx;
            newColndex = col - dy;
            while (newRowIndex >= 0 && newRowIndex < updatedChessArr.length && newColndex >= 0 && newColndex < updatedChessArr.length && updatedChessArr[newRowIndex][newColndex].chess === chess) {
                count++;
                newRowIndex -= dx;
                newColndex -= dy;
            }
            // 判断是否连续有五个相同的棋子
            if (count >= gameConfig.winCount) {
                setIsWinner(chess);
                return chess;
            }
        }
    };
    /**
 *
 *
 * @param {number} rowIndex
 * @param {number} colIndex
 * @return {*}
 */
    function playChess (rowIndex: number, colIndex: number) {
        if (isWinner !== '') return;
        play(rowIndex, colIndex);
    }
    /**
         *
         *
         * @param {number} nextMove
         * @return {*}
         */
    function jumpTo (nextMove: number) {
        // 获胜后将不能进行悔棋
        if (isWinner !== '') {
            alert('注意：获胜后将无法进行悔棋！！！');
            return;
        }
        setCurrentMove(nextMove);
        const nextHistory = history.slice(0, nextMove + 1);
        const lastFilterChess = nextHistory[nextHistory.length - 1].chess === '先手' ? '后手' : '先手';
        setChess(lastFilterChess);
        setPlayArr(nextHistory);
    }

    return {
        history,
        playArr,
        chess,
        isWinner,
        gameConfig,
        serGameConfig,
        setChessArr,
        setIsWinner,
        setChess,
        setPlayArr,
        setCurrentMove,
        setHistory,
        playChess,
        jumpTo,
    };
};
export default useChessGame;

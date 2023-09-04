import { useState } from 'react';
import { playArrType } from '../App.d';
import { setHistory, setWinner, setChess, setPlayArr } from '../store/slice';
import { useAppDispatch, useAppSelector } from './useReduxHooks';

/**
 * @description 游戏的数据与配置
 */
const useChessGame = () => {
    const [gameConfig, serGameConfig] = useState({
        chessBorder: 3,
        winCount: 3,
    });

    const history = useAppSelector((statue) => statue.history);
    const winner = useAppSelector((statue) => statue.winner);
    const chess = useAppSelector((statue) => statue.chess);
    const playArr = useAppSelector((statue) => statue.playArr);
    const dispatch = useAppDispatch();

    // 记录棋盘状态
    const [chessArr, setChessArr] = useState(Array(3).fill('')
        .map(() => Array(3).fill('')));

    /**
     * @param {number} row 棋子横坐标
     * @param {number} col 棋子纵坐标
     * @description 用于判断下一步位黑棋/白棋，同步更新下一步棋子的颜色代码、
     * 棋子活动的历史记录以及判断是否获胜
     */
    const play = (row: number, col: number) => {
        if (winner !== '') return;
        dispatch(setPlayArr([...playArr, { row, col, chess }]));
        dispatch(setHistory([...playArr, { row, col, chess }]));
        const newChess = chess === '先手' ? '后手' : '先手';
        dispatch(setChess(newChess));
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
            while (newRowIndex >= 0 &&
                newRowIndex < updatedChessArr.length &&
                newColndex >= 0 &&
                newColndex < updatedChessArr.length &&
                updatedChessArr[newRowIndex][newColndex].chess === chess) {
                count++;
                newRowIndex += dx;
                newColndex += dy;
            }

            // 向负方向遍历
            newRowIndex = row - dx;
            newColndex = col - dy;
            while (newRowIndex >= 0 &&
                newRowIndex < updatedChessArr.length &&
                newColndex >= 0 &&
                newColndex < updatedChessArr.length &&
                updatedChessArr[newRowIndex][newColndex].chess === chess) {
                count++;
                newRowIndex -= dx;
                newColndex -= dy;
            }
            // 判断是否连续有五个相同的棋子
            if (count >= gameConfig.winCount) {
                dispatch(setWinner(chess));
                return chess;
            }
        }
    };

    /**
         *
         *
         * @param {number} nextMove
         * @return {*}
         */
    function jumpTo (nextMove: number) {
        // 获胜后将不能进行悔棋
        if (winner !== '') {
            alert('注意：获胜后将无法进行悔棋！！！');
            return;
        }
        const nextHistory = history.slice(0, nextMove + 1);
        const lastFilterChess = nextHistory[nextHistory.length - 1].chess === '先手' ? '后手' : '先手';
        dispatch(setChess(lastFilterChess));
        dispatch(setPlayArr(nextHistory));
    }

    return {
        gameConfig,
        serGameConfig,
        setChessArr,
        play,
        jumpTo,
    };
};
export default useChessGame;

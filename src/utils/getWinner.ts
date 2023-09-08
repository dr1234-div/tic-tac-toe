import lodash from 'lodash';
import { playArrType } from '../App.d';
import store from '../store';
import { setWinner } from '../store/slice';

/**
 * @description 游戏获胜的方法
 * @param {string} chess 棋子类型
 * @param {number} row 棋子横坐标
 * @param {number} col 棋子纵坐标
 * @param {playArrType[]} updatedChessArr 已更新的棋盘状态
 * @param {{ chessBorder: number, winCount: number }} gameConfig 当前游戏的棋盘相关配置
 */
export default (
    chess: string,
    row: number,
    col: number,
    updatedChessArr: playArrType[],
    gameConfig: { chessBorder: number, winCount: number },
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
            store.dispatch(setWinner(chess));
            return chess;
        }
        const flattenedArr = lodash.flattenDeep(updatedChessArr);
        if (lodash.compact(flattenedArr).length === gameConfig.chessBorder ** 2 && count < gameConfig.winCount) {
            store.dispatch(setWinner('平局'));
            return '平局';
        }
    }
};

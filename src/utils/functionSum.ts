import lodash from 'lodash';
import { playArrType } from '../App.d';
import store from '../store';
import { setChess, setHistory, setPlayArr, setWinner } from '../store/slice';
import { GameState } from './ticTacToeAI';

/**
 * @description 游戏获胜的方法
 * @param {string} chess 棋子类型
 * @param {number} row 棋子横坐标
 * @param {number} col 棋子纵坐标
 * @param {playArrType[]} updatedChessArr 已更新的棋盘状态
 * @param {{ chessBorder: number, winCount: number }} gameConfig 当前游戏的棋盘相关配置
 */
const getWinner = (
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

        // 遍历正反方向,具体来说index的初始值为-1，每次循环增加2，这样index的值在循环中依次为-1和1。这样就可以在两个方向上进行遍历
        for (let index = -1; index <= 1; index += 2) {
            let newRowIndex = row + (dx * index);
            let newColndex = col + (dy * index);
            while (newRowIndex >= 0 &&
                newRowIndex < updatedChessArr.length &&
                newColndex >= 0 &&
                newColndex < updatedChessArr.length &&
                updatedChessArr[newRowIndex][newColndex].chess === chess) {
                count++;
                newRowIndex += dx * index;
                newColndex += dy * index;
            }
        }
        // 判断是否连续有五个相同的棋子
        if (count === gameConfig.winCount) {
            store.dispatch(setWinner(chess));
            return chess;
        }
        // 判断是否平局
        const flattenedArr = lodash.flattenDeep(updatedChessArr);
        if (lodash.compact(flattenedArr).length === gameConfig.chessBorder ** 2 && count < gameConfig.winCount) {
            store.dispatch(setWinner('平局'));
            return '平局';
        }
    }
};

/**
     * @description 历史记录跳转动作
     * @param {number} nextMove 步骤号
     * @memberof App
     */
const jumpTo = (nextMove: number,) => {
    const { winner, history } = store.getState();
    // 获胜后将不能进行悔棋
    if (winner !== '') {
        alert('注意：游戏已结束，无法进行悔棋！！！');
        return;
    }
    const nextHistory = history.slice(0, nextMove + 1);
    store.dispatch(setPlayArr(nextHistory));
};

/**
     * @description 玩家下棋动作
     * @param {number} row 玩家棋子的横坐标
     * @param {number} col 玩家棋子的纵坐标
     * @memberof App
     */
const play = (
    row: number,
    col: number,
    newChessArr: playArrType[],
    gameConfig: {
        chessBorder: number;
        winCount: number;
    },
) => {
    const { winner, playArr, chess } = store.getState();
    if (winner !== '') return;
    const aiChessType = chess === '先手' ? '后手' : '先手';
    const newPlayArr = [...playArr, { row, col, chess }];
    const updatedChessArr = lodash.cloneDeep(newChessArr);
    newPlayArr.forEach((item) => {
        updatedChessArr[item.row][item.col] = { ...item };
    });
    store.dispatch(setPlayArr(newPlayArr));
    store.dispatch(setHistory(newPlayArr));

    const win = getWinner(chess, row, col, updatedChessArr, gameConfig);
    if (win) return;

    // ai 开始操作
    aiPlay(
        winner,
        newPlayArr,
        updatedChessArr,
        aiChessType,
        gameConfig,
        300
    );
};

/**
 * @param newPlayArr 已下棋子状态
 * @param aiChessType AI棋子类型
 * @param gameConfig 当前游戏配置
 * @description 实现AI下棋功能
 */
const aiPlay = (
    winner: string,
    newPlayArr: playArrType,
    newChessArr: playArrType[],
    aiChessType: string,
    gameConfig: { chessBorder: number, winCount: number },
    time: number
) => {
    setTimeout(() => {
        if (winner !== '') return;
        const gameState = new GameState(newPlayArr, aiChessType, gameConfig);
        gameState.computerDown();
        const updatedChessArr = lodash.cloneDeep(newChessArr);
        gameState.playArr.forEach((item) => {
            updatedChessArr[item.row][item.col] = { ...item };
        });
        store.dispatch(setPlayArr(gameState.playArr));
        store.dispatch(setHistory(gameState.playArr));
        getWinner(aiChessType, gameState.playArr[gameState.playArr.length - 1].row, gameState.playArr[gameState.playArr.length - 1].col, updatedChessArr, gameConfig);
    }, time);
};

/**
     * @description 选择游戏角色动作
     * @param {string} type 玩家角色（先手/后手）
     * @memberof App
     */
const handerAIChessTypeChange = (
    type: string,
    gameConfig: {
        chessBorder: number;
        winCount: number;
    },
    setChessArr: (value: playArrType[]) => void
) => {
    store.dispatch(setHistory([]));
    store.dispatch(setPlayArr([]));
    store.dispatch(setChess(type));
    store.dispatch(setWinner(''));
    setChessArr(Array(gameConfig.chessBorder).fill('')
        .map(() => Array(gameConfig.chessBorder).fill('')));
    // 井字棋AI先手最优位置
    if (type === '后手' && gameConfig.chessBorder === 3) {
        // // 定义坐标列表
        const coordinates = [{ row: 0, col: 0, chess: '先手' }, { row: 0, col: 2, chess: '先手' }, { row: 2, col: 0, chess: '先手' }, { row: 2, col: 2, chess: '先手' }];
        // 生成随机索引
        const randomIndex = Math.floor(Math.random() * coordinates.length);
        // 获取随机坐标
        const randomCoordinate = coordinates[randomIndex];
        store.dispatch(setPlayArr([randomCoordinate]));
        store.dispatch(setHistory([randomCoordinate]));
    }
    if (type === '后手' && gameConfig.chessBorder !== 3) {
        // 找出AI先手的最优位置
        setTimeout(() => {
            const gameState = new GameState([], '先手', gameConfig);
            gameState.computerDown();
            store.dispatch(setPlayArr(gameState.playArr));
            store.dispatch(setHistory(gameState.playArr));
        }, 200);
    }
};

export { getWinner, jumpTo, play, handerAIChessTypeChange, aiPlay };

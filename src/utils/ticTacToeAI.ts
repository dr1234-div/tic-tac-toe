import { playArrType, AIType } from '../App.d';
import lodash, { memoize } from 'lodash';
import store from '../store';
export class GameState {
    chessArr: playArrType[];
    playCheeType: string;
    depth: number;
    alpha: number;
    beta: number;
    player: string;
    row: number;
    col: number;
    playArr: playArrType;
    gameConfig: { chessBorder: number, winCount: number };
    choosenState: AIType | null;
    // 传入棋盘数组，当前玩家， depth, alpha, beta这些都为算法的参数
    constructor (
        playArr: playArrType,
        chessArr: playArrType[],
        aiChessType: string,
        gameConfig: { chessBorder: number, winCount: number },
        depth: number,
        alpha?: number,
        beta?: number
    ) {
        this.chessArr = chessArr;
        // 棋盘上已下棋子的数据记录
        this.playArr = playArr;
        // 该数据主要服务与获胜方法的判断
        this.playCheeType = playArr[playArr.length - 1].chess;
        // AI的棋子标记（先手还是后手）
        this.player = aiChessType;
        this.row = playArr[playArr.length - 1].row;
        this.col = playArr[playArr.length - 1].col;
        this.gameConfig = gameConfig;

        this.depth = depth;
        this.alpha = alpha || -Infinity;
        this.beta = beta || Infinity;

        this.choosenState = null;
    }
    /**
     * @return {*} AI算法的具体逻辑
     * @memberof GameState
     */
    getScore = memoize(() => {
        // 添加深度限制
        if (this.depth >= 100) {
            return 0;
        }
        // 获取AI代表的棋子类型
        const aiToken = store.getState().chess === '先手' ? '后手' : '先手';
        // 评估函数
        const winner = this.getWinner(
            this.playArr,
            this.playCheeType,
            this.chessArr,
            this.row,
            this.col
        );
        if (winner) {
            if (winner === '平局') return 0;
            //   AI获胜返回10
            if (winner === aiToken) return 10;
            //   AI没有获胜返回-10
            return -10;
        }
        const availablePos = lodash.shuffle(this.getAvailablePos());
        let maxScore = -1000;
        let minScore = 1000;
        let chosenState = null;

        for (let index = 0; index < availablePos.length; index++) {
            const { row, col } = availablePos[index];
            // 在给定的位置下子，生成一个新的棋盘
            const newChessArr = this.generateNewBoard({ row, col, chess: this.player });
            const newPlayArr = [...this.playArr, { row, col, chess: this.player }];
            // 生成一个新的节点
            const childState = new GameState(
                newPlayArr,
                newChessArr,
                changeTurn(this.player),
                this.gameConfig,
                this.depth + 1,
                this.alpha,
                this.beta,
            );
            const childScore: number = childState.getScore();
            // 求最大值
            if (this.player === aiToken) {
                if (childScore > maxScore) {
                    maxScore = childScore;
                    chosenState = childState;
                    this.alpha = maxScore;
                }
                if (this.alpha >= this.beta) {
                    // eslint-disable-next-line no-console
                    console.log('最大值跳出');
                    break;
                }
            } else {
                // 求最小值
                if (childScore < minScore) {
                    minScore = childScore;
                    chosenState = childState;
                    this.beta = minScore;
                }
                if (this.alpha >= this.beta) {
                    // eslint-disable-next-line no-console
                    console.log('最小值跳出');
                    break;
                }
            }
        }

        this.choosenState = chosenState;
        // eslint-disable-next-line no-console
        // console.log(this.choosenState);
        return this.player === aiToken ? maxScore : minScore;
    });

    // 五子棋计分表
    chessScore = (playerNum: number, computerNum: number) => {
        // 机器进攻

        // 1.既有人类落子，又有机器落子，判分为0
        if (playerNum > 0 && computerNum > 0) {
            return 0;
        }
        // 2.全部为空没有棋子，判分为7(14)
        if (playerNum === 0 && computerNum === 0) {
            return 14;
        }
        // 3.机器落一子，判分为35(70)
        if (computerNum === 1) {
            return 70;
        }
        // 4.机器落两子，判分为800(1600)
        if (computerNum === 2) {
            return 1600;
        }
        // 5.机器落三子，判分为15000(30000)
        if (computerNum === 3) {
            return 30000;
        }
        // 6.机器落四子，判分为800000(1600000)
        if (computerNum === 4) {
            return 1600000;
        }

        // 机器防守

        // 7.玩家落一子，判分为15(30)
        if (playerNum === 1) {
            return 30;
        }
        // 8.玩家落两子，判分为400(800)
        if (playerNum === 2) {
            return 800;
        }
        // 9.玩家落三子，判分为1800(3600)
        if (playerNum === 3) {
            return 3600;
        }
        // 10.玩家落四子，判分为100000(200000)
        if (playerNum === 4) {
            return 200000;
        }

        return -1; // 如果是其他情况，则出现错误，不会执行该段代码
    }
    // 获取最优位置
    computerDown = () => {
        // 克隆当前棋盘状态
        const initializeCheeArr = lodash.cloneDeep(this.chessArr);
        // 已下棋子的集合
        // const hasChessPlace = lodash.cloneDeep(this.playArr);
        // 当前游戏的配置
        const chessWidth = this.gameConfig.chessBorder;
        // 评分组(一个二维数组)
        const score = Array(chessWidth).fill([])
            .map(() => Array(chessWidth).fill(-1));
        // 五元组中黑棋(玩家)数量
        let playerNum = 0;
        // 五元组中白棋(电脑)数量
        let computerNum = 0;
        // 五元组临时得分
        let tempScore = 0;
        // 最大得分
        let maxScore = -1;

        // 横向寻找
        for (let row = 0; row < chessWidth; row++) {
            for (let col = 0; col < chessWidth - 4; col++) {
                for (let index = col; index < col + 5; index++) {
                    // 如果是玩家落得子
                    if (initializeCheeArr[index][row].chess && initializeCheeArr[index][row].chess === '先手') {
                        playerNum++;
                    } else if (initializeCheeArr[index][row].chess && initializeCheeArr[index][row].chess === '后手') {
                        computerNum++;
                    }
                }
                // 将每一个五元组中的黑棋和白棋个数传入评分表中
                tempScore = this.chessScore(playerNum, computerNum);
                // 为该五元组的每个位置添加分数
                for (let index = col; index < col + 5; index++) {
                    score[index][row] += tempScore;
                }
                // 清空五元组中棋子数量和五元组临时得分
                playerNum = 0;
                computerNum = 0;
                tempScore = 0;
            }
        }
        // 纵向寻找
        for (let row = 0; row < chessWidth; row++) {
            for (let col = 0; col < chessWidth - 4; col++) {
                for (let index = col; index < col + 5; index++) {
                    // 如果是玩家落得子
                    if (initializeCheeArr[row][index].chess && initializeCheeArr[row][index].chess === '先手') {
                        playerNum++;
                    } else if (initializeCheeArr[row][index].chess && initializeCheeArr[row][index].chess === '后手') {
                        computerNum++;
                    }
                }
                // 将每一个五元组中的黑棋和白棋个数传入评分表中
                tempScore = this.chessScore(playerNum, computerNum);
                // 为该五元组的每个位置添加分数
                for (let index = col; index < col + 5; index++) {
                    score[row][index] += tempScore;
                }
                // 清空五元组中棋子数量和五元组临时得分
                playerNum = 0;
                computerNum = 0;
                tempScore = 0;
            }
        }
        // 反斜线寻找
        // 反斜线上侧部分
        for (let row = chessWidth - 1; row >= 4; row--) {
            for (let index = row, col = 0; col < chessWidth && index >= 0; col++, index--) {
                let tempM = index;
                let tempN = col;
                for (;tempM > index - 5 && index - 5 >= -1; tempM--, tempN++) {
                    if (initializeCheeArr[tempM][tempN].chess && initializeCheeArr[tempM][tempN].chess === '先手') {
                        playerNum++;
                    } else if (initializeCheeArr[tempM][tempN].chess && initializeCheeArr[tempM][tempN].chess === '后手') {
                        computerNum++;
                    }
                }
                if (tempM === index - 5) {
                    tempScore = this.chessScore(playerNum, computerNum);
                    for (tempM = index, tempN = col; tempM > index - 5; tempM--, tempN++) {
                        score[tempM][tempN] += tempScore;
                    }
                }
                playerNum = 0;
                computerNum = 0;
                tempScore = 0;
            }
        }

        // 反斜线下侧部分
        for (let row = 1; row < 15; row++) {
            for (let index = row, col = chessWidth - 1; col >= 0 && index < 15; col--, index++) {
                let tempM = index;
                let tempN = col;
                for (; tempM < index + 5 && index + 5 <= 15; tempM++, tempN--) {
                    if (initializeCheeArr[tempM][tempN].chess && initializeCheeArr[tempM][tempN].chess === '先手') {
                        playerNum++;
                    } else if (initializeCheeArr[tempM][tempN].chess && initializeCheeArr[tempM][tempN].chess === '后手') {
                        computerNum++;
                    }
                }
                // 注意在斜向判断时，可能出现构不成五元组（靠近棋盘的四个顶角）的情况，所以要忽略这种情况
                if (tempM === index + 5) {
                    tempScore = this.chessScore(playerNum, computerNum);
                    for (tempM = index, tempN = col; tempM < index + 5; tempM++, tempN--) {
                        score[tempM][tempN] += tempScore;
                    }
                }
                playerNum = 0;
                computerNum = 0;
                tempScore = 0;
            }
        }
        // 正斜线寻找

        // 正斜线上侧部分
        for (let row = 0; row < chessWidth - 1; row++) {
            for (let index = row, col = 0; col < chessWidth && index < chessWidth; col++, index++) {
                let tempM = index;
                let tempN = col;
                for (; tempM < index + 5 && index + 5 <= 15; tempM++, tempN--) {
                    if (initializeCheeArr[tempM][tempN].chess && initializeCheeArr[tempM][tempN].chess === '先手') {
                        playerNum++;
                    } else if (initializeCheeArr[tempM][tempN].chess && initializeCheeArr[tempM][tempN].chess === '后手') {
                        computerNum++;
                    }
                }
                // 注意在斜向判断时，可能出现构不成五元组（靠近棋盘的四个顶角）的情况，所以要忽略这种情况
                if (tempM === index + 5) {
                    tempScore = this.chessScore(playerNum, computerNum);
                    for (tempM = index, tempN = col; tempM < index + 5; tempM++, tempN--) {
                        score[tempM][tempN] += tempScore;
                    }
                }
                playerNum = 0;
                computerNum = 0;
                tempScore = 0;
            }
        }
        // 正斜线下侧部分
        for (let row = 1; row < chessWidth - 4; row++) {
            for (let index = row, col = 0; col < chessWidth && index < chessWidth; col++, index++) {
                let tempM = index;
                let tempN = col;
                for (; tempM < index + 5 && index + 5 <= chessWidth; tempM++, tempN--) {
                    if (initializeCheeArr[tempM][tempN].chess && initializeCheeArr[tempM][tempN].chess === '先手') {
                        playerNum++;
                    } else if (initializeCheeArr[tempM][tempN].chess && initializeCheeArr[tempM][tempN].chess === '后手') {
                        computerNum++;
                    }
                }
                // 注意在斜向判断时，可能出现构不成五元组（靠近棋盘的四个顶角）的情况，所以要忽略这种情况
                if (tempM === index + 5) {
                    tempScore = this.chessScore(playerNum, computerNum);
                    for (tempM = index, tempN = col; tempM < index + 5; tempM++, tempN--) {
                        score[tempM][tempN] += tempScore;
                    }
                }
                playerNum = 0;
                computerNum = 0;
                tempScore = 0;
            }
        }
        // 从空位置中找到得分最大的位置
        for (let row = 0; row < chessWidth; row++) {
            for (let col = 0; col < chessWidth; col++) {
                if (initializeCheeArr[row][col] === '' && score[row][col] > maxScore) {
                    this.playArr.push({ row, col, chess: '后手' });
                    maxScore = score[row][row];
                }
            }
        }
    }


    // 游戏获胜的方法
    getWinner = (
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
            // 右下斜方向
            [1, -1],
            // 左下斜方向
            [-1, -1],
        ];
        // 声明新变量来接收，不会影响原始数据
        const updatedChessArr = lodash.cloneDeep(chessArr);
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
            if (count >= this.gameConfig.winCount) {
                return chess;
            }
            // 将二维数组变成一维数组
            const flattenedArr = lodash.flattenDeep(chessArr);
            if (lodash.compact(flattenedArr).length === this.gameConfig.chessBorder ** 2 && count < this.gameConfig.winCount) {
                return '平局';
            }
            if (lodash.compact(flattenedArr).length === this.gameConfig.chessBorder ** 2 && count >= this.gameConfig.winCount) {
                return chess;
            }
        }
    };
    /**
     * 找出当前仍可以下子的位置
     */
    getAvailablePos () {
        const result: Array<{ row: number, col: number }> = [];
        // 声明新变量来接收，不会影响原始数据
        const updatedChessArr = lodash.cloneDeep(this.chessArr);
        this.playArr.forEach((item) => {
            updatedChessArr[item.row][item.col] = { ...item };
        });
        for (let row = 0; row < updatedChessArr.length; row++) {
            for (let col = 0; col < updatedChessArr[row].length; col++) {
                if (!updatedChessArr[row][col]) {
                    result.push({ row, col });
                }
            }
        }
        return result;
    }

    /**
     * 给出一个位置，返回一个新的 board
     */
    generateNewBoard (chessValue: { row: number, col: number, chess: string }) {
        // 克隆一个棋盘副本
        const newChessArr = lodash.cloneDeep(this.chessArr);
        // 在对应的位置上渲染出当前玩家最新下的棋子
        newChessArr[chessValue.row][chessValue.col] = chessValue;
        // 返回每次玩家下棋后更新后的棋盘
        return newChessArr;
    }

    /**
   *`nextMove()` 方法的作用是确保每次移动都是在一个新的副本上进行的，以保持数据的一致性和可追溯性。
   * @memberof GameState
   */
    nextMove () {
        if (this.choosenState) {
            this.chessArr = lodash.cloneDeep(this.choosenState.chessArr);
            this.playArr = lodash.cloneDeep(this.choosenState.playArr);
            this.row = lodash.cloneDeep(this.choosenState.row);
            this.col = lodash.cloneDeep(this.choosenState.col);
            // eslint-disable-next-line no-console
            // console.log(this.chessArr);
        }
    }
}
/**
 * @param {string} player
 * @return {*} 做递归运算时用于更新player
 * @memberof GameState
 */
const changeTurn = (player: string) => {
    return player === '先手' ? '后手' : '先手';
};

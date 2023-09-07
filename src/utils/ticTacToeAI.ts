import { playArrType } from '../App.d';
import lodash from 'lodash';
// import store from '../store';
export class GameState {
    chessArr: playArrType[];
    playCheeType: string;
    playArr: playArrType;
    gameConfig: { chessBorder: number, winCount: number };
    maxScore:number;
    // 传入棋盘数组，当前玩家， depth, alpha, beta这些都为算法的参数
    constructor (
        playArr: playArrType,
        chessArr: playArrType[],
        gameConfig: { chessBorder: number, winCount: number },
    ) {
        this.chessArr = chessArr;
        // 棋盘上已下棋子的数据记录
        this.playArr = playArr;
        // 该数据主要服务与获胜方法的判断
        this.playCheeType = playArr[playArr.length - 1].chess;
        this.gameConfig = gameConfig;
        this.maxScore = -1;
    }
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
    };
    initializeChessScore = (chessBorder:number) => {
        const chessScore = Array(chessBorder)
            .fill([])
            .map(() => Array(chessBorder).fill('无棋子'));

        const initializeCheeArr = lodash.cloneDeep(this.playArr);
        initializeCheeArr.forEach((item) => {
            chessScore[item.row][item.col] = item.chess;
        });
        return chessScore;
    };
    // 获取最优位置
    computerDown = () => {
        // 当前游戏的配置
        const { chessBorder, winCount } = this.gameConfig;
        const score = Array(chessBorder)
            .fill([])
            .map(() => Array(chessBorder).fill(0));
        const chessPlace = this.initializeChessScore(chessBorder);

        // 五元组中黑棋(玩家)数量
        let playerNum = 0;
        // 五元组中白棋(电脑)数量
        let computerNum = 0;
        // 五元组临时得分
        let tempScore = 0;
        const AIChess = {
            row: -1,
            col: -1,
            chess: '后手',
        };

        // 横向寻找
        for (let row = 0; row < chessBorder; row++) {
            for (let col = 0; col < chessBorder - 4; col++) {
                for (let index = col; index < col + winCount; index++) {
                    // 如果是玩家落得子
                    if (
                        chessPlace[index][row] === '先手'
                    ) {
                        playerNum++;
                    } else if (
                        chessPlace[index][row] === '后手'
                    ) {
                        computerNum++;
                    }
                }
                // 将每一个五元组中的黑棋和白棋个数传入评分表中
                tempScore = this.chessScore(playerNum, computerNum);
                // 为该五元组的每个位置添加分数
                for (let index = col; index < col + winCount; index++) {
                    score[index][row] += tempScore;
                }
                // 清空五元组中棋子数量和五元组临时得分
                playerNum = 0;
                computerNum = 0;
                tempScore = 0;
            }
        }
        // 纵向寻找
        for (let row = 0; row < chessBorder; row++) {
            for (let col = 0; col < chessBorder - 4; col++) {
                for (let index = col; index < col + winCount; index++) {
                    // 如果是玩家落得子
                    if (
                        chessPlace[index][row] === '先手'
                    ) {
                        playerNum++;
                    } else if (
                        chessPlace[row][index] === '后手'
                    ) {
                        computerNum++;
                    }
                }
                // 将每一个五元组中的黑棋和白棋个数传入评分表中
                tempScore = this.chessScore(playerNum, computerNum);
                // 为该五元组的每个位置添加分数
                for (let index = col; index < col + winCount; index++) {
                    score[index][row] += tempScore;
                }
                // 清空五元组中棋子数量和五元组临时得分
                playerNum = 0;
                computerNum = 0;
                tempScore = 0;
            }
        }
        // 反斜线寻找
        // 反斜线上侧部分
        for (let row = chessBorder - 1; row >= 4; row--) {
            for (
                let index = row, col = 0;
                col < chessBorder && index >= 0;
                col++, index--
            ) {
                let tempM = index;
                let tempN = col;
                for (; tempM > index - winCount && index - winCount >= -1; tempM--, tempN++) {
                    if (
                        chessPlace[tempM][tempN] === '先手'
                    ) {
                        playerNum++;
                    } else if (
                        chessPlace[tempM][tempN] === '后手'
                    ) {
                        computerNum++;
                    }
                }
                if (tempM === index - winCount) {
                    tempScore = this.chessScore(playerNum, computerNum);
                    for (
                        tempM = index, tempN = col;
                        tempM > index - winCount;
                        tempM--, tempN++
                    ) {
                        score[tempM][tempN] += tempScore;
                    }
                }
                playerNum = 0;
                computerNum = 0;
                tempScore = 0;
            }
        }

        // 反斜线下侧部分
        for (let row = 1; row < chessBorder; row++) {
            for (
                let index = row, col = chessBorder - 1;
                col >= 0 && index < chessBorder;
                col--, index++
            ) {
                let tempM = index;
                let tempN = col;
                for (; tempM < index + winCount && index + winCount <= chessBorder; tempM++, tempN--) {
                    if (
                        chessPlace[tempM][tempN] === '先手'
                    ) {
                        playerNum++;
                    } else if (
                        chessPlace[tempM][tempN] === '后手'
                    ) {
                        computerNum++;
                    }
                }
                // 注意在斜向判断时，可能出现构不成五元组（靠近棋盘的四个顶角）的情况，所以要忽略这种情况
                if (tempM === index + winCount) {
                    tempScore = this.chessScore(playerNum, computerNum);
                    for (
                        tempM = index, tempN = col;
                        tempM < index + winCount;
                        tempM++, tempN--
                    ) {
                        score[tempM][tempN] += tempScore;
                    }
                }
                playerNum = 0;
                computerNum = 0;
                tempScore = 0;
            }
        }
        // 正斜线寻找

        // // 正斜线上侧部分
        for (let row = 0; row < chessBorder - 1; row++) {
            for (
                let index = row, col = 0;
                col < chessBorder && index < chessBorder;
                col++, index++
            ) {
                let tempM = index;
                let tempN = col;
                for (; tempM < index + winCount && index + winCount <= chessBorder; tempM++, tempN--) {
                    if (chessPlace[tempM][tempN] === '先手'
                    ) {
                        playerNum++;
                    } else if (
                        chessPlace[tempM][tempN] === '后手'
                    ) {
                        computerNum++;
                    }
                }
                // 注意在斜向判断时，可能出现构不成五元组（靠近棋盘的四个顶角）的情况，所以要忽略这种情况
                if (tempM === index + winCount) {
                    tempScore = this.chessScore(playerNum, computerNum);
                    for (
                        tempM = index, tempN = col;
                        tempM < index + winCount;
                        tempM++, tempN--
                    ) {
                        score[tempM][tempN] += tempScore;
                    }
                }
                playerNum = 0;
                computerNum = 0;
                tempScore = 0;
            }
        }
        // 正斜线下侧部分
        for (let row = 1; row < chessBorder - 4; row++) {
            for (
                let index = row, col = 0;
                col < chessBorder && index < chessBorder;
                col++, index++
            ) {
                let tempM = index;
                let tempN = col;
                for (
                    ;
                    tempM < index + winCount && index + winCount <= chessBorder;
                    tempM++, tempN--
                ) {
                    if (
                        chessPlace[tempM][tempN] === '先手'
                    ) {
                        playerNum++;
                    } else if (
                        chessPlace[tempM][tempN] === '后手'
                    ) {
                        computerNum++;
                    }
                }
                // 注意在斜向判断时，可能出现构不成五元组（靠近棋盘的四个顶角）的情况，所以要忽略这种情况
                if (tempM === index + winCount) {
                    tempScore = this.chessScore(playerNum, computerNum);
                    for (
                        tempM = index, tempN = col;
                        tempM < index + winCount;
                        tempM++, tempN--
                    ) {
                        score[tempM][tempN] += tempScore;
                    }
                }
                playerNum = 0;
                computerNum = 0;
                tempScore = 0;
            }
        }
        // 从空位置中找到得分最大的位置
        for (let row = 0; row < chessBorder; row++) {
            for (let col = 0; col < chessBorder; col++) {
                if (
                    chessPlace[row][col] === '无棋子' &&
                    score[row][col] > this.maxScore
                ) {
                    AIChess.row = row;
                    AIChess.col = col;
                    this.maxScore = score[row][col];
                }
            }
        }
        this.playArr = [...this.playArr, AIChess];
        // eslint-disable-next-line no-console
        // console.log(AIChess);
    };
}


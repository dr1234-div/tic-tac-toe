import { playArrType } from '../App.d';
import lodash from 'lodash';
export class GameStateAI {
    chessArr: playArrType[];
    playArr: playArrType;
    gameConfig: { chessBorder: number, winCount: number };
    // 传入棋盘数组，当前玩家， depth, alpha, beta这些都为算法的参数
    constructor (
        playArr: playArrType,
        chessArr: playArrType[],
        gameConfig: { chessBorder: number, winCount: number },
    ) {
        this.chessArr = chessArr;
        // 棋盘上已下棋子的数据记录
        this.playArr = playArr;
        this.gameConfig = gameConfig;
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
    // 获取最优位置
    computerDown = () => {
        // eslint-disable-next-line no-console
        // console.log('执行了');
        // 克隆当前棋盘状态
        const initializeCheeArr = lodash.cloneDeep(this.chessArr);
        // 当前游戏的配置
        const chessWidth = this.gameConfig.chessBorder;
        // 评分组(一个二维数组)
        const score = Array(chessWidth).fill([])
            .map(() => Array(chessWidth).fill(-1));
        // 最大得分
        let maxScore = -1;

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
        // 遍历棋盘上的所有位置
        for (let row = 0; row < chessWidth; row++) {
            for (let col = 0; col < chessWidth; col++) {
                // 对每个位置应用方向数组
                directions.forEach((direction, index) => {
                    const dx = direction[index];
                    const dy = direction[index];

                    let playerNum = 0;
                    let computerNum = 0;

                    // 判断是否能够构成五子连珠
                    for (let kIndex = 0; kIndex < 5; kIndex++) {
                        const xIndex = row + (kIndex * dx);
                        const yIndex = col + (kIndex * dy);

                        if (xIndex >= 0 && xIndex < chessWidth && yIndex >= 0 && yIndex < chessWidth) {
                            if (initializeCheeArr[xIndex][yIndex].chess === '先手') {
                                playerNum++;
                            } else if (initializeCheeArr[xIndex][yIndex].chess === '后手') {
                                computerNum++;
                            }
                        }
                    }
                    // 将每个位置的得分添加到评分表中
                    const tempScore = this.chessScore(playerNum, computerNum);
                    for (let kIndex = 0; kIndex < 5; kIndex++) {
                        const xIndex = row + (kIndex * dx);
                        const yIndex = col + (kIndex * dy);

                        if (xIndex >= 0 && xIndex < chessWidth && yIndex >= 0 && yIndex < chessWidth) {
                            score[xIndex][yIndex] += tempScore;
                        }
                    }
                });
            }
        }

        // 从空位置中找到得分最大的位置
        for (let row = 0; row < chessWidth; row++) {
            for (let col = 0; col < chessWidth; col++) {
                // eslint-disable-next-line no-console
                console.log(this.playArr);
                if (initializeCheeArr[row][col].chess === '先手' && score[row][col] > maxScore) {
                    this.playArr.push({ row, col, chess: '后手' });
                    // eslint-disable-next-line no-console
                    console.log(this.playArr);
                    maxScore = score[row][col];
                }
            }
        }
        // 横向寻找
        // for (let row = 0; row < chessWidth; row++) {
        //     for (let col = 0; col < chessWidth - 4; col++) {
        //         for (let index = col; index < col + 5; index++) {
        //             // 如果是玩家落得子
        //             if (initializeCheeArr[index][row].chess && initializeCheeArr[index][row].chess === '先手') {
        //                 playerNum++;
        //             } else if (initializeCheeArr[index][row].chess && initializeCheeArr[index][row].chess === '后手') {
        //                 computerNum++;
        //             }
        //         }
        //         // 将每一个五元组中的黑棋和白棋个数传入评分表中
        //         tempScore = this.chessScore(playerNum, computerNum);
        //         // 为该五元组的每个位置添加分数
        //         for (let index = col; index < col + 5; index++) {
        //             score[index][row] += tempScore;
        //         }
        //         // 清空五元组中棋子数量和五元组临时得分
        //         playerNum = 0;
        //         computerNum = 0;
        //         tempScore = 0;
        //     }
        // }
        // // 纵向寻找
        // for (let row = 0; row < chessWidth; row++) {
        //     for (let col = 0; col < chessWidth - 4; col++) {
        //         for (let index = col; index < col + 5; index++) {
        //             // 如果是玩家落得子
        //             if (initializeCheeArr[row][index].chess && initializeCheeArr[row][index].chess === '先手') {
        //                 playerNum++;
        //             } else if (initializeCheeArr[row][index].chess && initializeCheeArr[row][index].chess === '后手') {
        //                 computerNum++;
        //             }
        //         }
        //         // 将每一个五元组中的黑棋和白棋个数传入评分表中
        //         tempScore = this.chessScore(playerNum, computerNum);
        //         // 为该五元组的每个位置添加分数
        //         for (let index = col; index < col + 5; index++) {
        //             score[row][index] += tempScore;
        //         }
        //         // 清空五元组中棋子数量和五元组临时得分
        //         playerNum = 0;
        //         computerNum = 0;
        //         tempScore = 0;
        //     }
        // }
        // // 反斜线寻找
        // // 反斜线上侧部分
        // for (let row = chessWidth - 1; row >= 4; row--) {
        //     for (let index = row, col = 0; col < chessWidth && index >= 0; col++, index--) {
        //         let tempM = index;
        //         let tempN = col;
        //         for (tempM>index-5&&index-5>=-1)
        //     }
        // }
    };
}

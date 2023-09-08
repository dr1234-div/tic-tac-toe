import { playArrType } from '../App.d';
import lodash from 'lodash';
export class GameState {
    playCheeType: string;
    playArr: playArrType;
    gameConfig: { chessBorder: number, winCount: number };
    maxScore:number;
    constructor (
        playArr: playArrType,
        playCheeType:string,
        gameConfig: { chessBorder: number, winCount: number },
    ) {
        this.playArr = playArr;
        this.playCheeType = playCheeType;
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
    // 记录棋盘已下棋子
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
    // AI下棋动作
    computerDown = () => {
        const { chessBorder, winCount } = this.gameConfig;
        const score = Array(chessBorder).fill([])
            .map(() => Array(chessBorder).fill(0));
        const chessPlace = this.initializeChessScore(chessBorder);
        let AIChess = null;

        /**
         *@description 计算给定起始位置和增量的行列方向上的得分
         * @param {number} startRow 起始行索引
         * @param {number} startCol 起始列索引
         * @param {number} rowDelta 行增量
         * @param {number} colDelta 列增量
         */
        const calculateScore = (startRow: number, startCol: number, rowDelta: number, colDelta: number) => {
            let playerNum = 0;
            let computerNum = 0;
            let tempScore = 0;

            for (let index = 0; index < winCount; index++) {
                const row = startRow + (index * rowDelta);
                const col = startCol + (index * colDelta);

                if (chessPlace[row][col] === '先手') {
                    playerNum++;
                } else if (chessPlace[row][col] === '后手') {
                    computerNum++;
                }
            }

            tempScore = this.chessScore(playerNum, computerNum);

            for (let index = 0; index < winCount; index++) {
                const row = startRow + (index * rowDelta);
                const col = startCol + (index * colDelta);

                score[row][col] += tempScore;
            }
        };

        /** 根据棋盘上每个位置的得分获取最有位置
         */
        const findBestMove = () => {
            let maxScore = -Infinity;

            for (let row = 0; row < chessBorder; row++) {
                for (let col = 0; col < chessBorder; col++) {
                    if (chessPlace[row][col] === '无棋子' && score[row][col] > maxScore) {
                        maxScore = score[row][col];
                        AIChess = { row, col, chess: this.playCheeType };
                    }
                }
            }
        };

        // 横向寻找
        for (let row = 0; row < chessBorder; row++) {
            for (let col = 0; col < chessBorder - winCount + 1; col++) {
                calculateScore(row, col, 0, 1);
            }
        }

        // 纵向寻找
        for (let col = 0; col < chessBorder; col++) {
            for (let row = 0; row < chessBorder - winCount + 1; row++) {
                calculateScore(row, col, 1, 0);
            }
        }

        // 反斜线寻找
        for (let row = 0; row < chessBorder - winCount + 1; row++) {
            for (let col = 0; col < chessBorder - winCount + 1; col++) {
                calculateScore(row, col, 1, 1);
            }
        }

        // 正斜线寻找
        for (let row = winCount - 1; row < chessBorder; row++) {
            for (let col = 0; col < chessBorder - winCount + 1; col++) {
                calculateScore(row, col, -1, 1);
            }
        }

        findBestMove();

        if (AIChess) {
            this.playArr = [...this.playArr, AIChess];
        }
    };
}


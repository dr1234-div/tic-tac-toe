import { playArrType } from '../src/App.d';
import lodash from 'lodash';
export class GameState {
    board: any;
    currentPlayer: string;
    depth: any;
    choosenState: any;
    winner: boolean;
    alpha: any;
    beta: any;
    counter: number;
    aiChessType: any;
    row: any;
    col: any;
    props: { setWinner: any };
    state: { gameConfig: any };
    playArr: any;
    // 传入棋盘数组，当前玩家， depth, alpha, beta这些都为算法的参数
    constructor (playArr, chessArr, aiChessType, row, col, depth, alpha, beta) {
        // 每次下棋都会被更新，在main.js中获取
        this.board = chessArr;
        // 棋盘上已下棋子的数据记录
        this.playArr = playArr;
        // 当前玩家
        this.currentPlayer = playArr(-1).chess === '先手' ? 'O' : 'X';
        this.depth = depth;

        this.choosenState = null;
        this.winner = false;

        this.alpha = alpha || -Infinity;
        this.beta = beta || Infinity;

        this.counter = 0;
        // AI的棋子标记（先手还是后手）
        this.aiChessType = aiChessType;
        this.row = row;
        this.col = col;
    }
    /**
     *
     *
     * @return {*} AI算法的具体逻辑
     * @memberof GameState
     */
    getScore () {
        // 获取AI代表的棋子类型
        const aiToken = this.aiChessType;
        // 判断游戏是否获胜
        const winner = this.getWinner(
            this.playArr,
            this.currentPlayer,
            this.board,
            this.row,
            this.col
        );
        if (winner) {
            //   AI获胜返回10
            if (winner === aiToken) return 10;
            //   AI失败返回-10
            return -10;
        }

        // 到达了最大深度后的相应处理，这里未限制深度
        if (this.depth >= 100) {
            return 0;
        }

        // 获得所有可能的位置，利用 shuffle 加入随机性
        // 传入的参数为当前仍可以下子的位置
        const availablePos = lodash.shuffle(this.getAvailablePos());

        // 对于 max 节点，返回的是子节点中的最大值
        if (this.currentPlayer === aiToken) {
            let maxScore = -1000;

            for (let index = 0; index < availablePos.length; index++) {
                const pos = availablePos[index];
                // 在给定的位置下子，生成一个新的棋盘
                const newBoard = this.generateNewBoard(pos, this.currentPlayer);
                // 生成一个新的节点
                const childState = new GameState(
                    newBoard,
                    this.depth + 1,
                    this.alpha,
                    this.beta,
                    this.row,
                    this.col,
                    this.playArr,
                    this.aiChessType
                );
                // 执行AI算法
                const childScore:number = childState.getScore();

                if (childScore > maxScore) {
                    maxScore = childScore;
                    // 这里保存产生了最大的分数的节点，之后会被用于进行下一步
                    this.choosenState = childState;
                    this.alpha = maxScore;
                }
                // 如果满足了退出的条件，我们不需要继续搜索更多的节点了，退出循环
                if (this.alpha >= this.beta) {
                    break;
                }
            }
            // 返回max
            return maxScore;
        }
        // 对于 min 节点，返回的是子节点中的最小值，逻辑与获取max类似
        let minScore = 1000;

        for (let index = 0; index < availablePos.length; index++) {
            const pos = availablePos[index];
            const newBoard = this.generateNewBoard(pos, this.currentPlayer);

            const childState = new GameState(
                newBoard,
                this.depth + 1,
                this.alpha,
                this.beta,
                this.row,
                this.col,
                this.playArr,
                this.aiChessType
            );
            const childScore = childState.getScore();

            if (childScore < minScore) {
                minScore = childScore;
                this.choosenState = childState;
                this.beta = minScore;
            }

            if (this.alpha >= this.beta) {
                break;
            }
        }
        return minScore;
    }
    // 游戏获胜的方法
    getWinner = (
        playArr: playArrType,
        chess: string,
        chessArr: playArrType[],
        row: number,
        col: number
    ) => {
        const { setWinner } = this.props;
        const { gameConfig } = this.state;
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
        // 声明新变量来接收，不会影响原始数据
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
                setWinner(chess);
                return chess;
            }
        }
    };
    /**
     * 找出当前仍可以下子的位置
     */
    getAvailablePos () {
        const result = [];
        // 声明新变量来接收，不会影响原始数据
        const updatedChessArr = Array.from(chessArr, (item) => [...item]);
        playArr.forEach((item) => {
            updatedChessArr[item.row][item.col] = { ...item };
        });
        updatedChessArr.forEach((ele, index) => {
            if (!ele) {
                result.push(index);
            }
        });
        return result;
    }

    /**
     * 给出一个位置，返回一个新的 board
     */
    generateNewBoard (pos, player) {
        // 克隆一个棋盘副本
        const newChessArr = lodash.clone(this.board);
        // 在对应的位置上渲染出当前玩家最新下的棋子
        newBoard[pos] = { row: this.row, col: this.col, chess: player };
        // 返回每次玩家下棋后更新后的棋盘
        return newChessArr;
    }

    /**
   *`nextMove()` 方法的作用是将选定状态的棋盘克隆到当前组件的 `board` 属性中。具体来说，
   它使用了 Lodash 库的 `_.clone()` 方法来创建一个选定状态的棋盘的副本，然后将该副本赋值给组件的 `board` 属性。
   这个方法的目的是为了在进行下一步移动之前，确保当前组件的 `board` 属性与选定状态的棋盘一致。通过克隆棋盘，可以避免直接修改选定状态的棋盘，
   从而确保每次移动都是在一个新的副本上进行的，以保持数据的一致性和可追溯性。
   * @memberof GameState
   */
    nextMove () {
        this.board = lodash.clone(this.choosenState.board);
    }
}

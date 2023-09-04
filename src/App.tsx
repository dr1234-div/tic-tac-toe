import React, { Component } from 'react';
import './App.css';
import ChessBoard from './components/ChessBoard';
import { setHistory, setWinner, setChess, setPlayArr } from './store/slice';
import { StateType, playArrType, propType } from './App.d';
import { connect } from 'react-redux';

interface App {
    state: StateType;
    props:propType;
}

class App extends Component<propType> {
    // 声明状态
    constructor (props:propType) {
        super(props);
        this.state = {
            goBangIsNext: true,
            gameConfig: {
                chessBorder: 3,
                winCount: 3,
            },
            chessArr: Array(3).fill('')
                .map(() => Array(3).fill('')),
        };
    }
    // 修改goBangIsNext的方法
    setGoBangIsNext = () => {
        this.setState({ goBangIsNext: !this.state.goBangIsNext });
    };
    // 修改游戏配置的方法
    serGameConfig = (value:{chessBorder:number, winCount:number}) => {
        this.setState({ gameConfig: value });
    };
    // 修改棋盘状态的方法
    setChessArr = (value: playArrType[]) => {
        this.setState({ chessArr: value });
    };
    // 下棋的回调
    play = (row: number, col: number) => {
        const { winner, playArr, chess, setPlayArr, setHistory, setChess } = this.props;
        const { chessArr } = this.state;
        if (winner !== '') return;
        setPlayArr([...playArr, { row, col, chess }]);
        setHistory([...playArr, { row, col, chess }]);
        const newChess = chess === '先手' ? '后手' : '先手';
        setChess(newChess);
        this.getWinner(playArr, chess, chessArr, row, col);
    };
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
    // 历史记录的跳转方式
    jumpTo = (nextMove: number) => {
        const { winner,  history, setPlayArr,  setChess } = this.props;
        // 获胜后将不能进行悔棋
        if (winner !== '') {
            alert('注意：获胜后将无法进行悔棋！！！');
            return;
        }
        const nextHistory = history.slice(0, nextMove + 1);
        const lastFilterChess = nextHistory[nextHistory.length - 1].chess === '先手' ? '后手' : '先手';
        setChess(lastFilterChess);
        setPlayArr(nextHistory);
    };
    // 切换游戏后对游戏相关数据进行初始化
    gameChange = (goBangIsNext: boolean) => {
        const { setPlayArr, setHistory, setChess, setWinner } = this.props;
        const changeGameConfig = goBangIsNext === true ? { chessBorder: 20, winCount: 5 } : { chessBorder: 3, winCount: 3 };
        setChess('先手');
        setWinner('');
        this.setChessArr(Array(changeGameConfig.chessBorder).fill('')
            .map(() => Array(changeGameConfig.chessBorder).fill('')));
        this.setGoBangIsNext();
        this.serGameConfig(changeGameConfig);
        setHistory([]);
        setPlayArr([]);
    };

    render () {
        const { goBangIsNext, gameConfig } = this.state;
        const { history } = this.props;
        return (
            <div className="chess-board-wapper">
                <div>
                    <ChessBoard
                        goBangIsNext={goBangIsNext}
                        border={Array(gameConfig.chessBorder).fill(null)}
                        onPlayChess={this.play}
                    />
                </div>
                {/* 相同点 */}
                <div className='chess-board-right'>
                    <div>
                        <button className='game-change' onClick={() => this.gameChange(goBangIsNext)}>{goBangIsNext ? '五子棋游戏' : '井棋游戏'}</button>
                    </div>
                    <div className='state-content'>
                        <ul className="ul-style">{history.map((__, move: number) => {
                            return (
                                <li key={move}>
                                    <button onClick={() => this.jumpTo(move)}>{`跳转到步骤：${Number(move + 1)}`}</button>
                                </li>
                            );
                        })}</ul>
                    </div>
                </div>
            </div>
        );
    }
}

/**
 * @param {*} state
 * @return {*}
 */
const mapStateToProps = (state:propType) => {
    return {
        history: state.history,
        winner: state.winner,
        chess: state.chess,
        playArr: state.playArr,
    };
};

/**
 * @param {*} dispatch
 * @return {*}
 */
const mapDispatchToProps =  { setHistory, setPlayArr, setChess, setWinner };
export default  connect(mapStateToProps, mapDispatchToProps)(App);

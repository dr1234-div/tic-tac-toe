import React, { Component } from 'react';
import './App.css';
import ChessBoard from './components/ChessBoard';
import { setHistory } from './store/slice/historySlice';
import { setIsWinner } from './store/slice/isWinnerSlice';
import { setChess } from './store/slice/chessSlice';
import { setPlayArr } from './store/slice/playArrSlice';
import { StateType, playArrType, propType } from './App.d';
import { connect } from 'react-redux';


interface App {
    state: StateType;
    props:propType;
}

class App extends Component {
    // 声明状态
    constructor (props:propType) {
        super(props);
        this.state = {
            goBangIsNext: true,
            gameConfig: {
                chessBorder: 3,
                winCount: 3,
            },
            chessArr: Array(20).fill('')
                .map(() => Array(20).fill('')),
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
        if (this.props.isWinner !== '') return;
        // 创建一个新数组传给setPlayArr，如果直接传递，则地址相同只会接收新棋子的状态
        const newPlayArr = [...this.props.playArr, { row, col, chess: this.props.chess }].slice();
        this.props.setPlayArr(newPlayArr);
        this.props.setHistory(newPlayArr);
        const newChess = this.props.chess === '先手' ? '后手' : '先手';
        this.props.setChess(newChess);
        this.getWinner(this.props.playArr, this.props.chess, this.state.chessArr, row, col);
    };
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
            if (count >= this.state.gameConfig.winCount) {
                this.props.setIsWinner(chess);
                return chess;
            }
        }
    };
    // 历史记录的跳转方式
    jumpTo = (nextMove: number) => {
        // 获胜后将不能进行悔棋
        if (this.props.isWinner !== '') {
            alert('注意：获胜后将无法进行悔棋！！！');
            return;
        }
        const nextHistory = this.props.history.slice(0, nextMove + 1);
        const lastFilterChess = nextHistory[nextHistory.length - 1].chess === '先手' ? '后手' : '先手';
        this.props.setChess(lastFilterChess);
        this.props.setPlayArr(nextHistory);
    };
    // 切换游戏后对游戏相关数据进行初始化
    gameChange = (goBangIsNext: boolean) => {
        const changeGameConfig = goBangIsNext === true ? { chessBorder: 20, winCount: 5 } : { chessBorder: 3, winCount: 3 };
        this.props.setChess('先手');
        this.props.setIsWinner('');
        this.setChessArr(Array(20).fill('')
            .map(() => Array(20).fill('')));
        this.setGoBangIsNext();
        this.serGameConfig(changeGameConfig);
        this.props.setHistory([]);
        this.props.setPlayArr([]);
    };

    render () {
        return (
            <div className="chess-board-wapper">
                <div>
                    <ChessBoard
                        goBangIsNext={this.state.goBangIsNext}
                        border={Array(this.state.gameConfig.chessBorder).fill(null)}
                        onPlayChess={this.play}
                    />
                </div>
                {/* 相同点 */}
                <div className='chess-board-right'>
                    <div>
                        <button className='game-change' onClick={() => this.gameChange(this.state.goBangIsNext)}>{this.state.goBangIsNext ? '五子棋游戏' : '井棋游戏'}</button>
                    </div>
                    <div className='state-content'>
                        <ul className="ul-style">{this.props.history.map((__, move: number) => {
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
        isWinner: state.isWinner,
        chess: state.chess,
        playArr: state.playArr,
    };
};

/**
 * @param {*} dispatch
 * @return {*}
 */
const mapDispatchToProps =  { setHistory, setPlayArr, setChess, setIsWinner };
export default  connect(mapStateToProps, mapDispatchToProps)(App  as React.ComponentClass<propType>);

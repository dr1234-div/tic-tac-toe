import React, { Component } from 'react';
import './App.css';
import ChessBoard from './components/ChessBoard';
import { setHistory, setWinner, setChess, setPlayArr } from './store/slice';
import { StateType, playArrType, propType } from './App.d';
import { connect } from 'react-redux';
import { GameState } from './utils/ticTacToeAI';
import lodash from 'lodash';
import GAME_CONFIG from './utils/gameConfig';
import getWinner from './utils/getWinner';

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
            gameConfig: GAME_CONFIG[0],
            chessArr: Array(GAME_CONFIG[0].chessBorder).fill('')
                .map(() => Array(GAME_CONFIG[0].chessBorder).fill('')),
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

    /**
     * @description 玩家下棋动作
     * @param {number} row 玩家棋子的横坐标
     * @param {number} col 玩家棋子的纵坐标
     * @memberof App
     */
    play = (row: number, col: number) => {
        const { winner, playArr, chess, setPlayArr, setHistory } = this.props;
        const { gameConfig, chessArr } = this.state;
        if (winner !== '') return;
        const aiChessType = chess === '先手' ? '后手' : '先手';
        const newPlayArr = [...playArr, { row, col, chess }];
        const updatedChessArr = lodash.cloneDeep(chessArr);
        newPlayArr.forEach((item) => {
            updatedChessArr[item.row][item.col] = { ...item };
        });
        this.setChessArr(updatedChessArr);
        setPlayArr(newPlayArr);
        setHistory(newPlayArr);

        const win =  getWinner(chess, row, col, updatedChessArr, gameConfig);
        if (win) return;

        // ai 开始操作
        setTimeout(() => {
            if (winner !== '') return;
            const gameState = new GameState(newPlayArr, aiChessType, gameConfig);
            gameState.computerDown();
            const updatedChessArr = lodash.cloneDeep(chessArr);
            gameState.playArr.forEach((item) => {
                updatedChessArr[item.row][item.col] = { ...item };
            });
            this.setChessArr(updatedChessArr);
            setPlayArr(gameState.playArr);
            setHistory(gameState.playArr);
            getWinner(aiChessType, gameState.playArr[gameState.playArr.length - 1].row, gameState.playArr[gameState.playArr.length - 1].col, updatedChessArr, gameConfig);
        }, 300);
    };

    /**
     * @description 历史记录跳转动作
     * @param {number} nextMove 步骤号
     * @memberof App
     */
    jumpTo = (nextMove: number) => {
        const { chess, winner,  history, setPlayArr } = this.props;
        const { gameConfig, chessArr } = this.state;
        // 获胜后将不能进行悔棋
        if (winner !== '') {
            alert('注意：游戏已结束，无法进行悔棋！！！');
            return;
        }
        const nextHistory = history.slice(0, nextMove + 1);
        // 获取应该下棋的角色
        const lastFilterChess = nextHistory[nextHistory.length - 1].chess === '先手' ? '后手' : '先手';
        // 判断当前应该下棋的角色是不是玩家角色
        if (lastFilterChess !== chess) {
            setTimeout(() => {
                if (winner !== '') return;
                const gameState = new GameState(nextHistory, lastFilterChess, gameConfig);
                gameState.computerDown();
                const updatedChessArr = lodash.cloneDeep(chessArr);
                gameState.playArr.forEach((item) => {
                    updatedChessArr[item.row][item.col] = { ...item };
                });
                this.setChessArr(updatedChessArr);
                setPlayArr(gameState.playArr);
                setHistory(gameState.playArr);
                getWinner(lastFilterChess, gameState.playArr[gameState.playArr.length - 1].row, gameState.playArr[gameState.playArr.length - 1].col, updatedChessArr, gameConfig);
            }, 0);
        }
        setPlayArr(nextHistory);
    };


    /**
     * @description 切换游戏后对游戏相关数据进行初始化
     * @param {boolean} goBangIsNext 下一个又是是否时五子棋
     * @memberof App
     */
    gameChange = (goBangIsNext: boolean) => {
        const { setPlayArr, setHistory, setChess, setWinner } = this.props;
        const changeGameConfig = goBangIsNext ? GAME_CONFIG[1] : GAME_CONFIG[0];
        setChess('先手');
        setWinner('');
        this.setChessArr(Array(changeGameConfig.chessBorder).fill('')
            .map(() => Array(changeGameConfig.chessBorder).fill('')));
        this.setGoBangIsNext();
        this.serGameConfig(changeGameConfig);
        setHistory([]);
        setPlayArr([]);
    };


    /**
     * @description 选择游戏角色动作
     * @param {string} type 玩家角色（先手/后手）
     * @memberof App
     */
    handerAIChessTypeChange = (type:string) => {
        const { setChess, setPlayArr, setHistory, setWinner } = this.props;
        const { gameConfig } = this.state;
        setHistory([]);
        setPlayArr([]);
        setChess(type);
        setWinner('');
        this.setChessArr(Array(gameConfig.chessBorder).fill('')
            .map(() => Array(gameConfig.chessBorder).fill('')));
        if (type === '后手') {
            setTimeout(() => {
                const gameState = new GameState([], '先手', gameConfig);
                gameState.computerDown();
                setPlayArr(gameState.playArr);
                setHistory(gameState.playArr);
            }, 300);
        }
    };

    render () {
        const { goBangIsNext, gameConfig } = this.state;
        const { history, chess } = this.props;
        let status = ['', ''];
        if (goBangIsNext) {
            status = ['X', 'O'];
        } else {
            status = ['黑棋', '白棋'];
        }
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
                        <button className='game-change' onClick={() => this.gameChange(goBangIsNext)}>{goBangIsNext ? '切换至五子棋游戏' : '切换至井棋游戏'}</button>
                    </div>
                    <div className='state-content add-scroll'>
                        <ul className="ul-style"> {history.map((__, move: number) => {
                            let player = '';
                            if (chess === '先手') {
                                player = move % 2 === 0 ? '玩家' : 'AI';
                            } else {
                                player = move % 2 === 0 ? 'AI' : '玩家';
                            }

                            return (
                                <li key={move}>
                                    <button className='button-width' onClick={() => this.jumpTo(move)}>{`跳转到步骤：${Number(move + 1)} (${player})`}</button>
                                </li>
                            );
                        })}</ul>
                    </div>
                </div><div className='chess-board-right'>
                    <div><h1>请选择您的角色</h1></div>
                    <div className='state-content'>
                        <div>
                            <input type="radio" id='sub-sequent-holder-ai' name='ai' value='sub-sequent-holder-ai' checked={chess === '先手'} onChange={() => this.handerAIChessTypeChange('先手')}/>
                            <label htmlFor='sub-sequent-holder-ai'>选择 {status[0]}，AI后手</label>
                        </div>
                        <div className='choose-style'>
                            <input type='radio' id='on-move-ai' name='ai' value='on-move-ai' checked={chess === '后手'}  onChange={() => this.handerAIChessTypeChange('后手')}/>
                            <label htmlFor='on-move-ai'>选择 {status[1]}，AI先手</label>
                        </div>
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

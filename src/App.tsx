
import './App.css';
import useChessGame from './myHooks/useChessGame';
import { useState } from 'react';
import ChessBoard from './components/ChessBoard';
import { useAppDispatch, useAppSelector } from './myHooks/useReduxHooks';
import { setHistory, setWinner, setChess, setPlayArr } from './store/slice';

/**
 *@description 根节点，默认井棋游戏
 */
const App = () => {
    const { gameConfig, serGameConfig, setChessArr, play, jumpTo } = useChessGame();
    const history = useAppSelector((statue) => statue.history);
    const dispatch = useAppDispatch();
    const [goBangIsNext, setGoBangIsNext] = useState<boolean>(true);

    const border = Array(gameConfig.chessBorder).fill(null);

    const Moves = history.map((__, move: number) => {
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{`跳转到步骤：${Number(move + 1)}`}</button>
            </li>
        );
    });

    /**
     *@description 切换游戏后对游戏相关数据进行初始化
     */
    const gameChange = (goBangIsNext: boolean) => {
        const changeGameConfig = goBangIsNext === true ? { chessBorder: 20, winCount: 5 } : { chessBorder: 3, winCount: 3 };
        dispatch(setChess('先手'));
        dispatch(setWinner(''));
        setChessArr(Array(changeGameConfig.chessBorder).fill('')
            .map(() => Array(changeGameConfig.chessBorder).fill('')));
        setGoBangIsNext(!goBangIsNext);
        serGameConfig(changeGameConfig);
        dispatch(setHistory([]));
        dispatch(setPlayArr([]));
    };

    return (
        <div className="chess-board-wapper">
            <div >
                <ChessBoard
                    goBangIsNext={goBangIsNext}
                    border={border}
                    onPlayChess={play}
                />
            </div>
            {/* 相同点 */}
            <div className='chess-board-right'>
                <div>
                    <button className='game-change' onClick={() => gameChange(goBangIsNext)}>{goBangIsNext ? '五子棋游戏' : '井棋游戏'}</button>
                </div>
                <div className='state-content'>
                    <ul className="ul-style">{Moves}</ul>
                </div>
            </div>
        </div>
    );
};

export default App;

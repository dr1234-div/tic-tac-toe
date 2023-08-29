
import './App.css';
import useChessGame from './myHooks/useChessGame';
import { useState } from 'react';
import ChessBoard from './components/ChessBoard';

/**
 *@description 根节点，默认井棋游戏
 */
const App = () => {
    const { history, chess, isWinner,  playArr, gameConfig, serGameConfig, setIsWinner, setChessArr, setChess,  setPlayArr, setHistory, playChess, jumpTo } = useChessGame();

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
        setChess('先手');
        setIsWinner('');
        setChessArr(() => {
            let arr = Array(changeGameConfig.chessBorder).fill('');
            arr = arr.map(() => Array(changeGameConfig.chessBorder).fill(''));
            return arr;
        });
        setGoBangIsNext(!goBangIsNext);
        serGameConfig(changeGameConfig);
        setHistory([]);
        setPlayArr([]);
    };

    return (
        <div className="chess-board-wapper">
            <div >
                <ChessBoard
                    goBangIsNext={goBangIsNext}
                    chessStatus={chess}
                    border={border}
                    playArr={playArr}
                    onPlayChess={playChess}
                    isWinner={isWinner}
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

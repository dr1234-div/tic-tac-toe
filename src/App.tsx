
import './App.css';
import useWellChessIndex from './myHooks/useWellChess';
import useGoBangIndex from './myHooks/useGoBang';
import { useState } from 'react';
import ChessBoard from './components/ChessBoard';

// 提出来，避免重复计算带来性能消耗
const border = Array(20).fill(null);

/**
 *@description 根节点，默认井棋游戏
 */
const App = () => {
    const { currentSquares, currentMove, history, setHistory, setCurrentMove, playChess, jumpTo } = useWellChessIndex(0);
    // 判断下一步是否是X
    const xIsNext = currentMove % 2 === 0;
    const { goBangHistory, chessStatus, playArr, setChessStatus, setChess, setPlayArr, setGoBangHistory, goBangPlayChess, goBangJumpTo } = useGoBangIndex(0);
    const [goBangIsNext, setGoBangIsNext] = useState<boolean>(true);

    // 渲染棋子历史记录跳转按钮
    const moves = history.map((__, move: number) => {
        let description;
        if (move > 0) {
            description = `跳转到步骤：${move}`;
        } else {
            description = '开始游戏';
        }
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });

    const goBangMoves = goBangHistory.map((__, move: number) => {
        return (
            <li key={move}>
                <button onClick={() => goBangJumpTo(move)}>{`跳转到步骤：${Number(move + 1)}`}</button>
            </li>
        );
    });

    /**
     *@description 切换游戏后对游戏相关数据进行初始化
     */
    const gameChange = (goBangIsNext:boolean) => {
        setGoBangIsNext(!goBangIsNext);
        setCurrentMove(0);
        setHistory([Array(9).fill(null)]);
        setGoBangHistory([]);
        setChessStatus('下一位玩家：黑棋');
        setChess(null);
        setPlayArr([]);
    };
    return (
        <div className="chessboardWapper">
            <div >
                <ChessBoard
                    goBangIsNext={goBangIsNext}
                    xIsNext={xIsNext}
                    currentSquares={currentSquares}
                    onPlayChess={playChess}
                    chessStatus={chessStatus}
                    border={border}
                    playArr={playArr}
                    onGoBangPlayChess={goBangPlayChess}
                />
            </div>
            {/* 相同点 */}
            <div className='chessboardRight'>
                <div>
                    <button className='gameChange' onClick={() => gameChange(goBangIsNext)}>{goBangIsNext ? '五子棋游戏' : '井棋游戏'}</button>
                </div>
                <div className='stateContent'>
                    <ul className="styoo">{goBangIsNext ? moves : goBangMoves}</ul>
                </div>
            </div>
        </div>
    );
};

export default App;

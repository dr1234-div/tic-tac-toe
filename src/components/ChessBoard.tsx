import React, { Component } from 'react';
import { ChessBoardType, propType } from '../App.d';
import { connect } from 'react-redux';
import ChessType from './ChessType';

class ChessBoard extends Component<ChessBoardType> {
    constructor (props: ChessBoardType) {
        super(props);
    }
    render () {
        const { goBangIsNext, border, onPlayChess, winner, chess } = this.props;
        let status = '';
        if (goBangIsNext) {
            winner ? status = `获胜者: ${winner === '先手' ? 'X' : 'O'}` : status = `下一位玩家: ${chess === '先手' ? 'X' : 'O'}`;
        } else {
            winner ? status = `获胜者: ${winner === '先手' ? '黑棋' : '白棋'}` : status = `下一位玩家: ${chess === '先手' ? '黑棋' : '白棋'}`;
        }
        return (
            <>
                <h1>{status}</h1>
                <div className= {goBangIsNext ? '' : 'chess-board'} >
                    {border.map((row:number, rowIndex:number) => (
                        <div className= {goBangIsNext ? 'board-row' : 'chess-board-row'}  key={`row + ${rowIndex}`}>
                            {border.map((col:number, colIndex:number) => (
                                goBangIsNext
                                    ?  <ChessType key={(rowIndex * 3) + colIndex} goBangIsNext={goBangIsNext} rowIndex={ rowIndex } colIndex={colIndex}  onPlay={onPlayChess}/>
                                    :  <div className="chess-board-col" key={`col + ${colIndex}`}>
                                        <div className="chess-board-cell">
                                            <ChessType goBangIsNext={goBangIsNext} rowIndex={ rowIndex } colIndex={colIndex}  onPlay={onPlayChess}/>
                                        </div>
                                    </div>
                            ))}

                        </div>
                    ))}
                </div>
            </>
        );
    }
}
/**
 * @param {propType} state
 * @return {*} 将redux中的playArr数据映射到当前组件的props
 */
const mapStateToProps = (state:propType) => {
    return {
        winner: state.winner,
        chess: state.chess,
    };
};
export default connect(mapStateToProps)(ChessBoard);

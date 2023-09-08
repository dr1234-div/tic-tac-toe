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
        if (winner && winner !== '平局') {
            const winnerRole = winner === '先手' ? 'X' : 'O';
            if (goBangIsNext) {
                status = `获胜者: ${winnerRole}`;
            } else {
                status = `获胜者: ${winnerRole === 'X' ? '黑棋' : '白棋'}`;
            }
        } else if (winner === '平局') {
            status = '本场平局';
        } else {
            const role = chess === '先手' ? 'X' : 'O';
            if (goBangIsNext) {
                status = `您的角色: ${role}`;
            } else {
                status = `您的角色: ${role === 'X' ? '黑棋' : '白棋'}`;
            }
        }

        return (
            <>
                <h1 className='title-style'>{status}</h1>
                <div className= {goBangIsNext ? '' : 'chess-board'} >
                    {border.map((row:number, rowIndex:number) => (
                        <div className= {goBangIsNext ? 'board-row' : 'chess-board-row'}  key={`row + ${rowIndex}`}>
                            {border.map((col:number, colIndex:number) => (
                                goBangIsNext
                                    ?  <ChessType key={(rowIndex * 3) + colIndex} goBangIsNext={goBangIsNext} rowIndex={ rowIndex } colIndex={colIndex}  onPlay={onPlayChess}/>
                                    :  <div className="chess-board-col" key={`col + ${colIndex}`}>
                                        <div className="chess-board-cell">
                                            {/* 解决AI算法中横纵左边颠倒问题 */}
                                            <ChessType goBangIsNext={goBangIsNext} rowIndex={ colIndex } colIndex={ rowIndex }  onPlay={onPlayChess}/>
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

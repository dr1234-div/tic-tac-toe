import React, { Component } from 'react';
import { ChessStateType, ChessTypeProps, propType } from '../App.d';
import { connect } from 'react-redux';
interface ChessType {
    state: ChessStateType;
    props: ChessTypeProps;
}
class ChessType extends Component {
    constructor (props: ChessTypeProps) {
        super(props);
    }
    render () {
        // 由棋子的样式
        let hasChessClass = '';
        // 无棋子的样式
        let noChessClass = '';
        // 棋子类型
        let chessType = '';

        const { rowIndex, colIndex, playArr, goBangIsNext, onPlay } = this.props;
        const haveChess = playArr.find((item: { row: number, col: number, chess: string }) =>
            item.row === rowIndex && item.col === colIndex);

        if (goBangIsNext) {
            hasChessClass = 'square';
            noChessClass = 'square';
            chessType = haveChess?.chess === '先手' ? 'X' : 'O';
        } else {
            hasChessClass = haveChess?.chess === '先手' ? 'chess-board-cell-black' : 'chess-board-cell-white',
            noChessClass = 'chess-board-cell-click';
            chessType = '';
        }

        if (haveChess) {
            return <div className={hasChessClass}>{chessType}</div>;
        }
        return (
            <div
                className={noChessClass}
                onClick={() => onPlay(rowIndex, colIndex)}
            ></div>
        );
    }
}

/**
 * @param {propType} state
 * @return {*} 将redux中的playArr数据映射到当前组件的props
 */
const mapStateToProps = (state: propType) => {
    return { playArr: state.playArr };
};

export default connect(mapStateToProps)(ChessType as React.ComponentClass<ChessTypeProps>);

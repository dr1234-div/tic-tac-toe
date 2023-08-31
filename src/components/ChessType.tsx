import React, { Component } from 'react';
import { ChessStateType, ChessTypeProps, propType } from '../App.d';
import { connect } from 'react-redux';
interface ChessType {
    state:ChessStateType;
    props:ChessTypeProps;
}
class ChessType extends Component {
    constructor (props: ChessTypeProps) {
        super(props);
    }
    render () {
        // 棋子的配置项
        const chessClass = {
            hasChess: '',
            noChess: '',
            chessType: '',
        };
        const { rowIndex, colIndex, playArr, goBangIsNext, onPlay } = this.props;
        const haveChess = playArr.find((item: { row: number, col: number, chess: string }) =>
            item.row === rowIndex && item.col === colIndex);

        if (goBangIsNext) {
            chessClass.hasChess = 'square';
            chessClass.noChess = 'square';
            chessClass.chessType = haveChess?.chess === '先手' ? 'X' : 'O';
        } else {
            chessClass.hasChess = haveChess?.chess === '先手' ? 'chess-board-cell-black' : 'chess-board-cell-white',
            chessClass.noChess = 'chess-board-cell-click';
            chessClass.chessType = '';
        }

        if (haveChess) {
            return  <div className={chessClass.hasChess}>{chessClass.chessType}</div>;
        }
        return (
            <div
                className={chessClass.noChess}
                onClick={() => onPlay(rowIndex, colIndex)}
            ></div>
        );
    }
}

/**
 * @param {propType} state
 * @return {*} 将redux中的playArr数据映射到当前组件的props
 */
const mapStateToProps = (state:propType) => {
    return { playArr: state.playArr };
};

export default connect(mapStateToProps)(ChessType as React.ComponentClass<ChessTypeProps>);

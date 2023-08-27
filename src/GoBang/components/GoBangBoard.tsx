import React from 'react';
import ChessType from './ChessType';
import  { GoBangBoardType } from '../../App.d';
const border = Array(20).fill(null);
/**
 *@param {playArrType} playArr 已下棋子的数组
 *@param {void} playChess 下棋动作监听回调
 * @return {*}
 */
const GoBangBoard = (props:GoBangBoardType) => {
    const { playArr, playChess } = props;
    return (
        <>
            {border.map((rowIndex) => (
                <div className="chessboardRow" key={`row + ${rowIndex}`}>
                    {border.map((colIndex) => (
                        <div className="chessboardCol" key={`col + ${colIndex}`}>
                            <div className="chessboardCell">
                                <ChessType rowIndex={ rowIndex } colIndex={colIndex} playArr={playArr} onPlay={playChess}/>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </>

    );
};

export default GoBangBoard;

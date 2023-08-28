import React from 'react';
import ChessType from './ChessType';

/**
 *@param {playArrType} playArr 已下棋子的数组
 *@param {void} playChess 下棋动作监听回调
 * @return {*}
 */
const GoBangBoard = (props:any) => {
    const {  border, newPlayArr, onPlayChess } = props;
    return (
        <>
            {border.map((row:number, rowIndex:number) => (
                <div className="chessboardRow" key={`row + ${rowIndex}`}>
                    {border.map((col:number, colIndex:number) => (
                        <div className="chessboardCol" key={`col + ${colIndex}`}>
                            <div className="chessboardCell">
                                <ChessType rowIndex={ rowIndex } colIndex={colIndex} playArr={newPlayArr} onPlay={onPlayChess}/>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </>

    );
};

export default GoBangBoard;

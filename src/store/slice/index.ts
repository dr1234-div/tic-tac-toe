import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { playArrType, sliceType } from '../../App.d';

// 使用该类型定义初始 state
const initialState: sliceType = {
    // 历史记录
    history: [],
    // 下一位玩家
    chess: '先手',
    // 获胜方
    winner: '',
    // 已下棋子的数据记录
    playArr: [],
};

export const gameDataSlice = createSlice({
    name: 'gameDataSlice',
    initialState,
    reducers: {
        // 接受当前棋子的状态数据
        setHistory: (state: sliceType, action: PayloadAction<playArrType>) => {
            return {
                ...state,
                history: action.payload,
            };
        },
        setChess: (state: sliceType, action: PayloadAction<string>) => {
            return {
                ...state,
                chess: action.payload,
            };
        },
        setWinner: (state: sliceType, action: PayloadAction<string>) => {
            return {
                ...state,
                winner: action.payload,
            };
        },
        setPlayArr: (state: sliceType, action: PayloadAction<playArrType>) => {
            return {
                ...state,
                playArr: action.payload,
            };
        },
    },
});

export const { setHistory, setChess, setWinner, setPlayArr } = gameDataSlice.actions;
export default gameDataSlice.reducer;

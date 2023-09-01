import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { playArrType, sliceType } from '../../App.d';

// 使用该类型定义初始 state
const initialState: sliceType = {
    history: [],
    chess: '先手',
    isWinner: '',
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
        setIsWinner: (state: sliceType, action: PayloadAction<string>) => {
            return {
                ...state,
                isWinner: action.payload,
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

export const { setHistory, setChess, setIsWinner, setPlayArr } = gameDataSlice.actions;
export default gameDataSlice.reducer;

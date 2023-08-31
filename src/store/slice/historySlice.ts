import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { playArrType } from '../../App.d';

// 使用该类型定义初始 state
const initialState: playArrType = [];

export const historySlice = createSlice({
    name: 'history',
    initialState,
    reducers: {
        // 接受当前棋子的状态数据
        setHistory: (state, action: PayloadAction<playArrType>) => {
            return action.payload;
        },
    },
});

export const { setHistory } = historySlice.actions;
export default historySlice.reducer;

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { playArrType } from '../../App.d';

// 使用该类型定义初始 state
const initialState: playArrType = [];

export const playArrSlice = createSlice({
    name: 'history',
    initialState,
    reducers: {
        // 接受当前棋子的状态数据
        setPlayArr: (state, action: PayloadAction<playArrType>) => {
            let newState: playArrType = [];
            action.payload.length > 0 ? newState = state.concat(action.payload) : newState;
            return newState;
        },
    },
});

export const { setPlayArr } = playArrSlice.actions;
export default playArrSlice.reducer;

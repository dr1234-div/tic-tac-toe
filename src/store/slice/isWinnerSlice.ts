import { PayloadAction, createSlice } from '@reduxjs/toolkit';

// 使用该类型定义初始 state
const initialState = '';

export const isWinnerSlice = createSlice({
    name: 'isWinner',
    initialState,
    reducers: {
        // 接受当前棋子的状态数据
        setIsWinner: (state: string, action: PayloadAction<string>) => {
            return action.payload;
        },
    },
});

export const { setIsWinner } = isWinnerSlice.actions;
export default isWinnerSlice.reducer;

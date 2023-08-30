import { PayloadAction, createSlice } from '@reduxjs/toolkit';

// 使用该类型定义初始 state
const initialState = '先手';

export const chessSlice = createSlice({
    name: 'chess',
    initialState,
    reducers: {
        // 接受当前棋子的状态数据
        setChess: (state: string, action: PayloadAction<string>) => {
            return action.payload;
        },
    },
});

export const { setChess } = chessSlice.actions;
export default chessSlice.reducer;

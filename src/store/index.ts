// 创建 Redux Store
import { configureStore } from '@reduxjs/toolkit';
import historyReducer from './slice/historySlice';
import isWinnerReducer from './slice/isWinnerSlice';
import chessReducer from './slice/chessSlice';
import playArrReducer from './slice/playArrSlice';

const store = configureStore({
    reducer: {
        history: historyReducer,
        isWinner: isWinnerReducer,
        chess: chessReducer,
        playArr: playArrReducer,

    },
});

// 从 store 本身推断 `RootState` 和 `AppDispatch` 类型
export type RootState = ReturnType<typeof store.getState>;
// 推断类型：{posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export default store;

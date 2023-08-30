// 创建 Redux Store
import { configureStore } from '@reduxjs/toolkit';
import historyReducer from './slice/historySlice';
import isWinnerReducer from './slice/isWinnerSlice';

const store = configureStore({
    reducer: {
        history: historyReducer,
        isWinner: isWinnerReducer,

    },
});

// 从 store 本身推断 `RootState` 和 `AppDispatch` 类型
export type RootState = ReturnType<typeof store.getState>;
// 推断类型：{posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export default store;

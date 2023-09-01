// 创建 Redux Store
import { configureStore } from '@reduxjs/toolkit';
import gameDataReducer from './slice';
const store = configureStore({ reducer: gameDataReducer });

// 从 store 本身推断 `RootState` 和 `AppDispatch` 类型
export type RootState = ReturnType<typeof store.getState>;
// 推断类型：{posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export default store;

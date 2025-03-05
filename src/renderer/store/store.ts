import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import MainReducer from "./main.slice";

export const store = configureStore({
  reducer: {
    main: MainReducer
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

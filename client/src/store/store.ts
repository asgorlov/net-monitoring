import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import ConfigReducer from "./config.slice";

export const store = configureStore({
  reducer: {
    config: ConfigReducer
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

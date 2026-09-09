import { configureStore } from "@reduxjs/toolkit";
import eventEditorReducer from "./eventEditorReducer";

export const store = configureStore({
  reducer: {
    eventEditor: eventEditorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore, ThunkAction } from "@reduxjs/toolkit";
import { Context, createWrapper } from "next-redux-wrapper";
import isLoginReducer from "./modules/isLogin";
import isLoadingReducer from "./modules/isLoading";
import { persistStore } from "redux-persist";
import { Action } from "redux";

const makeStore = (context: Context) =>
  configureStore({
    reducer: {
      isLogin: isLoginReducer,
      isLoading: isLoadingReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
    devTools: true,
  });

export type Appstore = ReturnType<typeof makeStore>;
export type Appstate = ReturnType<Appstore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  Appstate,
  unknown,
  Action
>;

export const wrapper = createWrapper<Appstore>(makeStore);

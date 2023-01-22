import { combineReducers } from "redux"; // 여러 리듀서들을 하나로 합쳐준다.
import { configureStore } from "@reduxjs/toolkit";
import isLogin from "./isLogin";
import isLoading from "./isLoading";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  // localStorage에 저장합니다.
  storage,
  // whitList: 입력된 reducer를 localstorage에 저장합니다.
  whitelist: ["isLogin", "isLoading"],
};

const rootReducer = combineReducers({
  isLogin,
  isLoading,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export type IRootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(store);

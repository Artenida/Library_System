import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { persistStore } from "redux-persist";
import authReducer from "./slices/authSlice";
import booksReducer from "./slices/bookSlice";
import userReducer from "./slices/userSlice";
import authorReducer from "./slices/authorSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  books: booksReducer,
  author: authorReducer,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';
import fileReducer from './slices/fileSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    file: fileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['file/setFile'],
        ignoredPaths: ['file.file'],
      },
    }),
});

// Types pour TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

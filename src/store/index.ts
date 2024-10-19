import { configureStore } from '@reduxjs/toolkit';
import { appApi } from './../api';

const reduxStore = configureStore({
    reducer: {
      [appApi.reducerPath]: appApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(appApi.middleware),
})

export default reduxStore;
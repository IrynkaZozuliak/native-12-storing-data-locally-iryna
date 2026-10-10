import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "./themeSlice";
import wordsLearningSlice from "./wordsLearningSlice";

const store = configureStore({
  reducer: {
    theme: themeSlice.reducer,
    wordsLearning: wordsLearningSlice.reducer,
  },
});

export default store;

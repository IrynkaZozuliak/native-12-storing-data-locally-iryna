
import { createSlice, createSelector } from "@reduxjs/toolkit";
import { INITIAL_FORGETTING_SPAN } from "../constants";
import * as dbUtils from "./dbUtils";

const initialState = {
  words: [],
};

const wordsLearningSlice = createSlice({
  name: "wordsLearning",
  initialState,

  reducers: {
    setInitial(state, action) {
      state.words = Array.isArray(action.payload)
        ? action.payload
        : [];
    },

    addWord(state, action) {
      const existingWord = state.words.find(
        (item) => item.word === action.payload.word
      );

      if (existingWord) {
        return;
      }

      const now = Date.now();

      const wordData = {
        ...action.payload,
        dateForgets: now - INITIAL_FORGETTING_SPAN,
        dateTotallyForgets: now,
        forgettingSpan: INITIAL_FORGETTING_SPAN,
        status: 0,
      };

      state.words.push(wordData);

      // Передаємо до SQLite звичайний об'єкт, не Immer-проксі.
      dbUtils.addWord({ ...wordData });
    },

    updateWord(state, action) {
      const index = state.words.findIndex(
        (item) => item.word === action.payload.word
      );

      if (index === -1) {
        return;
      }

      state.words[index] = {
        ...state.words[index],
        ...action.payload,
      };

      dbUtils.updateWord({ ...state.words[index] });
    },

    removeWord(state, action) {
      const wordText = action.payload;

      state.words = state.words.filter(
        (item) => item.word !== wordText
      );

      dbUtils.deleteWord(wordText);
    },

    updateWordLearnInfo(state, action) {
      const wordInfo = state.words.find(
        (item) => item.word === action.payload
      );

      if (!wordInfo) {
        return;
      }

      const now = Date.now();

      wordInfo.dateForgets = now + wordInfo.forgettingSpan;
      wordInfo.forgettingSpan *= 2;
      wordInfo.dateTotallyForgets =
        now + wordInfo.forgettingSpan;
      wordInfo.status = 2;

      // Не передаємо проксі Immer в mock або SQLite.
      dbUtils.updateWord({ ...wordInfo });
    },

    updateStatuses(state) {
      const now = Date.now();

      for (const wordInfo of state.words) {
        const previousStatus = wordInfo.status;
        let nextStatus = previousStatus;

        if (wordInfo.dateTotallyForgets <= now) {
          nextStatus = 0;
        } else if (
          wordInfo.dateForgets <= now &&
          wordInfo.dateTotallyForgets > now
        ) {
          nextStatus = 1;
        }

        if (nextStatus !== previousStatus) {
          wordInfo.status = nextStatus;

          // Зберігаємо тільки ті записи, статус яких змінився.
          dbUtils.updateWord({ ...wordInfo });
        }
      }
    },
  },
});

export const selectWordsToLearn = createSelector(
  (state) => state.wordsLearning.words,
  (words) => words.filter((word) => word.status < 2)
);

export const wordsLearningActions = wordsLearningSlice.actions;

export default wordsLearningSlice;

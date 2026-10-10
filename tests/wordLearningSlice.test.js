import wordsLearningSlice, {
  wordsLearningActions,
} from "../store/wordsLearningSlice";
import { MyWords } from "./testData";
import * as constants from "../constants";
import * as dbUtils from "../store/dbUtils";

jest.mock("../store/dbUtils");
dbUtils.init.mockImplementation(
  async () => await new Promise((r) => setTimeout(r, 50))
);
dbUtils.addWord.mockImplementation(
  async () => await new Promise((r) => setTimeout(r, 50))
);
dbUtils.updateWord.mockImplementation(
  async () => await new Promise((r) => setTimeout(r, 50))
);
dbUtils.deleteWord.mockImplementation(
  async () => await new Promise((r) => setTimeout(r, 50))
);
dbUtils.getTheme.mockImplementation(
  async () => await new Promise((r) => setTimeout(() => r(true), 50))
);
dbUtils.getWords.mockImplementation(
  async () =>
    await new Promise((r) => setTimeout(() => r([{ ...savedWords[1] }]), 50))
);

afterEach(() => {
  jest.clearAllMocks();
});

const day = Math.floor(Math.random() * 30) + 1;
const year = Math.floor(Math.random() * 24) + 2000;

constants.INITIAL_FORGETTING_SPAN = 500;

function mockNow() {
  jest.useFakeTimers("modern");
  jest.setSystemTime(new Date(`${day} Oct ${year}  23:24:00`));
}

afterEach(() => {
  jest.useRealTimers();
});

beforeEach(() => {
  mockNow();
});

test("addWord reducer adds word to empty words array and calls addWord from dbUtils with correct argument", () => {
  const previousState = {
    words: [],
  };
  const wordPayload = MyWords[0];
  const result = wordsLearningSlice.reducer(
    previousState,
    wordsLearningActions.addWord(wordPayload)
  ).words[0];
  expect(result).toMatchObject(wordPayload);

  expect(dbUtils.addWord).toHaveBeenCalledTimes(1);
  expect(dbUtils.addWord).toHaveBeenCalledWith(result);
});

test("addWord reducer adds word to not empty words array and calls addWord from dbUtils with correct argument", () => {
  const initialWord = { ...MyWords[0], status: 0 };
  const previousState = {
    words: [initialWord],
  };
  const wordPayload = { ...MyWords[1], status: 0 };
  const result = wordsLearningSlice
    .reducer(previousState, wordsLearningActions.addWord(wordPayload))
    .words.find((el) => el.word === wordPayload.word);

  expect(result).toMatchObject(wordPayload);
  expect(dbUtils.addWord).toHaveBeenCalledTimes(1);
  expect(dbUtils.addWord).toHaveBeenCalledWith(result);
});

test(`addWord reducer does not add a word if the word already exists in the words array
and does not call addWord from dbUtils with correct argument`, () => {
  const initialWord = { ...MyWords[0], status: 0 };
  const previousState = {
    words: [initialWord],
  };
  const wordPayload = { ...initialWord };
  const result = wordsLearningSlice.reducer(
    previousState,
    wordsLearningActions.addWord(wordPayload)
  ).words;

  expect(result).toHaveLength(1);
  expect(dbUtils.addWord).toHaveBeenCalledTimes(0);
});

test("updateWord reducer updates a word  and calls updateWord from dbUtils with correct argument", () => {
  const initialWords = [
    { ...MyWords[0], status: 0 },
    { ...MyWords[1], status: 0 },
  ];
  const previousState = {
    words: initialWords,
  };
  const wordPayload = { ...initialWords[0] };
  wordPayload.meaning = "new meaning";
  wordPayload.partOfSpeech = "exclamation";

  const result = wordsLearningSlice.reducer(
    previousState,
    wordsLearningActions.updateWord(wordPayload)
  ).words[0];
  expect(result).toMatchObject(wordPayload);
  expect(dbUtils.updateWord).toHaveBeenCalledTimes(1);
  expect(dbUtils.updateWord).toHaveBeenCalledWith(result);
});

test("addWord sets correct additional data and calls addWord from dbUtils with correct argument", () => {
  const previousState = {
    words: [],
  };
  const wordPayload = MyWords[0];

  const addedWordInfo = wordsLearningSlice.reducer(
    previousState,
    wordsLearningActions.addWord(wordPayload)
  ).words[0];

  expect(addedWordInfo.status).toBe(0);
  expect(addedWordInfo.forgettingSpan).toBe(constants.INITIAL_FORGETTING_SPAN);
  expect(addedWordInfo.dateTotallyForgets).toBe(new Date().getTime());
  expect(addedWordInfo.dateForgets).toBe(
    new Date().getTime() - constants.INITIAL_FORGETTING_SPAN
  );
  expect(dbUtils.addWord).toHaveBeenCalledTimes(1);
  expect(dbUtils.addWord).toHaveBeenCalledWith(addedWordInfo);
});

test(`updateWordLearnInfo sets correct additional data  
and calls updateWord from dbUtils with correct argument`, () => {
  const previousState = {
    words: [
      {
        word: "hello",
        phonetics: "həˈləʊ",
        audio:
          "https://ssl.gstatic.com/dictionary/static/sounds/20200429/hello--_gb_1.mp3",
        meaning: "used as a greeting or to begin a phone conversation.",
        status: 0,
        dateForgets: new Date().getTime() - constants.INITIAL_FORGETTING_SPAN,
        dateTotallyForgets: new Date().getTime(),
        forgettingSpan: constants.INITIAL_FORGETTING_SPAN,
      },
    ],
  };
  const updatedWordInfo = wordsLearningSlice.reducer(
    previousState,
    wordsLearningActions.updateWordLearnInfo("hello")
  ).words[0];

  expect(updatedWordInfo.status).toBe(2);
  const newWordForgettingSpan = constants.INITIAL_FORGETTING_SPAN * 2;
  expect(updatedWordInfo.forgettingSpan).toBe(newWordForgettingSpan);
  expect(updatedWordInfo.dateForgets).toBe(
    new Date().getTime() + constants.INITIAL_FORGETTING_SPAN
  );
  expect(updatedWordInfo.dateTotallyForgets).toBe(
    new Date().getTime() + newWordForgettingSpan
  );
  expect(dbUtils.updateWord).toHaveBeenCalledTimes(1);
  expect(dbUtils.updateWord).toHaveBeenCalledWith(updatedWordInfo);
});

test(`words have their status changed when time comes, with updateStatuses reducer 
and updateWord is called from dbUtils with correct argument`, () => {
  const wordForgettingSpan = constants.INITIAL_FORGETTING_SPAN * 2;
  const previousState = {
    words: [
      {
        word: "hello",
        phonetics: "həˈləʊ",
        audio:
          "https://ssl.gstatic.com/dictionary/static/sounds/20200429/hello--_gb_1.mp3",
        meaning: "used as a greeting or to begin a phone conversation.",
        status: 0,
        dateForgets: new Date().getTime() + wordForgettingSpan,
        dateTotallyForgets: new Date().getTime() + wordForgettingSpan * 2,
        forgettingSpan: wordForgettingSpan,
      },
    ],
  };
  const updatedWordInfo = wordsLearningSlice.reducer(
    previousState,
    wordsLearningActions.updateWordLearnInfo("hello")
  ).words[0];

  expect(updatedWordInfo.status).toBe(2);
  const newWordForgettingSpan = wordForgettingSpan * 2;
  expect(updatedWordInfo.forgettingSpan).toBe(newWordForgettingSpan);
  expect(updatedWordInfo.dateForgets).toBe(
    new Date().getTime() + wordForgettingSpan
  );
  expect(updatedWordInfo.dateTotallyForgets).toBe(
    new Date().getTime() + newWordForgettingSpan
  );
  expect(dbUtils.updateWord).toHaveBeenCalledTimes(1);
  expect(dbUtils.updateWord).toHaveBeenCalledWith(updatedWordInfo);

  jest.clearAllMocks();
  jest.advanceTimersByTime(wordForgettingSpan + 5);
  const updatedWordInfo2nd = wordsLearningSlice.reducer(
    { words: [updatedWordInfo] },
    wordsLearningActions.updateStatuses()
  ).words[0];
  expect(updatedWordInfo2nd.status).toBe(1);
  expect(dbUtils.updateWord).toHaveBeenCalledTimes(1);
  expect(dbUtils.updateWord).toHaveBeenCalledWith(updatedWordInfo2nd);

  jest.clearAllMocks();
  jest.advanceTimersByTime(wordForgettingSpan + 5);
  const updatedWordInfo3rd = wordsLearningSlice.reducer(
    { words: [updatedWordInfo] },
    wordsLearningActions.updateStatuses()
  ).words[0];
  expect(updatedWordInfo3rd.status).toBe(0);
  expect(dbUtils.updateWord).toHaveBeenCalledTimes(1);
  expect(dbUtils.updateWord).toHaveBeenCalledWith(updatedWordInfo3rd);
});

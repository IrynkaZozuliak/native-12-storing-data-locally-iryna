import {
  render,
  screen,
  userEvent,
  act,
  waitFor,
} from "@testing-library/react-native";

import { Provider } from "react-redux";
import store from "../store";
import * as constants from "../constants";
import { savedWords } from "./testData";
import MainNavigator from "../navigators/MainNavigator";
import * as wordsService from "../services/wordsHandler";
import * as dbUtils from "../store/dbUtils";

jest.mock("@expo/vector-icons/Ionicons", () => {
  const { Text } = require("react-native");
  return ({ name }) => <Text>{name}</Text>;
});

jest.mock("expo-image-picker", () => {
  const actual = jest.requireActual("expo-image-picker");
  return {
    ...actual,
    useMediaLibraryPermissions: jest.fn(() => {
      const requestPermission = () => {
        return Promise.resolve({
          granted: true,
          status: actual.PermissionStatus.GRANTED,
        });
      };
      return [
        { status: actual.PermissionStatus.UNDETERMINED },
        requestPermission,
      ];
    }),
    launchImageLibraryAsync: jest.fn((param) => {
      return { assets: [{ uri: "some_test_uri" }], cancelled: false };
    }),
  };
});

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

constants.INITIAL_FORGETTING_SPAN = 1000 / 2;
constants.REFRESH_STATUSES_SPAN = 1000;

jest.spyOn(global.console, "error").mockImplementation((message) => {
  if (!message.includes("should be wrapped into act(...)")) {
    global.console.error(message);
  }
});
jest.spyOn(global.console, "warn").mockImplementationOnce((message) => {
  if (!message.includes("use userEvent with fake timers")) {
    global.console.warn(message);
  }
});

afterEach(() => {
  jest.clearAllMocks();
});

test(`shows the words returned by the getWords function from dbUtils`, async () => {
  dbUtils.getTheme.mockImplementationOnce(
    async () =>
      await new Promise((resolve) => setTimeout(() => resolve(false), 50))
  );
  dbUtils.getWords.mockImplementationOnce(
    async () =>
      await new Promise((resolve) =>
        setTimeout(
          () => resolve([{ ...savedWords[1] }, { ...savedWords[2] }]),
          50
        )
      )
  );
  jest
    .spyOn(wordsService, "getWordInfo")
    .mockImplementationOnce(() => words[0]);

  expect(store.getState().wordsLearning.words).toHaveLength(0);

  render(
    <Provider store={store}>
      <MainNavigator />
    </Provider>
  );

  await waitFor(() => {
    expect(dbUtils.init).toHaveBeenCalled();
    expect(dbUtils.getWords).toHaveBeenCalled();
    expect(dbUtils.getTheme).toHaveBeenCalled();
  });

  let word1Text = await screen.findByText("tradition");
  expect(word1Text).toBeOnTheScreen();
  let word2Text = await screen.findByText("initial");
  expect(word2Text).toBeOnTheScreen();
  let wordUnexistingText = screen.queryByText("fact");
  expect(wordUnexistingText).not.toBeOnTheScreen();
  expect(store.getState().wordsLearning.words).toEqual([
    { ...savedWords[1] },
    { ...savedWords[2] },
  ]);
}, 3000);

test(`calls the deleteWords function from dbUtils on on deletion word`, async () => {
  dbUtils.getTheme.mockImplementationOnce(
    async () =>
      await new Promise((resolve) => setTimeout(() => resolve(false), 50))
  );
  dbUtils.getWords.mockImplementationOnce(
    async () =>
      await new Promise((resolve) =>
        setTimeout(() => resolve([{ ...savedWords[3] }]), 50)
      )
  );

  const user = userEvent.setup();

  render(
    <Provider store={store}>
      <MainNavigator />
    </Provider>
  );

  await waitFor(() => {
    expect(dbUtils.init).toHaveBeenCalled();
    expect(dbUtils.getWords).toHaveBeenCalled();
    expect(dbUtils.getTheme).toHaveBeenCalled();
  });

  let word1Text = await screen.findByText("fact");
  expect(word1Text).toBeOnTheScreen();

  const deleteButton = screen.getByText("trash-outline");
  await act(async () => {
    user.press(deleteButton);
    await new Promise((r) => setTimeout(r, 50));
  });

  expect(dbUtils.deleteWord).toHaveBeenCalledTimes(1);
  expect(dbUtils.deleteWord).toHaveBeenCalledWith("fact");
}, 3000);

test(`gets theme isDark value returned by the getTheme function from dbUtils`, async () => {
  dbUtils.getTheme.mockImplementationOnce(
    async () =>
      await new Promise((resolve) => setTimeout(() => resolve(false), 50))
  );
  dbUtils.getWords.mockImplementationOnce(
    async () =>
      await new Promise((resolve) => setTimeout(() => resolve([]), 50))
  );
  render(
    <Provider store={store}>
      <MainNavigator />
    </Provider>
  );

  await waitFor(() => {
    expect(dbUtils.init).toHaveBeenCalled();
    expect(dbUtils.getTheme).toHaveBeenCalled();
  });

  await new Promise((resolve) => setTimeout(() => resolve([]), 100));
  expect(store.getState().theme.isDark).toBeFalsy();
}, 3000);

test(`gets theme isDark value returned by the getTheme function from dbUtils`, async () => {
  dbUtils.getWords.mockImplementationOnce(
    async () =>
      await new Promise((resolve) => setTimeout(() => resolve([]), 50))
  );
  dbUtils.getTheme.mockImplementationOnce(
    async () =>
      await new Promise((resolve) => setTimeout(() => resolve(true), 50))
  );
  render(
    <Provider store={store}>
      <MainNavigator />
    </Provider>
  );

  await waitFor(() => {
    expect(dbUtils.init).toHaveBeenCalled();
    expect(dbUtils.getTheme).toHaveBeenCalled();
  });

  await waitFor(() => {
    expect(store.getState().theme.isDark).toBeTruthy();
  });
}, 3000);

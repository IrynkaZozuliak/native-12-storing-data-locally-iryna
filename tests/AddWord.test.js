import {
  render,
  screen,
  userEvent,
  act,
} from "@testing-library/react-native";

import { Provider } from "react-redux";
import store from "../store";
import * as constants from "../constants";
import { MyWords } from "./testData";
import * as wordsService from "../services/wordsHandler";
import * as dbUtils from "../store/dbUtils";
import AddWord from "../screens/Words/AddWord";

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
  async () => await new Promise((r) => setTimeout(r, 0))
);
dbUtils.addWord.mockImplementation(
  async () => await new Promise((r) => setTimeout(r, 0))
);
dbUtils.updateWord.mockImplementation(
  async () => await new Promise((r) => setTimeout(r, 0))
);
dbUtils.deleteWord.mockImplementation(
  async () => await new Promise((r) => setTimeout(r, 0))
);
dbUtils.getTheme.mockImplementation(
  async () =>
    await new Promise((resolve) => setTimeout(() => resolve(false), 50))
);

constants.INITIAL_FORGETTING_SPAN = 1000 / 2;
constants.REFRESH_STATUSES_SPAN = 1000;

jest.spyOn(global.console, "error").mockImplementationOnce((message) => {
  if (!message.includes("should be wrapped into act(...)")) {
    global.console.error(message);
  }
});
jest.spyOn(global.console, "warn").mockImplementationOnce((message) => {
  if (!message.includes("use userEvent with fake timers")) {
    global.console.warn(message);
  }
});

const mockedSetOptions = jest.fn();
const mockedNavigate = jest.fn();

afterEach(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
  jest.resetAllMocks();
});

test(`calls addWord from dbUtils on adding new word`, async () => {
  jest.useFakeTimers();
  jest
    .spyOn(wordsService, "getWordInfo")
    .mockImplementationOnce(() => MyWords[0]);

  const user = userEvent.setup();

  render(
    <Provider store={store}>
      <AddWord
        navigation={{ setOptions: mockedSetOptions, navigate: mockedNavigate }}
      />
    </Provider>
  );

  const imagePlaceholderText = screen.getByText("No image taken yet.");
  await act(async () => {
    await user.press(imagePlaceholderText);
    jest.advanceTimersByTime(50);
  });

  const input = screen.getByPlaceholderText("type here..");
  await act(async () => {
    await user.type(input, "hello");
    jest.advanceTimersByTime(2050);
  });

  await act(async () => {
    await user.press(imagePlaceholderText);
    jest.advanceTimersByTime(50);
  });

  const addWordButton = await screen.findByText("Add");
  await act(async () => {
    await user.press(addWordButton);
    jest.advanceTimersByTime(250);
  });

  expect(store.getState().wordsLearning.words[0].image).toEqual(
    "some_test_uri"
  );

  expect(dbUtils.addWord).toHaveBeenCalledTimes(1);
  expect(dbUtils.addWord).toHaveBeenCalledWith(
    store.getState().wordsLearning.words[0]
  );
}, 4000);

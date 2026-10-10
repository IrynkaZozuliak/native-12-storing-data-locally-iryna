import { render, screen, userEvent, act } from "@testing-library/react-native";

import { Provider } from "react-redux";
import store from "../store";
import { wordsLearningActions } from "../store/wordsLearningSlice";
import * as constants from "../constants";
import { MyWords } from "./testData";
import EditWord from "../screens/Words/EditWord";
import * as dbUtils from "../store/dbUtils";

constants.INITIAL_FORGETTING_SPAN = 1000 / 2;
constants.REFRESH_STATUSES_SPAN = 1000;

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

const mockedSetOptions = jest.fn();
const mockedNavigate = jest.fn();

afterEach(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
  jest.resetAllMocks();
});

test(`image picker is used correctly on EditWord screen, 
and selected image uri is stored in the store`, async () => {
  jest.useFakeTimers();
  const user = userEvent.setup();
  await act(async () => {
    store.dispatch(wordsLearningActions.addWord(MyWords[0]));
  });

  render(
    <Provider store={store}>
      <EditWord
        navigation={{ setOptions: mockedSetOptions, navigate: mockedNavigate }}
        route={{
          params: { wordData: store.getState().wordsLearning.words[0] },
        }}
      />
    </Provider>
  );

  const explanationInput = screen.getByDisplayValue(
    "used as a greeting or to begin a phone conversation."
  );

  const newExplanationValue = "new explanation";
  await act(async () => {
    await user.clear(explanationInput);
    await user.type(explanationInput, newExplanationValue);
    jest.advanceTimersByTime(50);
  });

  const imagePlaceholderText = screen.getByText("No image taken yet.");
  await act(async () => {
    await user.press(imagePlaceholderText);
    jest.advanceTimersByTime(50);
  });

  const saveButton = await screen.findByText("Save");
  await act(async () => {
    await user.press(saveButton);
    jest.advanceTimersByTime(50);
  });

  expect(store.getState().wordsLearning.words[0].meaning).toEqual(
    newExplanationValue
  );
  expect(store.getState().wordsLearning.words[0].image).toEqual(
    "some_test_uri"
  );

  expect(dbUtils.updateWord).toHaveBeenCalledTimes(1);
  expect(dbUtils.updateWord).toHaveBeenCalledWith(
    store.getState().wordsLearning.words[0]
  );
});

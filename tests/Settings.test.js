import {
  render,
  screen,
  userEvent,
  fireEvent,
} from "@testing-library/react-native";

import { Provider } from "react-redux";
import store from "../store";
import * as dbUtils from "../store/dbUtils";
import Settings from "../screens/Settings";

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
dbUtils.setTheme.mockImplementation(
  async () => await new Promise((resolve) => setTimeout(resolve, 50))
);

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

afterEach(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
  jest.resetAllMocks();
});

test(`calls addWord from dbUtils on adding new word`, async () => {
  jest.useFakeTimers();

  const user = userEvent.setup();

  render(
    <Provider store={store}>
      <Settings />
    </Provider>
  );
  const switchElement = screen.getByRole(`switch`);
  expect(switchElement.props.value).toBeTruthy();

  fireEvent(switchElement, "valueChange", false);
  expect(switchElement.props.value).toBeFalsy();

  expect(dbUtils.setTheme).toHaveBeenCalledTimes(1);
  expect(dbUtils.setTheme).toHaveBeenCalledWith(false);

  jest.clearAllMocks();
  fireEvent(switchElement, "valueChange", true);
  expect(switchElement.props.value).toBeTruthy();

  expect(dbUtils.setTheme).toHaveBeenCalledTimes(1);
  expect(dbUtils.setTheme).toHaveBeenCalledWith(true);
}, 4000);

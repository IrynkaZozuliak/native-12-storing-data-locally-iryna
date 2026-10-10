import themeSlice from "../store/themeSlice";
import { themeActions } from "../store/themeSlice";
import { COLORS_DARK, COLORS_LIGHT } from "../constants";
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

test("toggle reducre changes isDark and  colors from dark to light options", () => {
  const previousState = {
    isDark: true,
    colors: COLORS_DARK,
  };

  expect(themeSlice.reducer(previousState, themeActions.toggle())).toEqual({
    isDark: false,
    colors: COLORS_LIGHT,
  });

  expect(dbUtils.setTheme).toHaveBeenCalledTimes(1);
  expect(dbUtils.setTheme).toHaveBeenCalledWith(false);
});

test("toggle reducer changes isDark and  colors from light to dark options", () => {
  const previousState = {
    isDark: false,
    colors: COLORS_LIGHT,
  };

  expect(themeSlice.reducer(previousState, themeActions.toggle())).toEqual({
    isDark: true,
    colors: COLORS_DARK,
  });

  expect(dbUtils.setTheme).toHaveBeenCalledTimes(1);
  expect(dbUtils.setTheme).toHaveBeenCalledWith(true);
});

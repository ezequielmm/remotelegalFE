import React from "react";
import WrongOrientationScreen from "../../routes/InDepo/WrongOrientationScreen";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import * as CONSTANTS from "../../constants/preJoinDepo";
import ORIENTATION_STATE from "../../types/orientation";

test("Should display proper text for landscape mode on tablet devices", async () => {
    const { getByText } = renderWithGlobalContext(<WrongOrientationScreen orientation={ORIENTATION_STATE.LANDSCAPE} />);
    expect(getByText(CONSTANTS.ORIENTATION_SCREEN[ORIENTATION_STATE.LANDSCAPE].title)).toBeInTheDocument();
    expect(getByText(CONSTANTS.ORIENTATION_SCREEN[ORIENTATION_STATE.LANDSCAPE].subtitle)).toBeInTheDocument();
});

test("Should display proper text for portrait mode on phone devices", async () => {
    const { getByText } = renderWithGlobalContext(<WrongOrientationScreen orientation={ORIENTATION_STATE.PORTRAIT} />);
    expect(getByText(CONSTANTS.ORIENTATION_SCREEN[ORIENTATION_STATE.PORTRAIT].title)).toBeInTheDocument();
    expect(getByText(CONSTANTS.ORIENTATION_SCREEN[ORIENTATION_STATE.PORTRAIT].subtitle)).toBeInTheDocument();
});

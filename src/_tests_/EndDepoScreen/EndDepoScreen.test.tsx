import React from "react";
import EndDepoScreen from "../../routes/InDepo/components/EndDepoScreen/EndDepoScreen";
import * as CONSTANTS from "../constants/InDepo";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";

test("End Depo Screen is shown with proper text", async () => {
    const { getByText } = renderWithGlobalContext(<EndDepoScreen />);
    expect(getByText(CONSTANTS.END_DEPO_SCREEN_FIRST_TEXT)).toBeInTheDocument();
    expect(getByText(CONSTANTS.END_DEPO_SCREEN_SECOND_TEXT)).toBeInTheDocument();
});

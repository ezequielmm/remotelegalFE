import { waitForDomChange } from "@testing-library/react";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import * as TESTS_CONSTANTS from "../constants/InDepo";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import Help from "../../routes/Help";
import { HELP_TITLE } from "../../constants/help";

const history = createMemoryHistory();

test("should display the help text", async () => {
    const { queryByText } = renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.ROUTE} component={Help} />,
        null,
        undefined,
        history
    );
    history.push(TESTS_CONSTANTS.TEST_ROUTE);
    await waitForDomChange();
    expect(queryByText(HELP_TITLE)).toBeInTheDocument();
});

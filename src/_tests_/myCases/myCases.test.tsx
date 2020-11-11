import { fireEvent, render, waitForDomChange, waitForElement } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { FETCH_ERROR_MODAL_BUTTON, FETCH_ERROR_MODAL_TITLE } from "../../components/FetchingErrorCard/constants";
import { theme } from "../../constants/styles/theme";
import { CASE_COLUMNS_FIELDS, CASE_COLUMNS_TITLES, EMPTY_STATE_TITLE } from "../../routes/myCases/constants/constants";
import MyCases from "../../routes/myCases/myCases";
import * as AUTH from "../mocks/Auth";
import * as CONSTANTS from "./constants/constants";

beforeEach(() => {
    AUTH.VALID();
});

const testOrder = async ({
    ascResponse,
    descResponse,
    sortBy,
    sortButtonText,
    textContent,
    formatText = (text) => text,
}) => {
    global.fetch = jest.fn().mockImplementation((url) => {
        if (url.includes(`sortedField=${sortBy}`) && url.includes("sortDirection=descend")) {
            return Promise.resolve(descResponse);
        }
        return Promise.resolve(ascResponse);
    });

    const { getAllByText, getByText } = render(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <MyCases />
            </BrowserRouter>
        </ThemeProvider>
    );

    let renderedCaseData = await waitForElement(() => getAllByText(RegExp(textContent, "i")));
    const sortButton = getByText(sortButtonText);
    userEvent.click(sortButton);

    await waitForDomChange();
    renderedCaseData = getAllByText(RegExp(textContent, "i"));
    const caseData = descResponse.json();
    renderedCaseData.forEach((data, index) => {
        expect(data.textContent).toBe(formatText(caseData[index][sortBy]));
    });
    expect(renderedCaseData.length).toBe(10);
    expect(fetch).toHaveBeenCalledTimes(2);
};

test("shows empty state screen when no cases loaded and go to add case modal", async () => {
    global.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve(CONSTANTS.RESPONSE_WITH_NO_CASE);
    });

    const { getByText, getByRole } = render(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <MyCases />
            </BrowserRouter>
        </ThemeProvider>
    );

    await waitForElement(() => getByText(EMPTY_STATE_TITLE));
    expect(fetch).toHaveBeenCalledTimes(1);
    const addCaseButton = await waitForElement(() => getByRole("button", { name: /Add Case/i }));
    fireEvent.click(addCaseButton);
    await waitForDomChange();
    getByText("To add a case, please complete the information below.");
});

test("shows a table with 1 record with a constant name when backend returns 1 case", async () => {
    global.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve(CONSTANTS.RESPONSE_WITH_ONE_CASE);
    });

    const { getAllByText } = render(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <MyCases />
            </BrowserRouter>
        </ThemeProvider>
    );

    const caseName = await waitForElement(() => getAllByText(CONSTANTS.CASE_NAME));
    expect(caseName.length).toBe(1);
    expect(fetch).toHaveBeenCalledTimes(1);
});

test("shows a table and go to add case modal", async () => {
    global.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve(CONSTANTS.RESPONSE_WITH_ONE_CASE);
    });

    const { getByText, getByRole } = render(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <MyCases />
            </BrowserRouter>
        </ThemeProvider>
    );

    await waitForElement(() => getByText(CONSTANTS.CASE_NAME));
    expect(fetch).toHaveBeenCalledTimes(1);

    const addCaseButton = await waitForElement(() => getByRole("button", { name: /Add Case/i }));
    fireEvent.click(addCaseButton);
    await waitForDomChange();
    getByText("To add a case, please complete the information below.");
});

test("shows a table with 10 records with ascend name order by default", async () => {
    global.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve(CONSTANTS.RESPONSE_ASC);
    });

    const { getAllByText } = render(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <MyCases />
            </BrowserRouter>
        </ThemeProvider>
    );

    const caseNames = await waitForElement(() => getAllByText(RegExp(`.${CONSTANTS.CASE_NAME}`, "i")));

    const casesData = CONSTANTS.RESPONSE_ASC.json();
    caseNames.forEach((caseName, index) => {
        expect(caseName.textContent).toBe(casesData[index].name);
    });
    expect(caseNames.length).toBe(10);
    expect(fetch).toHaveBeenCalledTimes(1);
});

test("shows a table with descend case Name after click order by name button", async () => {
    await testOrder({
        ascResponse: CONSTANTS.RESPONSE_ASC,
        descResponse: CONSTANTS.RESPONSE_DESC,
        sortBy: CASE_COLUMNS_FIELDS[0],
        sortButtonText: CASE_COLUMNS_TITLES[0],
        textContent: `.${CONSTANTS.CASE_NAME}`,
    });
});

test("shows a table with descend case Number after click order by name button", async () => {
    await testOrder({
        ascResponse: CONSTANTS.RESPONSE_ASC,
        descResponse: CONSTANTS.RESPONSE_DESC,
        sortBy: CASE_COLUMNS_FIELDS[1],
        sortButtonText: CASE_COLUMNS_TITLES[1],
        textContent: `.${CONSTANTS.CASE_NUMBER}`,
        formatText: (text) => text || "-",
    });
});

test("shows a table with descend case AddedBy after click order by name button", async () => {
    await testOrder({
        ascResponse: CONSTANTS.RESPONSE_ASC,
        descResponse: CONSTANTS.RESPONSE_DESC,
        sortBy: CASE_COLUMNS_FIELDS[2],
        sortButtonText: CASE_COLUMNS_TITLES[2],
        textContent: `.${CONSTANTS.CASE_ADDED_BY}`,
    });
});

test("shows error and try again button when get an error on fetch", async () => {
    global.fetch = jest.fn().mockImplementation(() => Promise.reject(Error("")));

    const { getByText, getByRole } = render(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <MyCases />
            </BrowserRouter>
        </ThemeProvider>
    );

    await waitForElement(() => getByText(FETCH_ERROR_MODAL_TITLE));
    const refreshButton = getByRole("button", { name: new RegExp(FETCH_ERROR_MODAL_BUTTON, "i") });
    expect(fetch).toHaveBeenCalledTimes(1);
    fireEvent.click(refreshButton);
    await waitForDomChange();
    expect(fetch).toHaveBeenCalledTimes(2);
});

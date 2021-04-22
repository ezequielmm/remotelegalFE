import { fireEvent, waitForDomChange, waitForElement } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "mutationobserver-shim";
import React from "react";
import MyCases from "../../routes/MyCases";
import * as CONSTANTS from "../constants/cases";
import * as ERRORS_CONSTANTS from "../../constants/errors";
import * as COMPONENTS_CONSTANTS from "../../constants/cases";
import * as AUTH from "../mocks/Auth";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import getMockDeps from "../utils/getMockDeps";

const deps = getMockDeps();

describe("MyCases", () => {
    beforeEach(() => {
        AUTH.VALID();
    });
    it("shows empty state screen when no cases loaded and go to add case modal", async () => {
        deps.apiService.fetchCases = jest.fn().mockResolvedValue(CONSTANTS.getNoCases());
        const { getByText, getByRole } = renderWithGlobalContext(<MyCases />, deps);

        await waitForElement(() => getByText(COMPONENTS_CONSTANTS.EMPTY_STATE_TITLE));
        expect(deps.apiService.fetchCases).toHaveBeenCalledWith({});
        const addCaseButton = await waitForElement(() => getByRole("button", { name: /Add Case/i }));
        fireEvent.click(addCaseButton);
        await waitForDomChange();
        expect(getByText("Please complete the information below.")).toBeTruthy();
    });

    it("shows a table with 1 record with a constant name when backend returns 1 case", async () => {
        deps.apiService.fetchCases = jest.fn().mockResolvedValue(CONSTANTS.getOneCase());
        const { getAllByText } = renderWithGlobalContext(<MyCases />, deps);

        const caseName = await waitForElement(() => getAllByText(CONSTANTS.CASE_NAME));
        expect(caseName.length).toBe(1);
        expect(deps.apiService.fetchCases).toHaveBeenCalledWith({});
    });

    it("shows a table and go to add case modal", async () => {
        deps.apiService.fetchCases = jest.fn().mockResolvedValue(CONSTANTS.getOneCase());
        const { getByText, getByRole } = renderWithGlobalContext(<MyCases />, deps);

        await waitForElement(() => getByText(CONSTANTS.CASE_NAME));
        expect(deps.apiService.fetchCases).toHaveBeenCalledWith({});

        const addCaseButton = await waitForElement(() => getByRole("button", { name: /Add Case/i }));
        fireEvent.click(addCaseButton);
        await waitForDomChange();
        expect(getByText("Please complete the information below.")).toBeTruthy();
    });

    it("shows a table with 10 records with ascend name order by default", async () => {
        deps.apiService.fetchCases = jest.fn().mockResolvedValue(CONSTANTS.getCaseAsc());
        const { getAllByText } = renderWithGlobalContext(<MyCases />, deps);

        const caseNames = await waitForElement(() => getAllByText(RegExp(`.${CONSTANTS.CASE_NAME}`, "i")));

        const casesData = CONSTANTS.getCaseAsc();
        caseNames.forEach((caseName, index) => {
            expect(caseName.textContent).toBe(casesData[index].name);
        });
        expect(caseNames.length).toBe(10);
        expect(deps.apiService.fetchCases).toHaveBeenCalledWith({});
    });

    it("shows a table with descend case Name after click order by name button", async () => {
        deps.apiService.fetchCases = jest.fn().mockImplementation((url) => {
            if (url.sortedField === COMPONENTS_CONSTANTS.CASE_COLUMNS_FIELDS[0] && url.sortDirection === "descend") {
                return Promise.resolve(CONSTANTS.getCaseDesc());
            }
            return Promise.resolve(CONSTANTS.getCaseAsc());
        });

        const { getAllByText, getByText } = renderWithGlobalContext(<MyCases />, deps);

        await waitForElement(() => getAllByText(RegExp(`.${CONSTANTS.CASE_NAME}`, "i")));
        const sortButton = getByText(COMPONENTS_CONSTANTS.CASE_COLUMNS_TITLES[0]);
        userEvent.click(sortButton);

        await waitForDomChange();
        const sortedCasesList = getAllByText(RegExp(`.${CONSTANTS.CASE_NAME}`, "i"));
        const caseData = CONSTANTS.getCaseDesc();
        sortedCasesList.forEach((data, index) => {
            expect(data.textContent).toBe(caseData[index][COMPONENTS_CONSTANTS.CASE_COLUMNS_FIELDS[0]]);
        });
        expect(sortedCasesList.length).toBe(10);
        expect(deps.apiService.fetchCases).toHaveBeenCalledWith({
            sortDirection: "descend",
            sortedField: COMPONENTS_CONSTANTS.CASE_COLUMNS_FIELDS[0],
        });
    });

    it("shows a table with descend case Number after click order by name button", async () => {
        deps.apiService.fetchCases = jest.fn().mockImplementation((url) => {
            if (url.sortedField === COMPONENTS_CONSTANTS.CASE_COLUMNS_FIELDS[1] && url.sortDirection === "descend") {
                return Promise.resolve(CONSTANTS.getCaseDesc());
            }
            return Promise.resolve(CONSTANTS.getCaseAsc());
        });

        const { getAllByText, getByText } = renderWithGlobalContext(<MyCases />, deps);

        await waitForElement(() => getAllByText(RegExp(`.${CONSTANTS.CASE_NUMBER}`, "i")));
        const sortButton = getByText(COMPONENTS_CONSTANTS.CASE_COLUMNS_TITLES[1]);
        userEvent.click(sortButton);

        await waitForDomChange();
        const sortedCasesList = getAllByText(RegExp(`.${CONSTANTS.CASE_NUMBER}`, "i"));
        const caseData = CONSTANTS.getCaseDesc();
        sortedCasesList.forEach((data, index) => {
            expect(data.textContent).toBe(caseData[index][COMPONENTS_CONSTANTS.CASE_COLUMNS_FIELDS[1]] || "-");
        });
        expect(sortedCasesList.length).toBe(10);
        expect(deps.apiService.fetchCases).toHaveBeenCalledWith({
            sortDirection: "descend",
            sortedField: COMPONENTS_CONSTANTS.CASE_COLUMNS_FIELDS[1],
        });
    });

    it("shows a table with descend case AddedBy after click order by name button", async () => {
        deps.apiService.fetchCases = jest.fn().mockImplementation((url) => {
            if (url.sortedField === COMPONENTS_CONSTANTS.CASE_COLUMNS_FIELDS[2] && url.sortDirection === "descend") {
                return Promise.resolve(CONSTANTS.getCaseDesc());
            }
            return Promise.resolve(CONSTANTS.getCaseAsc());
        });

        const { getAllByText, getByText } = renderWithGlobalContext(<MyCases />, deps);

        await waitForElement(() => getAllByText(RegExp(`.${CONSTANTS.CASE_ADDED_BY}`, "i")));
        const sortButton = getByText(COMPONENTS_CONSTANTS.CASE_COLUMNS_TITLES[2]);
        userEvent.click(sortButton);

        await waitForDomChange();
        const sortedCasesList = getAllByText(RegExp(`.${CONSTANTS.CASE_ADDED_BY}`, "i"));
        const caseData = CONSTANTS.getCaseDesc();
        sortedCasesList.forEach((data, index) => {
            expect(data.textContent).toBe(caseData[index][COMPONENTS_CONSTANTS.CASE_COLUMNS_FIELDS[2]] || "-");
        });
        expect(sortedCasesList.length).toBe(10);
        expect(deps.apiService.fetchCases).toHaveBeenCalledWith({
            sortDirection: "descend",
            sortedField: COMPONENTS_CONSTANTS.CASE_COLUMNS_FIELDS[2],
        });
    });

    it("shows error and try again button when get an error on fetch", async () => {
        deps.apiService.fetchCases = jest.fn().mockRejectedValue("Error");

        const { getByText, getByTestId } = renderWithGlobalContext(<MyCases />, deps);

        await waitForElement(() => getByText(ERRORS_CONSTANTS.FETCH_ERROR_MODAL_TITLE));
        const refreshButton = getByTestId("error_modal_button");
        expect(deps.apiService.fetchCases).toHaveBeenCalledWith({});
        fireEvent.click(refreshButton);
        await waitForDomChange();
        expect(deps.apiService.fetchCases).toHaveBeenCalledWith({});
    });
});

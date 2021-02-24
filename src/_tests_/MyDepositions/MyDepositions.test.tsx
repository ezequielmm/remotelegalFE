import { fireEvent, waitForDomChange, waitForElement } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import React from "react";
import * as COMPONENTS_CONSTANTS from "../../constants/depositions";
import * as ERRORS_CONSTANTS from "../../constants/errors";
import MyDepositions from "../../routes/MyDepositions";
import * as CONSTANTS from "../constants/depositions";
import * as SIGN_UP_CONSTANTS from "../constants/signUp";
import * as AUTH from "../mocks/Auth";
import getMockDeps from "../utils/getMockDeps";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";

const customDeps = getMockDeps();
const history = createMemoryHistory();

const mockHistoryPush = jest.fn();

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

describe("MyDepositions", () => {
    beforeEach(() => {
        AUTH.VALID();
    });

    it("shows empty state screen when no depositions loaded and go to add deposition modal", async () => {
        customDeps.apiService.fetchDepositions = jest.fn().mockResolvedValue(CONSTANTS.getNoDepositions());
        const { getByText } = renderWithGlobalContext(<MyDepositions />, customDeps);
        expect(customDeps.apiService.fetchDepositions).toHaveBeenCalledWith({});

        const emptyStateTitle = await waitForElement(() => getByText(COMPONENTS_CONSTANTS.EMPTY_STATE_TITLE));
        expect(emptyStateTitle).toBeTruthy();
    });

    it("shows a table with 1 record with a constant name when backend returns 1 deposition", async () => {
        customDeps.apiService.fetchDepositions = jest.fn().mockResolvedValue(CONSTANTS.getDepositions());
        const { getAllByText } = renderWithGlobalContext(<MyDepositions />, customDeps);
        expect(customDeps.apiService.fetchDepositions).toHaveBeenCalledWith({});

        const courtReporter = await waitForElement(() => getAllByText(CONSTANTS.PARTICIPANT_NAME));
        expect(courtReporter.length).toBe(1);
    });

    it.each(
        COMPONENTS_CONSTANTS.getDepositionColumns(history)
            .filter(({ sorter }) => sorter !== false)
            .filter(({ title }) => title)
            .map((column) => [column.title, column])
    )("should sort %s tab  when clicks on it", async (title, { field }: COMPONENTS_CONSTANTS.TableColumn) => {
        const { getByText, deps } = renderWithGlobalContext(<MyDepositions />);
        expect(deps.apiService.fetchDepositions).toHaveBeenCalledWith({});
        await waitForDomChange();
        const sortButton = getByText(title);
        userEvent.click(sortButton);

        await waitForDomChange();
        expect(deps.apiService.fetchDepositions).toHaveBeenCalledWith({
            sortDirection: "descend",
            sortedField: field,
        });

        userEvent.click(sortButton);
        await waitForDomChange();
        expect(deps.apiService.fetchDepositions).toHaveBeenCalledWith({
            sortDirection: "ascend",
            sortedField: field,
        });
    });

    it("shows corresponding columns if user is not admin", async () => {
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUserNotAdmin());

        const { queryByText } = renderWithGlobalContext(<MyDepositions />, customDeps);

        await waitForDomChange();

        expect(queryByText(COMPONENTS_CONSTANTS.STATUS_COLUMN.title)).toBeTruthy();
        expect(queryByText(COMPONENTS_CONSTANTS.CASE_COLUMN.title)).toBeTruthy();
        expect(queryByText(COMPONENTS_CONSTANTS.WITNESS_COLUMN.title)).toBeTruthy();
        expect(queryByText(COMPONENTS_CONSTANTS.DATE_COLUMN.title)).toBeTruthy();
        expect(queryByText(COMPONENTS_CONSTANTS.JOB_COLUMN.title)).toBeTruthy();

        expect(queryByText(COMPONENTS_CONSTANTS.LAW_COLUMN.title)).toBeFalsy();
        expect(queryByText(COMPONENTS_CONSTANTS.REQUESTER_BY_COLUMN.title)).toBeFalsy();
        expect(queryByText(COMPONENTS_CONSTANTS.COURT_REPORTER_COLUMN.title)).toBeFalsy();

        COMPONENTS_CONSTANTS.getDepositionColumns(undefined, false);
    });

    it("shows error and try again button when get an error getting if user is admin", async () => {
        customDeps.apiService.currentUser = jest.fn().mockRejectedValue("Error");

        const { getByText, getByTestId } = renderWithGlobalContext(<MyDepositions />, customDeps);

        await waitForElement(() => getByText(ERRORS_CONSTANTS.FETCH_ERROR_MODAL_TITLE));
        const refreshButton = getByTestId("error_modal_button");
        expect(customDeps.apiService.fetchDepositions).toHaveBeenCalledWith({});
        fireEvent.click(refreshButton);
        await waitForDomChange();
        expect(customDeps.apiService.fetchDepositions).toHaveBeenCalledWith({});
    });

    it("shows error and try again button when get an error on fetch", async () => {
        customDeps.apiService.fetchDepositions = jest.fn().mockRejectedValue("Error");

        const { getByText, getByTestId } = renderWithGlobalContext(<MyDepositions />, customDeps);

        await waitForElement(() => getByText(ERRORS_CONSTANTS.FETCH_ERROR_MODAL_TITLE));
        const refreshButton = getByTestId("error_modal_button");
        expect(customDeps.apiService.fetchDepositions).toHaveBeenCalledWith({});
        fireEvent.click(refreshButton);
        await waitForDomChange();
        expect(customDeps.apiService.fetchDepositions).toHaveBeenCalledWith({});
    });
    it("doesn´t redirect if user is not an admin", async () => {
        const depositions = CONSTANTS.getDepositions();
        customDeps.apiService.fetchDepositions = jest.fn().mockImplementation(async () => {
            return depositions;
        });
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUserNotAdmin());
        const { getByText } = renderWithGlobalContext(<MyDepositions />, customDeps);
        await waitForDomChange();
        fireEvent.click(getByText(depositions[0].witness.name));
        expect(mockHistoryPush).not.toHaveBeenCalled();
    });
    it("redirects to active deposition details if the user is an admin and status is not completed", async () => {
        const depositions = CONSTANTS.getDepositions();
        customDeps.apiService.fetchDepositions = jest.fn().mockImplementation(async () => {
            return depositions;
        });
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const { getByText } = renderWithGlobalContext(<MyDepositions />, customDeps);
        await waitForDomChange();
        fireEvent.click(getByText(depositions[0].participants[0].name));
        expect(mockHistoryPush).toHaveBeenCalledWith(
            `${COMPONENTS_CONSTANTS.DEPOSITION_DETAILS_ROUTE}${depositions[0].id}`
        );
    });

    it("redirects to post deposition details if the user is an admin and status is not completed", async () => {
        const deposition = CONSTANTS.getDepositionWithOverrideValues({ status: "Completed" });
        customDeps.apiService.fetchDepositions = jest.fn().mockImplementation(async () => {
            return [deposition];
        });
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const { getByText } = renderWithGlobalContext(<MyDepositions />, customDeps);
        await waitForDomChange();
        fireEvent.click(getByText(deposition.participants[0].name));
        expect(mockHistoryPush).toHaveBeenCalledWith(
            `${COMPONENTS_CONSTANTS.DEPOSITION_POST_DEPO_ROUTE}${deposition.id}`
        );
    });
});

import { fireEvent, waitForDomChange, waitForElement } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import React from "react";
import * as COMPONENTS_CONSTANTS from "../../constants/depositions";
import { PAST_DEPOSITION_TAB_TITLE, UPCOMING_DEPOSITION_TAB_TITLE } from "../../constants/depositions";
import * as ERRORS_CONSTANTS from "../../constants/errors";
import MyDepositions from "../../routes/MyDepositions";
import { FilterCriteria } from "../../types/DepositionFilterCriteriaType";
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

    it("shows empty state screen when no upcoming depositions loaded and go to add deposition modal", async () => {
        customDeps.apiService.fetchDepositions = jest.fn().mockResolvedValue({ depositions: [] });
        const { getByText } = renderWithGlobalContext(<MyDepositions />, customDeps);
        expect(customDeps.apiService.fetchDepositions).toHaveBeenCalledWith({});

        const emptyStateTitle = await waitForElement(() =>
            getByText(COMPONENTS_CONSTANTS.EMPTY_UPCOMING_DEPOSITIONS_TITLE)
        );
        expect(emptyStateTitle).toBeTruthy();
    });

    it("shows empty state screen when no past depositions loaded and go to add deposition modal", async () => {
        const totalUpcoming = 0;
        const totalPast = 0;
        customDeps.apiService.fetchDepositions = jest
            .fn()
            .mockResolvedValue({ depositions: [], totalUpcoming, totalPast });
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const { queryByText, getByText, deps } = renderWithGlobalContext(<MyDepositions />, customDeps);
        await waitForDomChange();
        const pastTab = queryByText(`${PAST_DEPOSITION_TAB_TITLE} (${totalPast})`);
        expect(pastTab).toHaveAttribute("aria-selected", "false");
        fireEvent.click(pastTab);
        expect(pastTab).toBeInTheDocument();
        expect(pastTab).toHaveAttribute("aria-selected", "true");
        const emptyStateTitle = await waitForElement(() =>
            getByText(COMPONENTS_CONSTANTS.EMPTY_PAST_DEPOSITIONS_TITLE)
        );
        expect(emptyStateTitle).toBeTruthy();
    });

    it("shows a table with 1 record with a constant name when backend returns 1 deposition", async () => {
        customDeps.apiService.fetchDepositions = jest
            .fn()
            .mockResolvedValue({ depositions: CONSTANTS.getDepositions() });
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
            return { depositions };
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
            return { depositions };
        });
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const { getByText } = renderWithGlobalContext(<MyDepositions />, customDeps);
        await waitForDomChange();
        fireEvent.click(getByText(depositions[0].participants[0].name));
        expect(mockHistoryPush).toHaveBeenCalledWith(
            `${COMPONENTS_CONSTANTS.DEPOSITION_DETAILS_ROUTE}${depositions[0].id}`
        );
    });

    it("redirects to past deposition details if the user is an admin and status is not completed", async () => {
        const deposition = CONSTANTS.getDepositionWithOverrideValues({ status: "Completed" });
        customDeps.apiService.fetchDepositions = jest.fn().mockImplementation(async () => {
            return { depositions: [deposition] };
        });
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const { getByText } = renderWithGlobalContext(<MyDepositions />, customDeps);
        await waitForDomChange();
        fireEvent.click(getByText(deposition.participants[0].name));
        expect(mockHistoryPush).toHaveBeenCalledWith(
            `${COMPONENTS_CONSTANTS.DEPOSITION_POST_DEPO_ROUTE}${deposition.id}`
        );
    });

    it("should filter depositions by upcoming depositions by default", async () => {
        const deposition = CONSTANTS.getDepositionWithOverrideValues({ status: "Completed" });
        const depositions = [deposition];
        const totalUpcoming = 1;
        const totalPast = 0;
        customDeps.apiService.fetchDepositions = jest.fn().mockResolvedValue({ depositions, totalUpcoming, totalPast });
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const { queryByText, deps } = renderWithGlobalContext(<MyDepositions />, customDeps);
        await waitForDomChange();
        const upcomingTab = queryByText(`${UPCOMING_DEPOSITION_TAB_TITLE} (${totalUpcoming})`);
        expect(upcomingTab).toBeInTheDocument();
        expect(upcomingTab).toHaveAttribute("aria-selected", "true");
        expect(deps.apiService.fetchDepositions).toHaveBeenCalledWith({});
    });
    it("should filter depositions by past depositions", async () => {
        const deposition = CONSTANTS.getDepositionWithOverrideValues({ status: "Completed" });
        const depositions = [deposition];
        const totalUpcoming = 0;
        const totalPast = 1;
        customDeps.apiService.fetchDepositions = jest.fn().mockResolvedValue({ depositions, totalUpcoming, totalPast });
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const { queryByText, deps } = renderWithGlobalContext(<MyDepositions />, customDeps);
        await waitForDomChange();
        const pastTab = queryByText(`${PAST_DEPOSITION_TAB_TITLE} (${totalPast})`);
        expect(pastTab).toHaveAttribute("aria-selected", "false");
        fireEvent.click(pastTab);
        expect(pastTab).toBeInTheDocument();
        expect(pastTab).toHaveAttribute("aria-selected", "true");
        await waitForDomChange();
        expect(deps.apiService.fetchDepositions).toHaveBeenCalledWith({ MaxDate: new Date().toUTCString() });
    });
    it("should filter depositions by upcoming depositions and sorting by status", async () => {
        const totalUpcoming = 1;
        const totalPast = 0;
        const deposition = CONSTANTS.getDepositionWithOverrideValues({ status: "Completed" });
        const depositions = [deposition];
        customDeps.apiService.fetchDepositions = jest.fn().mockResolvedValue({ depositions, totalUpcoming, totalPast });
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const { queryByText, deps, getByText } = renderWithGlobalContext(<MyDepositions />, customDeps);
        await waitForDomChange();
        const upcomingTab = queryByText(`${UPCOMING_DEPOSITION_TAB_TITLE} (${totalUpcoming})`);
        fireEvent.click(upcomingTab);
        expect(deps.apiService.fetchDepositions).toHaveBeenCalledWith({});
        await waitForDomChange();
        const sortButton = getByText("STATUS");
        userEvent.click(sortButton);
        await waitForDomChange();
        expect(deps.apiService.fetchDepositions).toHaveBeenCalledWith({
            sortDirection: "descend",
            sortedField: "status",
        });
    });

    it("should display totalUpcoming depositions next to the upcoming tab title", async () => {
        const deposition = CONSTANTS.getDepositionWithOverrideValues({ status: "Completed" });
        const depositions = [deposition];
        const totalUpcoming = 1;
        const totalPast = 0;
        customDeps.apiService.fetchDepositions = jest.fn().mockResolvedValue({ depositions, totalUpcoming, totalPast });
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const { queryByText } = renderWithGlobalContext(<MyDepositions />, customDeps);
        await waitForDomChange();
        const upcomingTab = queryByText(`${UPCOMING_DEPOSITION_TAB_TITLE} (${totalUpcoming})`);
        expect(upcomingTab).toBeInTheDocument();
    });

    it("should display totalPast depositions next to the past tab title", async () => {
        const deposition = CONSTANTS.getDepositionWithOverrideValues({ status: "Completed" });
        const depositions = [deposition];
        const totalUpcoming = 0;
        const totalPast = 1;
        customDeps.apiService.fetchDepositions = jest.fn().mockResolvedValue({ depositions, totalUpcoming, totalPast });
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const { queryByText } = renderWithGlobalContext(<MyDepositions />, customDeps);
        await waitForDomChange();
        const pastTab = queryByText(`${PAST_DEPOSITION_TAB_TITLE} (${totalPast})`);
        expect(pastTab).toBeInTheDocument();
    });
});

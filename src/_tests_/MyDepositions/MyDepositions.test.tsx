import { act, fireEvent, waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import React from "react";
import dayjs from "dayjs";
import * as COMPONENTS_CONSTANTS from "../../constants/depositions";
import { PAST_DEPOSITION_TAB_TITLE, UPCOMING_DEPOSITION_TAB_TITLE } from "../../constants/depositions";
import * as ERRORS_CONSTANTS from "../../constants/errors";
import MyDepositions from "../../routes/MyDepositions";
import * as CONSTANTS from "../constants/depositions";
import * as SIGN_UP_CONSTANTS from "../constants/signUp";
import * as AUTH from "../mocks/Auth";
import getMockDeps from "../utils/getMockDeps";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";

import { dateToUTCString } from "../../helpers/dateToUTCString";

import { rootReducer } from "../../state/GlobalState";
import { wait } from "../../helpers/wait";

const MOCKED_DATE = "mocked_date";

jest.mock("../../helpers/dateToUTCString");

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
        const dateHelperMock = dateToUTCString as jest.Mock;
        dateHelperMock.mockImplementation(() => MOCKED_DATE);
    });

    it("shows empty state screen when no upcoming depositions loaded and go to add deposition modal", async () => {
        customDeps.apiService.fetchDepositions = jest.fn().mockResolvedValue({ depositions: [] });
        const { findByText } = renderWithGlobalContext(<MyDepositions />, customDeps, {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null },
                depositionsList: {
                    pageNumber: 1,
                },
            },
        });
        expect(customDeps.apiService.fetchDepositions).toHaveBeenCalledWith({
            page: 1,
            pageSize: 20,
        });

        const emptyStateTitle = await findByText(COMPONENTS_CONSTANTS.EMPTY_UPCOMING_DEPOSITIONS_TITLE);
        expect(emptyStateTitle).toBeTruthy();
    });

    it("shows empty state screen when no past depositions loaded and go to add deposition modal", async () => {
        const totalUpcoming = 0;
        const totalPast = 0;
        customDeps.apiService.fetchDepositions = jest
            .fn()
            .mockResolvedValue({ depositions: [], totalUpcoming, totalPast });
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const { findByText } = renderWithGlobalContext(<MyDepositions />, customDeps, {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null },
                depositionsList: {
                    pageNumber: 1,
                },
            },
        });
        const pastTab = await findByText(`${PAST_DEPOSITION_TAB_TITLE} (${totalPast})`);
        expect(pastTab).toHaveAttribute("aria-selected", "false");
        fireEvent.click(pastTab);
        expect(pastTab).toBeInTheDocument();
        expect(pastTab).toHaveAttribute("aria-selected", "true");
        const emptyStateTitle = await findByText(COMPONENTS_CONSTANTS.EMPTY_PAST_DEPOSITIONS_TITLE);
        expect(emptyStateTitle).toBeTruthy();
    });

    it("shows a table with 1 record with a constant name when backend returns 1 deposition", async () => {
        customDeps.apiService.fetchDepositions = jest
            .fn()
            .mockResolvedValue({ depositions: CONSTANTS.getDepositions() });
        const { findAllByText } = renderWithGlobalContext(<MyDepositions />, customDeps, {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name", isAdmin: true } },
                signalR: { signalR: null },
                depositionsList: {
                    pageNumber: 1,
                },
            },
        });
        expect(customDeps.apiService.fetchDepositions).toHaveBeenCalledWith({
            page: 1,
            pageSize: 20,
        });

        const courtReporter = await findAllByText(CONSTANTS.PARTICIPANT_NAME);
        expect(courtReporter.length).toBe(1);
    });

    it.each(
        COMPONENTS_CONSTANTS.getDepositionColumns(history)
            .filter(({ sorter }) => sorter !== false)
            .filter(({ title }) => title)
            .map((column) => [column.title, column])
    )("should sort %s tab  when clicks on it", async (title, { field }: COMPONENTS_CONSTANTS.TableColumn) => {
        const { findByText, deps } = renderWithGlobalContext(<MyDepositions />, customDeps, {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null },
                depositionsList: {
                    pageNumber: 1,
                },
            },
        });

        const sortButton = await findByText(title);
        act(() => {
            userEvent.click(sortButton);
        });

        act(() => {
            userEvent.click(sortButton);
        });

        await waitFor(() => {
            expect(deps.apiService.fetchDepositions).toHaveBeenNthCalledWith(1, {
                page: 1,
                pageSize: 20,
            });
            expect(deps.apiService.fetchDepositions).toHaveBeenNthCalledWith(2, {
                sortDirection: "descend",
                sortedField: field,
                page: 1,
                pageSize: 20,
            });
            expect(deps.apiService.fetchDepositions).toHaveBeenNthCalledWith(3, {
                sortDirection: "ascend",
                sortedField: field,
                page: 1,
                pageSize: 20,
            });
        });
    });

    it("shows corresponding columns if user is not admin", async () => {
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUserNotAdmin());

        const { queryByText } = renderWithGlobalContext(<MyDepositions />, customDeps, {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name", isAdmin: false } },
                signalR: { signalR: null },
                depositionsList: {
                    pageNumber: 1,
                },
            },
        });

        await waitFor(() => {
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
    });

    it("shows error and try again button when get an error getting if user is admin", async () => {
        const { findByText, findByTestId } = renderWithGlobalContext(<MyDepositions />, customDeps, {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: null },
                signalR: { signalR: null },
                depositionsList: {
                    pageNumber: 1,
                },
            },
        });

        await findByText(ERRORS_CONSTANTS.FETCH_ERROR_MODAL_TITLE);
        const refreshButton = await findByTestId("error_modal_button");
        expect(customDeps.apiService.fetchDepositions).toHaveBeenCalledWith({ page: 1, pageSize: 20 });
        act(() => {
            fireEvent.click(refreshButton);
        });
        await waitFor(() => {
            expect(customDeps.apiService.fetchDepositions).toHaveBeenCalledWith({ page: 1, pageSize: 20 });
        });
    });

    it("shows error and try again button when current user is null", async () => {
        const { findByText, findByTestId } = renderWithGlobalContext(<MyDepositions />, customDeps, {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: null },
                signalR: { signalR: null },
                depositionsList: {
                    pageNumber: 1,
                },
            },
        });

        await findByText(ERRORS_CONSTANTS.FETCH_ERROR_MODAL_TITLE);
        const refreshButton = await findByTestId("error_modal_button");
        fireEvent.click(refreshButton);
        waitFor(() => {
            expect(customDeps.apiService.currentUser).toBeCalled();
        });
    });

    it("shows error and try again button when get an error on fetch", async () => {
        customDeps.apiService.fetchDepositions = jest.fn().mockRejectedValue("Error");

        const { findByText, findByTestId } = renderWithGlobalContext(<MyDepositions />, customDeps);
        await findByText(ERRORS_CONSTANTS.FETCH_ERROR_MODAL_TITLE);
        const refreshButton = await findByTestId("error_modal_button");
        expect(customDeps.apiService.fetchDepositions).toHaveBeenCalledWith({ page: 1, pageSize: 20 });
        fireEvent.click(refreshButton);
        waitFor(() => {
            expect(customDeps.apiService.fetchDepositions).toHaveBeenCalledWith({ page: 1, pageSize: 20 });
        });
    });

    it("doesn´t redirect if user is not an admin", async () => {
        const depositions = CONSTANTS.getDepositions();
        customDeps.apiService.fetchDepositions = jest.fn().mockImplementation(async () => {
            return { depositions };
        });
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUserNotAdmin());
        const { getByText } = renderWithGlobalContext(<MyDepositions />, customDeps, {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { isAdmin: false } },
                signalR: { signalR: null },
                depositionsList: {
                    pageNumber: 1,
                },
            },
        });
        await waitFor(() => {
            fireEvent.click(getByText(depositions[0].witness.name));
            expect(mockHistoryPush).not.toHaveBeenCalled();
        });
    });
    it("redirects to active deposition details if the user is an admin and status is not completed", async () => {
        const depositions = CONSTANTS.getDepositions();
        customDeps.apiService.fetchDepositions = jest.fn().mockImplementation(async () => {
            return { depositions };
        });
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const { getByText } = renderWithGlobalContext(<MyDepositions />, customDeps, {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name", isAdmin: true } },
                signalR: { signalR: null },
                depositionsList: {
                    pageNumber: 1,
                },
            },
        });
        await waitFor(() => {
            fireEvent.click(getByText(depositions[0].participants[0].name));
            expect(mockHistoryPush).toHaveBeenCalledWith(
                `${COMPONENTS_CONSTANTS.DEPOSITION_DETAILS_ROUTE}${depositions[0].id}`
            );
        });
    });

    it("redirects to past deposition details if the user is an admin and status is not completed", async () => {
        const deposition = CONSTANTS.getDepositionWithOverrideValues({ status: "Completed" });
        customDeps.apiService.fetchDepositions = jest.fn().mockImplementation(async () => {
            return { depositions: [deposition] };
        });
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const { getByText } = renderWithGlobalContext(<MyDepositions />, customDeps, {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name", isAdmin: true } },
                signalR: { signalR: null },
                depositionsList: {
                    pageNumber: 1,
                },
            },
        });
        await waitFor(() => {
            fireEvent.click(getByText(deposition.participants[0].name));
            expect(mockHistoryPush).toHaveBeenCalledWith(
                `${COMPONENTS_CONSTANTS.DEPOSITION_POST_DEPO_ROUTE}${deposition.id}`
            );
        });
    });

    it("should filter depositions by upcoming depositions by default", async () => {
        const deposition = CONSTANTS.getDepositionWithOverrideValues({ status: "Completed" });
        const depositions = [deposition];
        const totalUpcoming = 1;
        const totalPast = 0;
        customDeps.apiService.fetchDepositions = jest.fn().mockResolvedValue({ depositions, totalUpcoming, totalPast });
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const { deps, findByText } = renderWithGlobalContext(<MyDepositions />, customDeps, {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null },
                depositionsList: {
                    pageNumber: 1,
                },
            },
        });
        const upcomingTab = await findByText(`${UPCOMING_DEPOSITION_TAB_TITLE} (${totalUpcoming})`);
        await waitFor(() => {
            expect(upcomingTab).toBeInTheDocument();
            expect(upcomingTab).toHaveAttribute("aria-selected", "true");
            expect(deps.apiService.fetchDepositions).toHaveBeenCalledWith({
                page: 1,
                pageSize: 20,
            });
        });
    });

    it("should filter depositions by past depositions", async () => {
        const deposition = CONSTANTS.getDepositionWithOverrideValues({ status: "Completed" });
        const depositions = [deposition];
        const totalUpcoming = 0;
        const totalPast = 1;
        customDeps.apiService.fetchDepositions = jest.fn().mockResolvedValue({ depositions, totalUpcoming, totalPast });
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const { deps, findByText } = renderWithGlobalContext(<MyDepositions />, customDeps, {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null },
                depositionsList: {
                    pageNumber: 1,
                },
            },
        });
        const pastTab = await findByText(`${PAST_DEPOSITION_TAB_TITLE} (${totalPast})`);
        expect(pastTab).toHaveAttribute("aria-selected", "false");
        fireEvent.click(pastTab);
        expect(pastTab).toBeInTheDocument();
        expect(pastTab).toHaveAttribute("aria-selected", "true");
        await waitFor(() => {
            expect(deps.apiService.fetchDepositions).toHaveBeenCalledWith({
                PastDepositions: true,
                page: 1,
                pageSize: 20,
            });
        });
    });
    it("should filter depositions by upcoming depositions and sorting by status", async () => {
        const totalUpcoming = 1;
        const totalPast = 0;
        const deposition = CONSTANTS.getDepositionWithOverrideValues({ status: "Completed" });
        const depositions = [deposition];
        customDeps.apiService.fetchDepositions = jest.fn().mockResolvedValue({ depositions, totalUpcoming, totalPast });
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const { deps, findByText } = renderWithGlobalContext(<MyDepositions />, customDeps, {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null },
                depositionsList: {
                    pageNumber: 1,
                },
            },
        });
        const upcomingTab = await findByText(`${UPCOMING_DEPOSITION_TAB_TITLE} (${totalUpcoming})`);
        fireEvent.click(upcomingTab);
        expect(deps.apiService.fetchDepositions).toHaveBeenCalledWith({
            page: 1,
            pageSize: 20,
            PastDepositions: false,
        });
        const sortButton = await findByText("STATUS");
        userEvent.click(sortButton);
        await waitFor(() => {
            expect(deps.apiService.fetchDepositions).toHaveBeenCalledWith({
                sortDirection: "descend",
                sortedField: "status",
                page: 1,
                pageSize: 20,
                PastDepositions: false,
            });
        });
    });

    it("should display totalUpcoming depositions next to the upcoming tab title", async () => {
        const deposition = CONSTANTS.getDepositionWithOverrideValues({ status: "Completed" });
        const depositions = [deposition];
        const totalUpcoming = 1;
        const totalPast = 0;
        customDeps.apiService.fetchDepositions = jest.fn().mockResolvedValue({ depositions, totalUpcoming, totalPast });
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const { findByText } = renderWithGlobalContext(<MyDepositions />, customDeps, {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null },
                depositionsList: {
                    pageNumber: 1,
                },
            },
        });
        const upcomingTab = await findByText(`${UPCOMING_DEPOSITION_TAB_TITLE} (${totalUpcoming})`);
        expect(upcomingTab).toBeInTheDocument();
    });

    it("should display totalPast depositions next to the past tab title", async () => {
        const deposition = CONSTANTS.getDepositionWithOverrideValues({ status: "Completed" });
        const depositions = [deposition];
        const totalUpcoming = 0;
        const totalPast = 1;
        customDeps.apiService.fetchDepositions = jest.fn().mockResolvedValue({ depositions, totalUpcoming, totalPast });
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const { findByText } = renderWithGlobalContext(<MyDepositions />, customDeps, {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null },
                depositionsList: {
                    pageNumber: 1,
                },
            },
        });
        const pastTab = await findByText(`${PAST_DEPOSITION_TAB_TITLE} (${totalPast})`);
        expect(pastTab).toBeInTheDocument();
    });

    it("should display the date range when has more than one deposition", async () => {
        const deposition = CONSTANTS.getDepositionWithOverrideValues({ status: "Completed" });
        const depositions = [deposition];
        const totalUpcoming = 0;
        const totalPast = 1;
        customDeps.apiService.fetchDepositions = jest.fn().mockResolvedValue({ depositions, totalUpcoming, totalPast });
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const { findByTestId } = renderWithGlobalContext(<MyDepositions />, customDeps, {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null },
                depositionsList: {
                    pageNumber: 1,
                },
            },
        });
        expect(await findByTestId("depositions_date_range")).toBeInTheDocument();
    });

    it("should call the fetchDepositions with the minDate and maxDate with today date values after clicks on today button", async () => {
        const deposition = CONSTANTS.getDepositionWithOverrideValues({ status: "Completed" });
        const depositions = [deposition];
        const totalUpcoming = 0;
        const totalPast = 1;
        customDeps.apiService.fetchDepositions = jest.fn().mockResolvedValue({ depositions, totalUpcoming, totalPast });
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const { getByPlaceholderText, queryByText, deps } = renderWithGlobalContext(<MyDepositions />, customDeps, {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null },
                depositionsList: {
                    pageNumber: 1,
                },
            },
        });
        await waitFor(async () => {
            const startDateRangeInput = getByPlaceholderText("Start date");
            await act(async () => {
                userEvent.click(startDateRangeInput);
                const todayDateRangeButton = queryByText("Today");
                expect(todayDateRangeButton).toBeInTheDocument();
                fireEvent.click(todayDateRangeButton);
            });
        });

        await wait(500);
        expect(deps.apiService.fetchDepositions).toHaveBeenNthCalledWith(2, {
            page: 1,
            pageSize: 20,
            MaxDate: MOCKED_DATE,
            MinDate: MOCKED_DATE,
        });
    });

    it("should call the fetchDepositions with the minDate and maxDate with week date values after clicks on week button", async () => {
        const deposition = CONSTANTS.getDepositionWithOverrideValues({ status: "Completed" });
        const depositions = [deposition];
        const totalUpcoming = 0;
        const totalPast = 1;
        customDeps.apiService.fetchDepositions = jest.fn().mockResolvedValue({ depositions, totalUpcoming, totalPast });
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const { deps, findByPlaceholderText, findByText } = renderWithGlobalContext(<MyDepositions />, customDeps, {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null },
                depositionsList: {
                    pageNumber: 1,
                },
            },
        });

        const startDateRangeInput = await findByPlaceholderText("Start date");
        userEvent.click(startDateRangeInput);
        const todayDateRangeButton = await findByText("This Week");
        expect(todayDateRangeButton).toBeInTheDocument();
        fireEvent.click(todayDateRangeButton);
        expect(deps.apiService.fetchDepositions).toHaveBeenNthCalledWith(2, {
            page: 1,
            pageSize: 20,
            MinDate: MOCKED_DATE,
            MaxDate: MOCKED_DATE,
        });
    });

    it("should call the fetchDepositions with the minDate and maxDate with month date values after clicks on month button", async () => {
        const deposition = CONSTANTS.getDepositionWithOverrideValues({ status: "Completed" });
        const depositions = [deposition];
        const totalUpcoming = 0;
        const totalPast = 1;
        customDeps.apiService.fetchDepositions = jest.fn().mockResolvedValue({ depositions, totalUpcoming, totalPast });
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const { findByPlaceholderText, findByText, deps } = renderWithGlobalContext(<MyDepositions />, customDeps, {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null },
                depositionsList: {
                    pageNumber: 1,
                },
            },
        });
        const startDateRangeInput = await findByPlaceholderText("Start date");
        userEvent.click(startDateRangeInput);
        const todayDateRangeButton = await findByText("This Month");
        expect(todayDateRangeButton).toBeInTheDocument();
        fireEvent.click(todayDateRangeButton);
        expect(deps.apiService.fetchDepositions).toHaveBeenNthCalledWith(2, {
            page: 1,
            pageSize: 20,
            MinDate: MOCKED_DATE,
            MaxDate: MOCKED_DATE,
        });
    });

    it("should fetch depositions with page 2 when clicks on the paginator page number equal to 2", async () => {
        const depositionsArr = new Array(30);
        for (var i = 0; i < depositionsArr.length; i++) {
            depositionsArr[i] = CONSTANTS.getDepositionWithOverrideValues({ status: "Completed", id: i });
        }
        const depositions = depositionsArr;
        const totalUpcoming = 0;
        const totalPast = 2;
        customDeps.apiService.fetchDepositions = jest.fn().mockResolvedValue({ depositions, totalUpcoming, totalPast });
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const { queryByText, deps } = renderWithGlobalContext(<MyDepositions />, customDeps, {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null },
                depositionsList: {
                    pageNumber: 1,
                },
            },
        });

        await waitFor(() => {
            expect(document.querySelector(".ant-table-pagination")).toBeInTheDocument();
            expect(queryByText("2")).toBeInTheDocument();
        });
        await act(async () => {
            await fireEvent.click(queryByText("2"));
        });
        expect(deps.apiService.fetchDepositions).toHaveBeenNthCalledWith(1, {
            page: 1,
            pageSize: 20,
        });
        expect(deps.apiService.fetchDepositions).toHaveBeenNthCalledWith(2, {
            page: 2,
            pageSize: 20,
        });
    });

    it("should fetch deposition with min and max date values after select a date on the range picker component", async () => {
        const deposition = CONSTANTS.getDepositionWithOverrideValues({ status: "Completed" });
        const depositions = [deposition];
        const totalUpcoming = 0;
        const totalPast = 1;
        customDeps.apiService.fetchDepositions = jest.fn().mockResolvedValue({ depositions, totalUpcoming, totalPast });
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const { queryAllByText, deps, findByPlaceholderText } = renderWithGlobalContext(<MyDepositions />, customDeps, {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null },
                depositionsList: {
                    pageNumber: 1,
                },
            },
        });
        const startDateRangeInput = await findByPlaceholderText("Start date");
        userEvent.click(startDateRangeInput);

        const minMaxDate = dayjs();

        await act(async () => {
            await fireEvent.click(queryAllByText(minMaxDate.format("D"))[0]);
            await fireEvent.click(queryAllByText(minMaxDate.format("D"))[1]);
        });

        expect(deps.apiService.fetchDepositions).toHaveBeenNthCalledWith(2, {
            page: 1,
            pageSize: 20,
            MinDate: MOCKED_DATE,
            MaxDate: MOCKED_DATE,
        });
    });

    it("Should not able select the date after today + 365 days", async () => {
        const deposition = CONSTANTS.getDepositionWithOverrideValues({ status: "Completed" });
        const depositions = [deposition];
        const totalUpcoming = 0;
        const totalPast = 1;
        customDeps.apiService.fetchDepositions = jest.fn().mockResolvedValue({ depositions, totalUpcoming, totalPast });
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const { queryAllByTitle, findByPlaceholderText } = renderWithGlobalContext(<MyDepositions />, customDeps, {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null },
                depositionsList: {
                    pageNumber: 1,
                },
            },
        });
        const startDateRangeInput = await findByPlaceholderText("End date");
        const disabledNextYearAndMonthDate = dayjs().add(365, "day");
        await act(async () => {
            await userEvent.click(startDateRangeInput);
            await userEvent.click(document.querySelector(".ant-picker-header-super-next-btn"));
            await fireEvent.change(startDateRangeInput, {
                target: { value: disabledNextYearAndMonthDate.format("YYYY-MM-DD") },
            });
        });

        expect(queryAllByTitle(disabledNextYearAndMonthDate.format("YYYY-MM-DD"))[0]).toHaveClass(
            "ant-picker-cell-disabled"
        );
    });

    it("Should able select the date between today + 364 days", async () => {
        const deposition = CONSTANTS.getDepositionWithOverrideValues({ status: "Completed" });
        const depositions = [deposition];
        const totalUpcoming = 0;
        const totalPast = 1;
        customDeps.apiService.fetchDepositions = jest.fn().mockResolvedValue({ depositions, totalUpcoming, totalPast });
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const { queryAllByTitle, findByPlaceholderText } = renderWithGlobalContext(<MyDepositions />, customDeps, {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null },
                depositionsList: {
                    pageNumber: 1,
                },
            },
        });
        const startDateRangeInput = await findByPlaceholderText("End date");
        const nextYearAndMonthDate = dayjs().add(364, "day");
        const disabledNextYearAndMonthDate = dayjs().add(365, "day");
        await act(async () => {
            await userEvent.click(startDateRangeInput);
            await userEvent.click(document.querySelector(".ant-picker-header-next-btn"));
            await fireEvent.change(startDateRangeInput, {
                target: { value: nextYearAndMonthDate.format("YYYY-MM-DD") },
            });
        });

        expect(queryAllByTitle(nextYearAndMonthDate.format("YYYY-MM-DD"))[0]).not.toHaveClass(
            "ant-picker-cell-disabled"
        );
        expect(queryAllByTitle(disabledNextYearAndMonthDate.format("YYYY-MM-DD"))[0]).toHaveClass(
            "ant-picker-cell-disabled"
        );
    });

    it("should show the 'created on' column when the user is admin", async () => {
        const deposition = CONSTANTS.getDepositionWithOverrideValues({ status: "Completed" });
        const depositions = [deposition];
        const totalUpcoming = 1;
        const totalPast = 1;
        customDeps.apiService.fetchDepositions = jest.fn().mockResolvedValue({ depositions, totalUpcoming, totalPast });
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        renderWithGlobalContext(<MyDepositions />, customDeps, {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name", isAdmin: true } },
                signalR: { signalR: null },
                depositionsList: {
                    pageNumber: 1,
                },
            },
        });
        await waitFor(() => expect(screen.queryByText("CREATED ON")).toBeInTheDocument());
    });

    it("should show the 'created on' column when the user is end user", async () => {
        const deposition = CONSTANTS.getDepositionWithOverrideValues({ status: "Completed" });
        const depositions = [deposition];
        const totalUpcoming = 1;
        const totalPast = 1;
        customDeps.apiService.fetchDepositions = jest.fn().mockResolvedValue({ depositions, totalUpcoming, totalPast });
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        renderWithGlobalContext(<MyDepositions />, customDeps, {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null },
                depositionsList: {
                    pageNumber: 1,
                },
            },
        });
        await waitFor(() => expect(screen.queryByText("CREATED ON")).toBeInTheDocument());
    });
});

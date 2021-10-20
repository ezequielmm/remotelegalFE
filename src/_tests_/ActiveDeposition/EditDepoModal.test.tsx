import { fireEvent, act, waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import utc from "dayjs/plugin/utc";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { Status } from "@rl/prp-components-library/src/components/StatusPill/StatusPill";
import * as CONSTANTS from "../../constants/activeDepositionDetails";
import * as TEST_CONSTANTS from "../constants/activeDepositionDetails";
import { getDepositionWithOverrideValues } from "../constants/depositions";
import getMockDeps from "../utils/getMockDeps";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import ActiveDepositionDetails from "../../routes/ActiveDepoDetails";
import { TimeZones, mapTimeZone } from "../../models/general";
import getModalTextContent from "../../routes/ActiveDepoDetails/helpers/getModalTextContent";
import { rootReducer } from "../../state/GlobalState";

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(utc);

dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
const customDeps = getMockDeps();

describe("Tests Edit Deposition Modal", () => {
    test("Shows toast when submitting from pending to confirm", async () => {
        const { startDate } = TEST_CONSTANTS.EXPECTED_DEPOSITION_BODY;
        const fullDeposition = getDepositionWithOverrideValues({ startDate, endDate: null, status: "Pending" });
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        customDeps.apiService.editDeposition = jest.fn().mockImplementation(async () => {
            return {};
        });
        const modalText = getModalTextContent(Status.confirmed, fullDeposition);
        const { getAllByTestId, getAllByText, getByTestId, getByText } = renderWithGlobalContext(
            <ActiveDepositionDetails />,
            customDeps,
            {
                ...rootReducer,
                initialState: {
                    user: {
                        currentUser: {
                            firstName: "First Name",
                            lastName: "Last Name",
                            emailAddress: "test@test.com",
                            isAdmin: true,
                        },
                    },
                },
            }
        );
        await waitFor(() => {
            const editButton = getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
            fireEvent.click(editButton[0]);
        });
        const options = getAllByText("Pending");
        userEvent.click(options[2]);
        const confirmed = await waitFor(() => getAllByText("Confirmed"));
        userEvent.click(confirmed[1]);
        fireEvent.click(getByTestId("false NO"));
        fireEvent.click(
            getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CAPTION_BUTTON_TEST_ID).childNodes[2]
        );
        expect(getByTestId("caption_input")).toBeInTheDocument();
        const file = new File(["file"], "file.pdf", { type: "application/pdf" });
        await act(async () => {
            await fireEvent.change(
                getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_UPLOAD_COMPONENT_DATA_TEST_ID),
                {
                    target: { files: [file] },
                }
            );
        });
        fireEvent.change(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_DATA_TEST_ID_JOB), {
            target: { value: TEST_CONSTANTS.EXPECTED_EDIT_DEPOSITION_BODY.job },
        });

        fireEvent.change(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_DATA_TEST_ID_DETAILS), {
            target: { value: TEST_CONSTANTS.EXPECTED_EDIT_DEPOSITION_BODY.details },
        });
        userEvent.click(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CONFIRM_BUTTON_TEST_ID));
        await waitFor(() => {
            expect(getByText(modalText.cancelButton)).toBeInTheDocument();
            expect(getByText(modalText.confirmButton)).toBeInTheDocument();
            expect(getByText(modalText.message)).toBeInTheDocument();
            expect(getByText(modalText.title)).toBeInTheDocument();
        });
        fireEvent.click(getByText(modalText.confirmButton));
        await waitFor(() => {
            expect(getByText(CONSTANTS.DEPOSITION_DETAILS_CHANGE_TO_CONFIRM_EMAIL_SENT_TO_ALL)).toBeInTheDocument();
        });
        expect(customDeps.apiService.editDeposition).toHaveBeenCalledWith(
            fullDeposition.id,
            {
                ...TEST_CONSTANTS.EXPECTED_EDIT_DEPOSITION_BODY,
                endDate: null,
                calendarDate: dayjs("2021-04-21T10:00:00.000Z").tz(mapTimeZone.ET),
                file,
                startDate: dayjs(startDate).tz(mapTimeZone.ET).format("YYYY-MM-DD[T]HH:mm:ss.SSSZ"),
                timeZone: TimeZones.ET,
            },
            file,
            true
        );
    });

    test("Shows cancel message when submitting from confirm to cancel", async () => {
        const { startDate } = TEST_CONSTANTS.EXPECTED_DEPOSITION_BODY;
        const fullDeposition = getDepositionWithOverrideValues({ startDate, endDate: null, status: "Confirmed" });
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        customDeps.apiService.cancelDeposition = jest.fn().mockImplementation(async () => {
            return {};
        });
        const modalText = getModalTextContent(Status.canceled, fullDeposition);
        const { getAllByTestId, getAllByText, getByTestId, getByText } = renderWithGlobalContext(
            <ActiveDepositionDetails />,
            customDeps,
            {
                ...rootReducer,
                initialState: {
                    user: {
                        currentUser: {
                            firstName: "First Name",
                            lastName: "Last Name",
                            emailAddress: "test@test.com",
                            isAdmin: true,
                        },
                    },
                },
            }
        );
        await waitFor(() => {
            const editButton = getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
            fireEvent.click(editButton[0]);
        });
        const options = getAllByText("Confirmed");
        userEvent.click(options[2]);
        const canceled = await waitFor(() => getAllByText("Canceled"));
        userEvent.click(canceled[0]);

        userEvent.click(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CONFIRM_BUTTON_TEST_ID));
        await waitFor(() => {
            expect(getByText(modalText.cancelButton)).toBeInTheDocument();
            expect(getByText(modalText.confirmButton)).toBeInTheDocument();
            expect(getByText(modalText.message)).toBeInTheDocument();
            expect(getByText(modalText.title)).toBeInTheDocument();
        });
        fireEvent.click(getByText(modalText.confirmButton));
        await waitFor(() => {
            expect(getByText(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_SUCCESS_TOAST)).toBeInTheDocument();
        });
        expect(customDeps.apiService.cancelDeposition).toHaveBeenCalledWith(fullDeposition.id);
    });
    test("validates that file is a not a PDF file", async () => {
        const fullDeposition = getDepositionWithOverrideValues();
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        customDeps.apiService.editDeposition = jest.fn().mockImplementation(async () => {
            return {};
        });
        const { getAllByTestId, getByTestId, getByText } = renderWithGlobalContext(
            <ActiveDepositionDetails />,
            customDeps,
            {
                ...rootReducer,
                initialState: {
                    user: {
                        currentUser: {
                            firstName: "First Name",
                            lastName: "Last Name",
                            emailAddress: "test@test.com",
                            isAdmin: true,
                        },
                    },
                },
            }
        );
        await waitFor(() => {
            const editButton = getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
            fireEvent.click(editButton[0]);
        });
        fireEvent.click(
            getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CAPTION_BUTTON_TEST_ID).childNodes[2]
        );
        expect(getByTestId("caption_input")).toBeInTheDocument();
        const file = new File(["file"], "file.png", { type: "application/image" });
        await act(async () => {
            await fireEvent.change(
                getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_UPLOAD_COMPONENT_DATA_TEST_ID),
                {
                    target: { files: [file] },
                }
            );
        });

        expect(getByText(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_FILE_ERROR_MESSAGE)).toBeInTheDocument();
    });
    test("Shows error toast if fetch fails", async () => {
        const fullDeposition = getDepositionWithOverrideValues();
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        customDeps.apiService.editDeposition = jest.fn().mockRejectedValue(async () => {
            throw Error("Something wrong");
        });
        const { getAllByTestId, getAllByText, getByTestId } = renderWithGlobalContext(
            <ActiveDepositionDetails />,
            customDeps,
            {
                ...rootReducer,
                initialState: {
                    user: {
                        currentUser: {
                            firstName: "First Name",
                            lastName: "Last Name",
                            emailAddress: "test@test.com",
                            isAdmin: true,
                        },
                    },
                },
            }
        );
        await waitFor(() => {
            const editButton = getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
            fireEvent.click(editButton[0]);
        });
        userEvent.click(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CONFIRM_BUTTON_TEST_ID));
        await waitFor(() => getAllByText(CONSTANTS.NETWORK_ERROR));
    });
    test("Show an invalid end time label when the end time is before start time", async () => {
        const startDate = new Date(new Date().getTime() + 30 * 60000);
        const endTime = dayjs(startDate).tz(mapTimeZone[TimeZones.ET]).subtract(15, "m").format(CONSTANTS.TIME_FORMAT);
        const fullDeposition = getDepositionWithOverrideValues({ startDate });

        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        const { getAllByTestId, queryByTestId, getAllByRole } = renderWithGlobalContext(
            <ActiveDepositionDetails />,
            customDeps,
            {
                ...rootReducer,
                initialState: {
                    user: {
                        currentUser: {
                            firstName: "First Name",
                            lastName: "Last Name",
                            emailAddress: "test@test.com",
                            isAdmin: true,
                        },
                    },
                },
            }
        );
        await waitFor(() => {
            const editButton = getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
            fireEvent.click(editButton[0]);
        });
        const startTimeInput = queryByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_START_TIME_TEST_ID);
        const endTimeInput = queryByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_END_TIME_TEST_ID);
        expect(startTimeInput).toBeInTheDocument();
        expect(endTimeInput).toBeInTheDocument();

        await act(async () => {
            userEvent.click(endTimeInput);
            await fireEvent.change(endTimeInput, {
                target: { value: endTime },
            });
        });
        await act(async () => {
            const okButtonEndTimeInput = getAllByRole("button", { name: /ok/i })[0];
            userEvent.click(okButtonEndTimeInput);
            fireEvent.blur(endTimeInput);
        });
        expect(queryByTestId(CONSTANTS.DEPOSITIONS_DETAILS_EDIT_MODAL_INVALID_END_TIME_TEST_ID)).toBeInTheDocument();
    });

    test("Show an invalid start time label when the start is before start time", async () => {
        const { startDate } = TEST_CONSTANTS.EXPECTED_DEPOSITION_BODY;
        const startTime = dayjs(startDate).tz(mapTimeZone[TimeZones.ET]).add(6, "m").format(CONSTANTS.TIME_FORMAT);
        const endTime = dayjs(startDate).tz(mapTimeZone[TimeZones.ET]).format(CONSTANTS.TIME_FORMAT);
        const fullDeposition = getDepositionWithOverrideValues({ startDate });
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        const { getAllByTestId, queryByTestId, getAllByRole } = renderWithGlobalContext(
            <ActiveDepositionDetails />,
            customDeps,
            {
                ...rootReducer,
                initialState: {
                    user: {
                        currentUser: {
                            firstName: "First Name",
                            lastName: "Last Name",
                            emailAddress: "test@test.com",
                            isAdmin: true,
                        },
                    },
                },
            }
        );
        await waitFor(() => {
            const editButton = getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
            fireEvent.click(editButton[0]);
        });
        const startTimeInput = queryByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_START_TIME_TEST_ID);
        const endTimeInput = queryByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_END_TIME_TEST_ID);
        expect(startTimeInput).toBeInTheDocument();
        expect(endTimeInput).toBeInTheDocument();

        await act(async () => {
            userEvent.click(startTimeInput);
            await fireEvent.change(startTimeInput, {
                target: { value: startTime },
            });
        });
        await act(async () => {
            userEvent.click(endTimeInput);
            await fireEvent.change(endTimeInput, {
                target: { value: endTime },
            });
        });
        await act(async () => {
            const okButtonStartTimeInput = getAllByRole("button", { name: /ok/i })[0];
            userEvent.click(okButtonStartTimeInput);
            fireEvent.blur(startTimeInput);
        });
        await act(async () => {
            const okButtonEndTimeInput = getAllByRole("button", { name: /ok/i })[0];
            userEvent.click(okButtonEndTimeInput);
            fireEvent.blur(endTimeInput);
        });
        expect(queryByTestId(CONSTANTS.DEPOSITIONS_DETAILS_EDIT_MODAL_INVALID_START_TIME_TEST_ID)).toBeInTheDocument();
    });

    test("Show an invalid start time label when the time is previous than today's time", async () => {
        const startDate = dayjs();
        const dateInTheFuture = dayjs(startDate).tz(mapTimeZone[TimeZones.ET]).add(1, "d").format();

        const startTimeBefore = dayjs(startDate).subtract(6, "m").format(CONSTANTS.TIME_FORMAT);
        const fullDeposition = getDepositionWithOverrideValues({ startDate });
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        renderWithGlobalContext(<ActiveDepositionDetails />, customDeps, {
            ...rootReducer,
            initialState: {
                user: {
                    currentUser: {
                        firstName: "First Name",
                        lastName: "Last Name",
                        emailAddress: "test@test.com",
                        isAdmin: true,
                    },
                },
            },
        });
        await waitFor(() => {
            const editButton = screen.getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
            fireEvent.click(editButton[0]);
        });
        const startTimeInput = await screen.findByTestId(
            CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_START_TIME_TEST_ID
        );
        expect(startTimeInput).toBeInTheDocument();

        const startDateInput = await screen.findByTestId(
            CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_DATA_TEST_ID_DATE
        );

        expect(startDateInput).toBeInTheDocument();

        await act(async () => {
            userEvent.click(startDateInput);
            await fireEvent.change(startDateInput, {
                target: { value: dateInTheFuture },
            });
        });

        await act(async () => {
            userEvent.click(startTimeInput);
            await fireEvent.change(startTimeInput, {
                target: { value: startTimeBefore },
            });
        });

        await act(async () => {
            const okButtonStartTimeInput = screen.getAllByRole("button", { name: /ok/i })[0];
            userEvent.click(okButtonStartTimeInput);
            fireEvent.blur(startTimeInput);
        });

        await act(async () => {
            userEvent.click(startDateInput);
            await fireEvent.change(startDateInput, {
                target: { value: startDate },
            });
        });

        expect(
            screen.getByTestId(CONSTANTS.DEPOSITIONS_DETAILS_EDIT_MODAL_INVALID_START_TIME_TEST_ID)
        ).toBeInTheDocument();
    });
});

import { waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import React from "react";
import { Route } from "react-router-dom";
import { FORMAT_DATE, FORMAT_TIME } from "../../constants/depositionDetails";
import * as ERROR_CONSTANTS from "../../constants/errors";
import * as CONSTANTS from "../../constants/depositionDetails";
import { wait } from "../../helpers/wait";
import DepositionDetails from "../../routes/DepositionDetails";
import * as TESTS_CONSTANTS from "../constants/depositionDetails";
import { DEPOSITION_ID, getDepositions } from "../constants/depositions";
import getMockDeps from "../utils/getMockDeps";
import DEPO_PARTICIPANT_MOCK from "../mocks/depoParticipant";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import DepositionDetailsAttendees from "../../routes/DepositionDetails/DepositionDetailsAttendees";
import { Roles } from "../../models/participant";
import { mapTimeZone } from "../../models/general";
import "mutationobserver-shim";

dayjs.extend(utc);
dayjs.extend(timezone);

jest.mock("audio-recorder-polyfill", () => {
    return jest.fn().mockImplementation(() => ({
        start: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        stop: jest.fn(),
        stream: { getTracks: () => [{ stop: () => {} }] },
    }));
});

(global.navigator as any).mediaDevices = {
    getUserMedia: jest.fn().mockResolvedValue(true),
};

const history = createMemoryHistory();
let customDeps;

describe("DepositionDetails", () => {
    beforeEach(() => {
        customDeps = getMockDeps();
    });
    test("Load Header with deposition details", async () => {
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return getDepositions()[0];
        });
        const { getByText } = renderWithGlobalContext(
            <Route exact path={TESTS_CONSTANTS.ROUTE} component={DepositionDetails} />,
            customDeps,
            undefined,
            history
        );
        history.push(TESTS_CONSTANTS.TEST_ROUTE);
        await waitFor(() => {
            const deposition = getDepositions()[0];

            expect(getByText(deposition.caseName)).toBeInTheDocument();
            expect(getByText(deposition.caseNumber)).toBeInTheDocument();
            expect(getByText(deposition.witness.name)).toBeInTheDocument();
            expect(
                getByText(dayjs(deposition.startDate).tz(mapTimeZone[deposition.timeZone]).format(FORMAT_DATE))
            ).toBeInTheDocument();
            const startDate = dayjs(deposition.startDate)
                .tz(mapTimeZone[deposition.timeZone])
                .format(FORMAT_TIME)
                .split(" ");
            const completeDate = dayjs(deposition.completeDate)
                .tz(mapTimeZone[deposition.timeZone])
                .format(FORMAT_TIME);
            expect(
                getByText(
                    `${
                        startDate[1] === completeDate.split(" ")[1] ? startDate[0] : startDate.join(" ").toLowerCase()
                    } to ${completeDate.toLowerCase()} ${deposition.timeZone}`
                )
            ).toBeInTheDocument();
            expect(getByText(deposition.job)).toBeInTheDocument();
        });
    });
    test("Load Header with deposition details with actual start date", async () => {
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return getDepositions()[0];
        });
        const { getByText } = renderWithGlobalContext(
            <Route exact path={TESTS_CONSTANTS.ROUTE} component={DepositionDetails} />,
            customDeps,
            undefined,
            history
        );
        history.push(TESTS_CONSTANTS.TEST_ROUTE);

        await waitFor(() => {
            const deposition = getDepositions()[0];

            const actualStartDate = dayjs(deposition.actualStartDate)
                .tz(mapTimeZone[deposition.timeZone])
                .format(FORMAT_TIME)
                .split(" ");
            const completeDate = dayjs(deposition.completeDate)
                .tz(mapTimeZone[deposition.timeZone])
                .format(FORMAT_TIME);
            expect(
                getByText(`${actualStartDate[0]} to ${completeDate.toLowerCase()} ${deposition.timeZone}`)
            ).toBeInTheDocument();
        });
    });

    test("Error screen is shown when fetch fails", async () => {
        customDeps.apiService.fetchDeposition = jest.fn().mockRejectedValue({});
        const { getByText } = renderWithGlobalContext(
            <Route exact path={TESTS_CONSTANTS.ROUTE} component={DepositionDetails} />,
            customDeps,
            undefined,
            history
        );
        history.push(TESTS_CONSTANTS.TEST_ROUTE);
        await waitFor(() => {
            getByText(ERROR_CONSTANTS.FETCH_ERROR_MODAL_TITLE);
            getByText(ERROR_CONSTANTS.FETCH_ERROR_MODAL_BODY);
            return getByText(ERROR_CONSTANTS.FETCH_ERROR_MODAL_BUTTON);
        });
    });

    test("Spinner is shown on mount", async () => {
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            await wait(100);
            return [];
        });
        const { getByTestId } = renderWithGlobalContext(
            <Route exact path={TESTS_CONSTANTS.ROUTE} component={DepositionDetails} />,
            customDeps,
            undefined,
            history
        );
        const spinner = getByTestId("spinner");
        history.push(TESTS_CONSTANTS.TEST_ROUTE);
        await waitFor(() => {
            expect(spinner).toBeInTheDocument();
        });
    });
    test("Should display a back button", async () => {
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return getDepositions()[0];
        });
        const { findByTestId } = renderWithGlobalContext(
            <Route exact path={TESTS_CONSTANTS.ROUTE} component={DepositionDetails} />,
            customDeps,
            undefined,
            history
        );
        history.push(TESTS_CONSTANTS.TEST_ROUTE);
        const backButton = await findByTestId("depo_detail_back_button");
        expect(backButton).toBeInTheDocument();
        userEvent.click(backButton);
        expect(history.location.pathname).toBe("/depositions");
    });
});

describe("Tests the attendees tab", () => {
    test("Shows error when fetch fails", async () => {
        customDeps.apiService.fetchParticipants = jest.fn().mockRejectedValue(async () => {
            throw Error("Something wrong");
        });
        const { getByText } = renderWithGlobalContext(
            <DepositionDetailsAttendees
                activeKey={CONSTANTS.DEPOSITION_DETAILS_TABS.attendees}
                depositionID={DEPOSITION_ID}
            />,
            customDeps
        );
        await waitFor(() => {
            expect(getByText(ERROR_CONSTANTS.FETCH_ERROR_MODAL_TITLE)).toBeInTheDocument();
            expect(getByText(ERROR_CONSTANTS.FETCH_ERROR_MODAL_BODY)).toBeInTheDocument();
            expect(getByText(ERROR_CONSTANTS.FETCH_ERROR_MODAL_BODY)).toBeInTheDocument();
        });
    });
    test("Shows correct info if fetch succeeds", async () => {
        customDeps.apiService.fetchParticipants = jest.fn().mockImplementation(async () => {
            return [DEPO_PARTICIPANT_MOCK];
        });
        const { getByText } = renderWithGlobalContext(
            <DepositionDetailsAttendees
                activeKey={CONSTANTS.DEPOSITION_DETAILS_TABS.attendees}
                depositionID={DEPOSITION_ID}
            />,
            customDeps
        );
        await waitFor(() => {
            Object.values(DEPO_PARTICIPANT_MOCK)
                .filter((value) => {
                    const isAValidTestValue =
                        value !== null &&
                        value !== DEPO_PARTICIPANT_MOCK.id &&
                        value !== DEPO_PARTICIPANT_MOCK.creationDate;
                    return isAValidTestValue;
                })
                .map((element) => {
                    const isCourtReporter = element === Roles.courtReporter ? "Court Reporter" : element;
                    return expect(getByText(String(isCourtReporter))).toBeInTheDocument();
                });
            expect(customDeps.apiService.fetchParticipants).toHaveBeenCalledWith(DEPOSITION_ID, undefined);
        });
    });
});

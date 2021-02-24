import { waitForDomChange, waitForElement } from "@testing-library/react";
import moment from "moment-timezone";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { FORMAT_DATE, FORMAT_TIME } from "../../constants/depositionDetails";
import * as ERROR_CONSTANTS from "../../constants/errors";
import { wait } from "../../helpers/wait";
import DepositionDetails from "../../routes/DepositionDetails";
import * as TESTS_CONSTANTS from "../constants/depositionDetails";
import { getDepositions } from "../constants/depositions";
import getMockDeps from "../utils/getMockDeps";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";

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

const customDeps = getMockDeps();
const history = createMemoryHistory();

describe("DepositionDetails", () => {
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
        await waitForDomChange();
        const deposition = getDepositions()[0];

        expect(getByText(deposition.caseName)).toBeInTheDocument();
        expect(getByText(deposition.caseNumber)).toBeInTheDocument();
        expect(getByText(deposition.witness.name)).toBeInTheDocument();
        expect(getByText(moment(deposition.startDate).tz(deposition.timeZone).format(FORMAT_DATE))).toBeInTheDocument();
        const startDate = moment(deposition.startDate).tz(deposition.timeZone).format(FORMAT_TIME).split(" ");
        const completeDate = moment(deposition.completeDate).tz(deposition.timeZone).format(FORMAT_TIME);
        expect(
            getByText(
                `${
                    startDate[1] === completeDate.split(" ")[1] ? startDate[0] : startDate.join(" ").toLowerCase()
                } to ${completeDate.toLowerCase()} ${deposition.timeZone}`
            )
        ).toBeInTheDocument();
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
        await waitForElement(() => {
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
        expect(spinner).toBeInTheDocument();
        await waitForDomChange();
    });
});

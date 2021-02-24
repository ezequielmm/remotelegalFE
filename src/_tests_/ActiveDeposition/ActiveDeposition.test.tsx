import { waitForDomChange, fireEvent } from "@testing-library/react";
import React from "react";
import moment from "moment-timezone";
import { wait } from "../../helpers/wait";
import ActiveDepositionDetails from "../../routes/ActiveDepoDetails";
import getMockDeps from "../utils/getMockDeps";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import * as CONSTANTS from "../../constants/activeDepositionDetails";
import * as ERRORS_CONSTANTS from "../../constants/errors";
import { getDepositionWithOverrideValues } from "../constants/depositions";
import downloadFile from "../../helpers/downloadFile";
import { CAPTION_MOCK } from "../constants/caption";

const customDeps = getMockDeps();
jest.mock("../../helpers/downloadFile");

describe("Shows correct info according to circumstances", () => {
    test("Shows spinner on mount", async () => {
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            await wait(100);
            return [];
        });
        const { getByTestId } = renderWithGlobalContext(<ActiveDepositionDetails />, customDeps);
        expect(getByTestId("spinner")).toBeInTheDocument();
    });
    test("Shows error when fetch fails", async () => {
        customDeps.apiService.fetchDeposition = jest.fn().mockRejectedValue(async () => {
            throw Error("Something wrong");
        });
        const { getByText } = renderWithGlobalContext(<ActiveDepositionDetails />, customDeps);
        await waitForDomChange();
        expect(getByText(ERRORS_CONSTANTS.FETCH_ERROR_MODAL_TITLE)).toBeInTheDocument();
        expect(getByText(ERRORS_CONSTANTS.FETCH_ERROR_MODAL_BODY)).toBeInTheDocument();
        expect(getByText(ERRORS_CONSTANTS.FETCH_ERROR_MODAL_BODY)).toBeInTheDocument();
    });
    test("Shows correct info if fetch succeeds", async () => {
        customDeps.apiService.fetchDeposition = jest.fn().mockRejectedValue(async () => {
            throw Error("Something wrong");
        });
        const { getByText } = renderWithGlobalContext(<ActiveDepositionDetails />, customDeps);
        await waitForDomChange();
        expect(getByText(ERRORS_CONSTANTS.FETCH_ERROR_MODAL_TITLE)).toBeInTheDocument();
        expect(getByText(ERRORS_CONSTANTS.FETCH_ERROR_MODAL_BODY)).toBeInTheDocument();
        expect(getByText(ERRORS_CONSTANTS.FETCH_ERROR_MODAL_BODY)).toBeInTheDocument();
    });

    test("Loads proper headers with proper texts when full info is available", async () => {
        const fullDeposition = getDepositionWithOverrideValues();
        const arrayConstants = [
            CONSTANTS.DEPOSITION_ADDITIONAL_INFORMATION_TEXT,
            CONSTANTS.DEPOSITION_CARD_DETAILS_TITLE,
            CONSTANTS.DEPOSITION_DETAILS_COURT_REPORTER_TITLE,
            CONSTANTS.DEPOSITION_DETAILS_STATUS_TITLE,
            CONSTANTS.DEPOSITION_DETAILS_JOB_TITLE,
            CONSTANTS.DEPOSITION_DETAILS_JOB_TITLE,
            CONSTANTS.DEPOSITION_DETAILS_CAPTION_TITLE,
            CONSTANTS.DEPOSITION_VIDEO_RECORDING_TITLE,
            CONSTANTS.DEPOSITION_SPECIAL_REQUEST_TITLE,
            CONSTANTS.DEPOSITION_REQUESTER_TITLE,
            CONSTANTS.DEPOSITION_REQUESTER_USER_TITLE,
            CONSTANTS.DEPOSITION_REQUESTER_MAIL,
            CONSTANTS.DEPOSITION_REQUESTER_COMPANY,
            CONSTANTS.DEPOSITION_REQUESTER_PHONE,
            CONSTANTS.DEPOSITION_REQUESTER_NOTES,
            CONSTANTS.DEPOSITION_DETAILS_HEADER_CASE,
            CONSTANTS.DEPOSITION_DETAILS_HEADER_WITNESS,
            CONSTANTS.DEPOSITION_DETAILS_HEADER_DATE,
            CONSTANTS.DEPOSITION_DETAILS_HEADER_JOB,
            CONSTANTS.DEPOSITION_VIDEO_RECORDING_TRUE_TEXT,
            CONSTANTS.DEPOSITION_ADDITIONAL_INFORMATION_TEXT,
            CONSTANTS.DEPOSITION_CARD_DETAILS_TITLE,
            CONSTANTS.DEPOSITION_DETAILS_COURT_REPORTER_TITLE,
            CONSTANTS.DEPOSITION_DETAILS_STATUS_TITLE,
            CONSTANTS.DEPOSITION_DETAILS_JOB_TITLE,
        ];
        const month = moment(fullDeposition.creationDate).format("MMMM");
        const day = moment(fullDeposition.creationDate).format("Do");
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        const { getByText, getAllByText, getByTestId } = renderWithGlobalContext(
            <ActiveDepositionDetails />,
            customDeps
        );
        await waitForDomChange();
        expect(getByText(fullDeposition.caseName)).toBeInTheDocument();
        expect(getByText(fullDeposition.caseNumber)).toBeInTheDocument();
        expect(getByText(fullDeposition.witness.name)).toBeInTheDocument();
        expect(
            getByText(moment(fullDeposition.startDate).tz(fullDeposition.timeZone).format(CONSTANTS.FORMAT_DATE))
        ).toBeInTheDocument();
        const startDate = moment(fullDeposition.startDate)
            .tz(fullDeposition.timeZone)
            .format(CONSTANTS.FORMAT_TIME)
            .split(" ");
        const completeDate = moment(fullDeposition.endDate).tz(fullDeposition.timeZone).format(CONSTANTS.FORMAT_TIME);
        expect(
            getByText(
                `${
                    startDate[1] === completeDate.split(" ")[1] ? startDate[0] : startDate.join(" ").toLowerCase()
                } to ${completeDate.toLowerCase()} ${fullDeposition.timeZone}`
            )
        ).toBeInTheDocument();
        expect(getByText(fullDeposition.caption.displayName)).toBeInTheDocument();
        expect(getAllByText(fullDeposition.job)).toHaveLength(2);
        expect(
            getByText(`${fullDeposition.requester.firstName} ${fullDeposition.requester.lastName}`)
        ).toBeInTheDocument();
        expect(
            getByText(`${fullDeposition.requester.firstName} ${fullDeposition.requester.lastName}`)
        ).toBeInTheDocument();
        expect(getByText(fullDeposition.requesterNotes)).toBeInTheDocument();
        expect(getByText(fullDeposition.details)).toBeInTheDocument();
        expect(
            getByText(
                `Requested by ${fullDeposition.requester.firstName} ${fullDeposition.requester.lastName} | ${fullDeposition.requester.companyName}`
            )
        ).toBeInTheDocument();
        expect(
            getByText(
                `Requested by ${fullDeposition.requester.firstName} ${fullDeposition.requester.lastName} | ${fullDeposition.requester.companyName}`
            )
        ).toBeInTheDocument();
        expect(
            getByText(
                `Created by ${fullDeposition.addedBy.firstName} ${fullDeposition.addedBy.lastName} on ${month} ${day}`
            )
        ).toBeInTheDocument();
        expect(getByText(fullDeposition.requester.emailAddress)).toBeInTheDocument();
        expect(getByText(fullDeposition.requester.companyName)).toBeInTheDocument();
        expect(getByText(fullDeposition.requester.phoneNumber)).toBeInTheDocument();
        expect(getByText(fullDeposition.participants[0].name)).toBeInTheDocument();
        expect(getAllByText(fullDeposition.status)).toHaveLength(2);
        expect(getByTestId(CONSTANTS.DEPOSITION_CREATED_TEXT_DATA_TEST_ID)).toBeInTheDocument();
        expect(getByTestId(CONSTANTS.DEPOSITION_REQUESTED_TEXT_DATA_TEST_ID)).toBeInTheDocument();
        arrayConstants.map((constant) => expect(getByText(constant)).toBeInTheDocument());
    });
});

describe("Shows correct info when data is incomplete", () => {
    test("Loads to be defined when witness, court reporter and job are missing", async () => {
        const fullDeposition = getDepositionWithOverrideValues({
            witness: {
                name: "",
            },
            participants: [],
            job: null,
        });

        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        const { getAllByText } = renderWithGlobalContext(<ActiveDepositionDetails />, customDeps);
        await waitForDomChange();
        expect(getAllByText(CONSTANTS.DEPOSITION_NO_PARTICIPANT_TEXT)).toHaveLength(4);
    });
    test("Loads none when details, captions and requester notes are missing and false is video recording is not necessary", async () => {
        const fullDeposition = getDepositionWithOverrideValues({
            witness: {
                name: "",
            },
            isVideoRecordingNeeded: false,
            caption: "",
            details: "",
            requesterNotes: "",
        });

        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        const { getAllByText, getByText } = renderWithGlobalContext(<ActiveDepositionDetails />, customDeps);
        await waitForDomChange();
        expect(getAllByText(CONSTANTS.DEPOSITION_NO_TEXT)).toHaveLength(3);
        expect(getByText(CONSTANTS.DEPOSITION_VIDEO_RECORDING_FALSE_TEXT)).toBeInTheDocument();
    });
    test("complete date is not shown if completed date is missing", async () => {
        const fullDeposition = getDepositionWithOverrideValues({
            endDate: "",
        });

        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        const { queryByText, getByText } = renderWithGlobalContext(<ActiveDepositionDetails />, customDeps);
        await waitForDomChange();
        const startDate = moment(fullDeposition.startDate)
            .tz(fullDeposition.timeZone)
            .format(CONSTANTS.FORMAT_TIME)
            .split(" ");
        const completeDate = moment(fullDeposition.endDate).tz(fullDeposition.timeZone).format(CONSTANTS.FORMAT_TIME);
        expect(
            queryByText(
                `${
                    startDate[1] === completeDate.split(" ")[1] ? startDate[0] : startDate.join(" ").toLowerCase()
                } to ${completeDate.toLowerCase()} ${fullDeposition.timeZone}`
            )
        ).toBeFalsy();
        expect(
            getByText(
                `${startDate[1] === completeDate.split(" ")[1] ? startDate[0] : startDate.join(" ").toLowerCase()} ${
                    fullDeposition.timeZone
                }`
            )
        ).toBeInTheDocument();
    });
});

describe("Test caption behaviour", () => {
    test("Calls caption endpoint with proper params and helper function", async () => {
        const fullDeposition = getDepositionWithOverrideValues();
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        const { getByText } = renderWithGlobalContext(<ActiveDepositionDetails />, customDeps);
        await waitForDomChange();
        fireEvent.click(getByText(fullDeposition.caption.displayName));
        expect(customDeps.apiService.fetchCaption).toHaveBeenCalledWith(fullDeposition.id);
        await wait(100);
        expect(downloadFile).toHaveBeenCalledWith(CAPTION_MOCK.preSignedUrl);
    });
    test("Shows toast if caption endpoint fails", async () => {
        const fullDeposition = getDepositionWithOverrideValues();
        customDeps.apiService.fetchCaption = jest.fn().mockRejectedValue(async () => {
            throw Error("Something wrong");
        });
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        const { getByText } = renderWithGlobalContext(<ActiveDepositionDetails />, customDeps);
        await waitForDomChange();
        fireEvent.click(getByText(fullDeposition.caption.displayName));
        await waitForDomChange();
        expect(getByText(CONSTANTS.NETWORK_ERROR)).toBeInTheDocument();
    });
});

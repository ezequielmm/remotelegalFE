import { waitForDomChange, fireEvent, waitForElement } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
import ParticipantListTable from "../../routes/ActiveDepoDetails/components/ParticipantListTable";
import DEPO_PARTICIPANT_MOCK, { getDepoParticipantWithOverrideValues } from "../mocks/depoParticipant";
import { Roles } from "../../models/participant";
import { PARTICIPANT_MOCK } from "../constants/preJoinDepo";

const customDeps = getMockDeps();
jest.mock("../../helpers/downloadFile");

describe("Tests the Additional Information tab", () => {
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
            const completeDate = moment(fullDeposition.endDate)
                .tz(fullDeposition.timeZone)
                .format(CONSTANTS.FORMAT_TIME);
            expect(
                queryByText(
                    `${
                        startDate[1] === completeDate.split(" ")[1] ? startDate[0] : startDate.join(" ").toLowerCase()
                    } to ${completeDate.toLowerCase()} ${fullDeposition.timeZone}`
                )
            ).toBeFalsy();
            expect(
                getByText(
                    `${
                        startDate[1] === completeDate.split(" ")[1] ? startDate[0] : startDate.join(" ").toLowerCase()
                    } ${fullDeposition.timeZone}`
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
            expect(getByText(CONSTANTS.CAPTION_NETWORK_ERROR)).toBeInTheDocument();
        });
    });
});

describe("Tests the Invited Parties tab", () => {
    test("Shows error when fetch fails", async () => {
        customDeps.apiService.fetchParticipants = jest.fn().mockRejectedValue(async () => {
            throw Error("Something wrong");
        });
        const { getByText } = renderWithGlobalContext(
            <ParticipantListTable
                deposition={getDepositionWithOverrideValues()}
                activeKey={CONSTANTS.DEPOSITION_DETAILS_TABS[1]}
            />,
            customDeps
        );
        await waitForDomChange();
        expect(getByText(ERRORS_CONSTANTS.FETCH_ERROR_MODAL_TITLE)).toBeInTheDocument();
        expect(getByText(ERRORS_CONSTANTS.FETCH_ERROR_MODAL_BODY)).toBeInTheDocument();
        expect(getByText(ERRORS_CONSTANTS.FETCH_ERROR_MODAL_BODY)).toBeInTheDocument();
    });
    test("Shows correct info if fetch succeeds", async () => {
        const deposition = getDepositionWithOverrideValues();
        customDeps.apiService.fetchParticipants = jest.fn().mockImplementation(async () => {
            return [DEPO_PARTICIPANT_MOCK];
        });
        const { getByText } = renderWithGlobalContext(
            <ParticipantListTable deposition={deposition} activeKey={CONSTANTS.DEPOSITION_DETAILS_TABS[1]} />,
            customDeps
        );
        await waitForDomChange();
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
        expect(customDeps.apiService.fetchParticipants).toHaveBeenCalledWith(deposition.id, {});
    });
    test("Calls the sorting endpoint with the ascend parameters", async () => {
        customDeps.apiService.fetchParticipants = jest.fn().mockImplementation(async () => {
            return [DEPO_PARTICIPANT_MOCK];
        });
        const deposition = getDepositionWithOverrideValues();
        const { getByText } = renderWithGlobalContext(
            <ParticipantListTable deposition={deposition} activeKey={CONSTANTS.DEPOSITION_DETAILS_TABS[1]} />,
            customDeps
        );
        await waitForDomChange();
        CONSTANTS.DEPOSITION_DETAILS_INVITED_PARTIES_COLUMNS.filter((column) => {
            const isASortingColumn = column.title !== "PHONE NUMBER";
            return isASortingColumn;
        }).map(async (element) => {
            fireEvent.click(getByText(element.title));
            expect(customDeps.apiService.fetchParticipants).toHaveBeenLastCalledWith(deposition.id, {
                sortDirection: "ascend",
                sortField: element.title.toLowerCase(),
            });
            await waitForDomChange();
        });
    });
    test("Calls the sorting endpoint with the descend parameters", async () => {
        customDeps.apiService.fetchParticipants = jest.fn().mockImplementation(async () => {
            return [DEPO_PARTICIPANT_MOCK];
        });
        const deposition = getDepositionWithOverrideValues();
        const { getByText } = renderWithGlobalContext(
            <ParticipantListTable deposition={deposition} activeKey={CONSTANTS.DEPOSITION_DETAILS_TABS[1]} />,
            customDeps
        );
        await waitForDomChange();
        CONSTANTS.DEPOSITION_DETAILS_INVITED_PARTIES_COLUMNS.filter((column) => {
            const isASortingColumn = column.title !== "PHONE NUMBER";
            return isASortingColumn;
        }).map(async (element) => {
            fireEvent.click(getByText(element.title));
            fireEvent.click(getByText(element.title));
            expect(customDeps.apiService.fetchParticipants).toHaveBeenLastCalledWith(deposition.id, {
                sortDirection: "descend",
                sortField: element.title.toLowerCase(),
            });
            await waitForDomChange();
        });
    });

    test("Calls the sorting endpoint with no parameters", async () => {
        customDeps.apiService.fetchParticipants = jest.fn().mockImplementation(async () => {
            return [DEPO_PARTICIPANT_MOCK];
        });
        const deposition = getDepositionWithOverrideValues();
        const { getByText } = renderWithGlobalContext(
            <ParticipantListTable deposition={deposition} activeKey={CONSTANTS.DEPOSITION_DETAILS_TABS[1]} />,
            customDeps
        );
        await waitForDomChange();
        CONSTANTS.DEPOSITION_DETAILS_INVITED_PARTIES_COLUMNS.filter((column) => {
            const isASortingColumn = column.title !== "PHONE NUMBER";
            return isASortingColumn;
        }).map(async (element) => {
            fireEvent.click(getByText(element.title));
            fireEvent.click(getByText(element.title));
            fireEvent.click(getByText(element.title));
            expect(customDeps.apiService.fetchParticipants).toHaveBeenLastCalledWith(deposition.id, {});
            await waitForDomChange();
        });
    });

    test("Remove icon doesn´t show if participant is a witness", async () => {
        const participantMock = getDepoParticipantWithOverrideValues({ role: Roles.witness });
        customDeps.apiService.fetchParticipants = jest.fn().mockImplementation(async () => {
            return [participantMock];
        });
        const deposition = getDepositionWithOverrideValues();
        const { queryByTestId } = renderWithGlobalContext(
            <ParticipantListTable deposition={deposition} activeKey={CONSTANTS.DEPOSITION_DETAILS_TABS[1]} />,
            customDeps
        );
        await waitForDomChange();
        expect(queryByTestId(`${participantMock.name}_delete_icon`)).toBeFalsy();
    });
    test("Remove icon shows if participant is not a witness", async () => {
        customDeps.apiService.fetchParticipants = jest.fn().mockImplementation(async () => {
            return [PARTICIPANT_MOCK];
        });
        const deposition = getDepositionWithOverrideValues();
        const { getByTestId } = renderWithGlobalContext(
            <ParticipantListTable deposition={deposition} activeKey={CONSTANTS.DEPOSITION_DETAILS_TABS[1]} />,
            customDeps
        );
        await waitForDomChange();
        expect(getByTestId(`${PARTICIPANT_MOCK.name}_delete_icon`)).toBeInTheDocument();
    });
    test("Should close remove participant toast when clicking the cancel button", async () => {
        customDeps.apiService.fetchParticipants = jest.fn().mockImplementation(async () => {
            return [PARTICIPANT_MOCK];
        });
        const ModalTextsArray = [
            CONSTANTS.DEPOSITION_DETAILS_DELETE_MODAL_TITLE,
            CONSTANTS.DEPOSITION_DETAILS_DELETE_MODAL_SUBTITLE,
            CONSTANTS.DEPOSITION_DETAILS_DELETE_MODAL_CONFIRM_BUTTON_LABEL,
            CONSTANTS.DEPOSITION_DETAILS_DELETE_MODAL_CANCEL_BUTTON_LABEL,
        ];
        const deposition = getDepositionWithOverrideValues();
        const { getByTestId, getByText, queryByText } = renderWithGlobalContext(
            <ParticipantListTable deposition={deposition} activeKey={CONSTANTS.DEPOSITION_DETAILS_TABS[1]} />,
            customDeps
        );
        await waitForDomChange();
        fireEvent.click(getByTestId(`${PARTICIPANT_MOCK.name}_delete_icon`));
        ModalTextsArray.map((text) => expect(getByText(text)).toBeInTheDocument());
        fireEvent.click(getByText(CONSTANTS.DEPOSITION_DETAILS_DELETE_MODAL_CANCEL_BUTTON_LABEL));
        ModalTextsArray.map((text) => expect(queryByText(text)).toBeFalsy());
    });
    test("Toast should appear when removing a participant", async () => {
        customDeps.apiService.fetchParticipants = jest.fn().mockImplementation(async () => {
            return [PARTICIPANT_MOCK];
        });
        customDeps.apiService.removeParticipantFromExistingDepo = jest.fn().mockImplementation(async () => {
            return {};
        });

        const deposition = getDepositionWithOverrideValues();
        const { getByTestId, getByText } = renderWithGlobalContext(
            <ParticipantListTable deposition={deposition} activeKey={CONSTANTS.DEPOSITION_DETAILS_TABS[1]} />,
            customDeps
        );
        await waitForDomChange();
        fireEvent.click(getByTestId(`${PARTICIPANT_MOCK.name}_delete_icon`));
        fireEvent.click(getByText(CONSTANTS.DEPOSITION_DETAILS_DELETE_MODAL_CONFIRM_BUTTON_LABEL));
        await waitForDomChange();
        expect(getByText(CONSTANTS.DEPOSITION_DETAILS_REMOVE_PARTICIPANT_TOAST));
        expect(customDeps.apiService.removeParticipantFromExistingDepo).toHaveBeenCalledWith(
            deposition.id,
            PARTICIPANT_MOCK.id
        );
    });

    test("Error toast should appear if remove participant endpoint fails", async () => {
        customDeps.apiService.fetchParticipants = jest.fn().mockImplementation(async () => {
            return [PARTICIPANT_MOCK];
        });
        customDeps.apiService.removeParticipantFromExistingDepo = jest.fn().mockRejectedValue(Error);

        const deposition = getDepositionWithOverrideValues();
        const { getByTestId, getByText } = renderWithGlobalContext(
            <ParticipantListTable deposition={deposition} activeKey={CONSTANTS.DEPOSITION_DETAILS_TABS[1]} />,
            customDeps
        );
        await waitForDomChange();
        fireEvent.click(getByTestId(`${PARTICIPANT_MOCK.name}_delete_icon`));
        fireEvent.click(getByText(CONSTANTS.DEPOSITION_DETAILS_DELETE_MODAL_CONFIRM_BUTTON_LABEL));
        await waitForDomChange();
        expect(getByText(CONSTANTS.NETWORK_ERROR));
    });

    test("Should validate add participant form", async () => {
        customDeps.apiService.fetchParticipants = jest.fn().mockImplementation(async () => {
            return [PARTICIPANT_MOCK];
        });
        const deposition = getDepositionWithOverrideValues();
        const { getByText, getByTestId } = renderWithGlobalContext(
            <ParticipantListTable deposition={deposition} activeKey={CONSTANTS.DEPOSITION_DETAILS_TABS[1]} />,
            customDeps
        );
        await waitForDomChange();
        fireEvent.click(getByText(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_BUTTON));
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_DATA_TEST_ID_EMAIL), {
            target: { value: "test1234" },
        });
        fireEvent.change(getByTestId(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_DATA_TEST_ID_PHONE), {
            target: { value: "test1234" },
        });
        fireEvent.click(getByTestId(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_CONFIRM_BUTTON_TEST_ID));
        await waitForDomChange();
        expect(
            getByTestId(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_DATA_TEST_ID_INVALID_ROLE)
        ).toBeInTheDocument();
        expect(getByText(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_EMAIL_INVALID)).toBeInTheDocument();
        expect(getByText(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_PHONE_INVALID)).toBeInTheDocument();
    });
    test("Should add participant and display toast", async () => {
        customDeps.apiService.fetchParticipants = jest.fn().mockImplementation(async () => {
            return [PARTICIPANT_MOCK];
        });
        customDeps.apiService.addParticipantToExistingDepo = jest.fn().mockImplementation(async () => {
            return {};
        });
        const deposition = getDepositionWithOverrideValues();
        const { getByText, getByTestId, getAllByText } = renderWithGlobalContext(
            <ParticipantListTable deposition={deposition} activeKey={CONSTANTS.DEPOSITION_DETAILS_TABS[1]} />,
            customDeps
        );
        await waitForDomChange();
        fireEvent.click(getByText(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_BUTTON));
        await waitForDomChange();
        userEvent.click(getByText(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_ROLE_SELECT_PLACEHOLDER));
        const role = await waitForElement(() => getAllByText("Paralegal"));

        userEvent.click(role[0]);
        await wait(200);
        fireEvent.change(getByTestId(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_DATA_TEST_ID_EMAIL), {
            target: { value: "test@test.com" },
        });
        fireEvent.change(getByTestId(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_DATA_TEST_ID_PHONE), {
            target: { value: "5555555555" },
        });
        fireEvent.change(getByTestId(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_DATA_TEST_ID_NAME), {
            target: { value: "test" },
        });
        userEvent.click(getByTestId(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_CONFIRM_BUTTON_TEST_ID));
        await waitForDomChange();
        expect(
            getByText(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_ADDED_PARTICIPANT_TOAST)
        ).toBeInTheDocument();
        expect(customDeps.apiService.addParticipantToExistingDepo).toHaveBeenCalledWith(deposition.id, {
            email: "test@test.com",
            name: "test",
            phone: "5555555555",
            role: "Paralegal",
        });
    });
    test("Should display error toast if participant has been added already", async () => {
        customDeps.apiService.fetchParticipants = jest.fn().mockImplementation(async () => {
            return [PARTICIPANT_MOCK];
        });
        customDeps.apiService.addParticipantToExistingDepo = jest.fn().mockRejectedValue(400);
        const deposition = getDepositionWithOverrideValues();
        const { getByText, getByTestId, getAllByText } = renderWithGlobalContext(
            <ParticipantListTable deposition={deposition} activeKey={CONSTANTS.DEPOSITION_DETAILS_TABS[1]} />,
            customDeps
        );
        await waitForDomChange();
        fireEvent.click(getByText(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_BUTTON));
        await waitForDomChange();
        userEvent.click(getByText(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_ROLE_SELECT_PLACEHOLDER));
        const role = await waitForElement(() => getAllByText("Paralegal"));
        userEvent.click(role[0]);
        await wait(200);
        userEvent.click(getByTestId(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_CONFIRM_BUTTON_TEST_ID));
        await waitForDomChange();
        expect(
            getByText(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_PARTICIPANT_ALREADY_EXISTS_ERROR)
        ).toBeInTheDocument();
    });
    test("Should display error toast if add participant endpoint fails", async () => {
        customDeps.apiService.fetchParticipants = jest.fn().mockImplementation(async () => {
            return [PARTICIPANT_MOCK];
        });
        customDeps.apiService.addParticipantToExistingDepo = jest.fn().mockRejectedValue({});
        const deposition = getDepositionWithOverrideValues();
        const { getByText, getByTestId, getAllByText } = renderWithGlobalContext(
            <ParticipantListTable deposition={deposition} activeKey={CONSTANTS.DEPOSITION_DETAILS_TABS[1]} />,
            customDeps
        );
        await waitForDomChange();
        fireEvent.click(getByText(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_BUTTON));
        await waitForDomChange();
        userEvent.click(getByText(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_ROLE_SELECT_PLACEHOLDER));
        const role = await waitForElement(() => getAllByText("Attorney"));
        userEvent.click(role[1]);
        userEvent.click(getByTestId(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_CONFIRM_BUTTON_TEST_ID));
        await waitForDomChange();
        await waitForElement(() => getAllByText(CONSTANTS.NETWORK_ERROR));
    });
    test("Court Reporter shouldn´t be an option in Add Participant Modal if there is already one present", async () => {
        const participant = getDepoParticipantWithOverrideValues();
        customDeps.apiService.fetchParticipants = jest.fn().mockImplementation(async () => {
            return [participant];
        });
        customDeps.apiService.addParticipantToExistingDepo = jest.fn().mockRejectedValue({});
        const deposition = getDepositionWithOverrideValues();
        const { getByText, getAllByText } = renderWithGlobalContext(
            <ParticipantListTable deposition={deposition} activeKey={CONSTANTS.DEPOSITION_DETAILS_TABS[1]} />,
            customDeps
        );
        await waitForDomChange();
        expect(getByText("Court Reporter")).toBeInTheDocument();
        fireEvent.click(getByText(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_BUTTON));
        await waitForDomChange();
        userEvent.click(getByText(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_ROLE_SELECT_PLACEHOLDER));
        const role = await waitForElement(() => getAllByText("Court Reporter"));
        expect(role).toHaveLength(1);
    });
    test("Add participant button shouldn´t be present if there are 22 participants", async () => {
        customDeps.apiService.fetchParticipants = jest.fn().mockImplementation(async () => {
            return [...Array(22)].map((_, i) => getDepoParticipantWithOverrideValues({ id: i }));
        });
        customDeps.apiService.addParticipantToExistingDepo = jest.fn().mockRejectedValue({});
        const deposition = getDepositionWithOverrideValues();
        const { queryByText } = renderWithGlobalContext(
            <ParticipantListTable deposition={deposition} activeKey={CONSTANTS.DEPOSITION_DETAILS_TABS[1]} />,
            customDeps
        );
        await waitForDomChange();
        expect(queryByText(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_BUTTON)).toBeFalsy();
    });
});

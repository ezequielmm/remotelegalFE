import { waitForDomChange, fireEvent, waitForElement, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import moment from "moment-timezone";
import { wait } from "../../helpers/wait";
import ActiveDepositionDetails from "../../routes/ActiveDepoDetails";
import getMockDeps from "../utils/getMockDeps";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import * as TEST_CONSTANTS from "../constants/activeDepositionDetails";
import * as CONSTANTS from "../../constants/activeDepositionDetails";
import * as ERRORS_CONSTANTS from "../../constants/errors";
import { getDepositionWithOverrideValues } from "../constants/depositions";
import downloadFile from "../../helpers/downloadFile";
import { CAPTION_MOCK } from "../constants/caption";
import ParticipantListTable from "../../routes/ActiveDepoDetails/components/ParticipantListTable";
import DEPO_PARTICIPANT_MOCK, { getDepoParticipantWithOverrideValues } from "../mocks/depoParticipant";
import { Roles } from "../../models/participant";
import getModalTextContent from "../../routes/ActiveDepoDetails/helpers/getModalTextContent";
import { Status } from "../../components/StatusPill/StatusPill";
import { PARTICIPANT_MOCK, PARTICIPANT_MOCK_NAME } from "../constants/preJoinDepo";
import { mapTimeZone } from "../../models/general";

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
        const year = moment(fullDeposition.creationDate).format("YYYY");
        const formattedDay = `${month} ${day}, ${year}`;

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
            getByText(
                moment(fullDeposition.startDate).tz(mapTimeZone[fullDeposition.timeZone]).format(CONSTANTS.FORMAT_DATE)
            )
        ).toBeInTheDocument();
        const startDate = moment(fullDeposition.startDate)
            .tz(mapTimeZone[fullDeposition.timeZone])
            .format(CONSTANTS.FORMAT_TIME)
            .split(" ");
        const completeDate = moment(fullDeposition.endDate)
            .tz(mapTimeZone[fullDeposition.timeZone])
            .format(CONSTANTS.FORMAT_TIME);
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
                `Requested by ${fullDeposition.requester.firstName} ${fullDeposition.requester.lastName} - ${fullDeposition.requester.companyName} on ${formattedDay}`
            )
        ).toBeInTheDocument();
        expect(getByText(fullDeposition.requester.emailAddress)).toBeInTheDocument();
        expect(getByText(fullDeposition.requester.companyName)).toBeInTheDocument();
        expect(getByText(fullDeposition.requester.phoneNumber)).toBeInTheDocument();
        expect(getByText(fullDeposition.participants[0].name)).toBeInTheDocument();
        expect(getAllByText(fullDeposition.status)).toHaveLength(2);
        expect(getByTestId(CONSTANTS.DEPOSITION_CREATED_TEXT_DATA_TEST_ID)).toBeInTheDocument();
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
                .tz(mapTimeZone[fullDeposition.timeZone])
                .format(CONSTANTS.FORMAT_TIME)
                .split(" ");
            const completeDate = moment(fullDeposition.endDate)
                .tz(mapTimeZone[fullDeposition.timeZone])
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
        expect(getByTestId(`${PARTICIPANT_MOCK_NAME}_delete_icon`)).toBeInTheDocument();
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
        fireEvent.click(getByTestId(`${PARTICIPANT_MOCK_NAME}_delete_icon`));
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
        fireEvent.click(getByTestId(`${PARTICIPANT_MOCK_NAME}_delete_icon`));
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
        fireEvent.click(getByTestId(`${PARTICIPANT_MOCK_NAME}_delete_icon`));
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

describe("Tests Edit Deposition Modal", () => {
    test("Shows correct info when modal pops up after clicking the edit icon on the depo info", async () => {
        const fullDeposition = getDepositionWithOverrideValues();
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        const { getAllByTestId, getAllByText, getByTestId } = renderWithGlobalContext(
            <ActiveDepositionDetails />,
            customDeps
        );
        await waitForDomChange();
        const editButton = getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
        fireEvent.click(editButton[0]);
        await waitForDomChange();
        expect(getAllByText(fullDeposition.status)).toHaveLength(3);
        expect(getByTestId("true YES")).toBeChecked();
        expect(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_DATA_TEST_ID_JOB)).toHaveValue(
            fullDeposition.job
        );
        expect(
            getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CAPTION_BUTTON_TEST_ID)
        ).toHaveTextContent(fullDeposition.caption.displayName);
        expect(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_DATA_TEST_ID_DETAILS)).toHaveValue(
            fullDeposition.details
        );
    });
    test("Shows toast when submitting", async () => {
        const { startDate } = TEST_CONSTANTS.EXPECTED_EDIT_DEPOSITION_BODY;
        const fullDeposition = getDepositionWithOverrideValues({ startDate });
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        customDeps.apiService.editDeposition = jest.fn().mockImplementation(async () => {
            return {};
        });
        const { getAllByTestId, getAllByText, getByTestId } = renderWithGlobalContext(
            <ActiveDepositionDetails />,
            customDeps
        );
        await waitForDomChange();
        const editButton = getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
        fireEvent.click(editButton[0]);
        const options = getAllByText("pending");
        userEvent.click(options[2]);
        const confirmed = await waitForElement(() => getAllByText("Confirmed"));
        userEvent.click(confirmed[1]);
        fireEvent.click(getByTestId("false NO"));
        fireEvent.click(
            getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CAPTION_BUTTON_REMOVE_FILE_TEST_ID)
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
        await waitForDomChange();
        await waitForElement(() => getAllByText(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_SUCCESS_TOAST));
        expect(customDeps.apiService.editDeposition).toHaveBeenCalledWith(
            fullDeposition.id,
            TEST_CONSTANTS.EXPECTED_EDIT_DEPOSITION_BODY,
            file,
            true
        );
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
            customDeps
        );
        await waitForDomChange();
        const editButton = getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
        fireEvent.click(editButton[0]);
        fireEvent.click(
            getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CAPTION_BUTTON_REMOVE_FILE_TEST_ID)
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
            customDeps
        );
        await waitForDomChange();
        const editButton = getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
        fireEvent.click(editButton[0]);
        userEvent.click(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CONFIRM_BUTTON_TEST_ID));
        await waitForDomChange();
        await waitForElement(() => getAllByText(CONSTANTS.NETWORK_ERROR));
    });
    test("Show an invalid time label when the date is before startDate", async () => {
        const startDate = moment().add(1, "d").format(CONSTANTS.FORMAT_DATE);
        const newDate = moment().format(CONSTANTS.FORMAT_DATE);
        const fullDeposition = getDepositionWithOverrideValues({ startDate });
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        const { getAllByTestId, queryByTestId } = renderWithGlobalContext(<ActiveDepositionDetails />, customDeps);
        await waitForDomChange();
        const editButton = getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
        fireEvent.click(editButton[0]);
        const startDateInput = queryByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_DATA_TEST_ID_DATE);
        await act(async () => {
            userEvent.click(startDateInput);
            await fireEvent.change(startDateInput, {
                target: { value: newDate },
            });
            await fireEvent.keyDown(startDateInput, { key: "enter", keyCode: 13 });
        });
        expect(queryByTestId(CONSTANTS.DEPOSITIONS_DETAILS_EDIT_MODAL_INVALID_START_TIME_TEST_ID)).toBeInTheDocument();
    });
    test("Show an invalid end time label when the end time is befor start time", async () => {
        const startDate = moment().add(30, "m").format(CONSTANTS.FORMAT_DATE);
        const endDate = moment().format(CONSTANTS.TIME_FORMAT);
        const fullDeposition = getDepositionWithOverrideValues({ startDate });
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        const { getAllByTestId, queryByTestId } = renderWithGlobalContext(<ActiveDepositionDetails />, customDeps);
        await waitForDomChange();
        const editButton = getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
        fireEvent.click(editButton[0]);
        const endTimeInput = queryByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_END_TIME_TEST_ID);
        expect(endTimeInput).toBeInTheDocument();
        await act(async () => {
            userEvent.click(endTimeInput);
            await fireEvent.change(endTimeInput, {
                target: { value: endDate },
            });
            await fireEvent.keyDown(endTimeInput, { key: "enter", keyCode: 13 });
        });
        expect(queryByTestId(CONSTANTS.DEPOSITIONS_DETAILS_EDIT_MODAL_INVALID_END_TIME_TEST_ID)).toBeInTheDocument();
    });
    test("Submit button should be disabled with invalid date is entered ", async () => {
        const startDate = moment().add(1, "d").format(CONSTANTS.FORMAT_DATE);
        const newDate = moment().format(CONSTANTS.FORMAT_DATE);
        const fullDeposition = getDepositionWithOverrideValues({ startDate });
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        const { getAllByTestId, queryByTestId } = renderWithGlobalContext(<ActiveDepositionDetails />, customDeps);
        await waitForDomChange();
        const editButton = getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
        fireEvent.click(editButton[0]);
        const startDateInput = queryByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_DATA_TEST_ID_DATE);
        await act(async () => {
            userEvent.click(startDateInput);
            await fireEvent.change(startDateInput, {
                target: { value: newDate },
            });
            await fireEvent.keyDown(startDateInput, { key: "enter", keyCode: 13 });
        });
        const submitButton = queryByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CONFIRM_BUTTON_TEST_ID);
        expect(submitButton).toBeDisabled();
    });
    describe("Tests Edit Requester Modal", () => {
        test("Shows correct info when modal pops up after clicking the edit icon on the requester info", async () => {
            const fullDeposition = getDepositionWithOverrideValues();
            customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
                return fullDeposition;
            });
            const { getAllByTestId, getByTestId } = renderWithGlobalContext(<ActiveDepositionDetails />, customDeps);
            await waitForDomChange();
            const editButton = getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
            fireEvent.click(editButton[1]);
            await waitForDomChange();
            expect(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_REQUESTER_MODAL_DATA_TEST_ID_INPUT)).toHaveValue(
                fullDeposition.requesterNotes
            );
        });
        test("Shows toast when submitting", async () => {
            const fullDeposition = getDepositionWithOverrideValues();
            customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
                return fullDeposition;
            });
            customDeps.apiService.editDeposition = jest.fn().mockImplementation(async () => {
                return {};
            });
            const { getAllByTestId, getByTestId, getAllByText } = renderWithGlobalContext(
                <ActiveDepositionDetails />,
                customDeps
            );
            await waitForDomChange();
            const editButton = getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
            fireEvent.click(editButton[1]);
            fireEvent.change(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_REQUESTER_MODAL_DATA_TEST_ID_INPUT), {
                target: { value: TEST_CONSTANTS.EXPECTED_EDIT_REQUESTER_BODY.requesterNotes },
            });
            fireEvent.click(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_REQUESTER_MODAL_CONFIRM_BUTTON_TEST_ID));
            await waitForDomChange();
            await waitForElement(() => getAllByText(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_SUCCESS_TOAST));
            expect(customDeps.apiService.editDeposition).toHaveBeenCalledWith(
                fullDeposition.id,
                TEST_CONSTANTS.EXPECTED_EDIT_REQUESTER_BODY,
                undefined,
                undefined
            );
        });
        test("Shows error toast if fetch fails", async () => {
            const fullDeposition = getDepositionWithOverrideValues();
            customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
                return fullDeposition;
            });
            customDeps.apiService.editDeposition = jest.fn().mockRejectedValue(async () => {
                throw Error("Something wrong");
            });
            const { getAllByTestId, getByTestId, getAllByText } = renderWithGlobalContext(
                <ActiveDepositionDetails />,
                customDeps
            );
            await waitForDomChange();
            const editButton = getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
            fireEvent.click(editButton[1]);
            fireEvent.change(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_REQUESTER_MODAL_DATA_TEST_ID_INPUT), {
                target: { value: TEST_CONSTANTS.EXPECTED_EDIT_REQUESTER_BODY.requesterNotes },
            });
            fireEvent.click(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_REQUESTER_MODAL_CONFIRM_BUTTON_TEST_ID));
            await waitForElement(() => getAllByText(CONSTANTS.NETWORK_ERROR));
        });
    });
});

describe("tests the cancel depo flows", () => {
    test("Shows toast when properly canceled and depo status is pending", async () => {
        const startDate = moment(new Date()).add(30, "minutes").utc();
        const fullDeposition = getDepositionWithOverrideValues({ startDate });
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        customDeps.apiService.cancelDeposition = jest.fn().mockImplementation(async () => {
            return {};
        });
        const { getAllByTestId, getAllByText, getByText, getByTestId } = renderWithGlobalContext(
            <ActiveDepositionDetails />,
            customDeps
        );
        await waitForDomChange();
        const editButton = getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
        fireEvent.click(editButton[0]);
        const options = getAllByText("pending");
        userEvent.click(options[2]);
        const canceled = await waitForElement(() => getByText("Canceled"));
        userEvent.click(canceled);
        await wait(200);
        userEvent.click(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CONFIRM_BUTTON_TEST_ID));
        await waitForDomChange();
        await waitForElement(() => getByText(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_SUCCESS_TOAST));
        expect(customDeps.apiService.cancelDeposition).toHaveBeenCalledWith(fullDeposition.id);
    });
    test("Shows validation error message if start date is invalid", async () => {
        const startDate = moment(new Date()).add(0.5, "minutes").utc();
        const fullDeposition = getDepositionWithOverrideValues({ startDate });
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        customDeps.apiService.cancelDeposition = jest.fn().mockImplementation(async () => {
            return {};
        });
        const { getAllByTestId, getAllByText, getByText, getByTestId } = renderWithGlobalContext(
            <ActiveDepositionDetails />,
            customDeps
        );
        await waitForDomChange();
        const editButton = getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
        fireEvent.click(editButton[0]);
        const options = getAllByText("pending");
        userEvent.click(options[2]);
        const canceled = await waitForElement(() => getByText("Canceled"));
        userEvent.click(canceled);
        await wait(200);
        userEvent.click(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CONFIRM_BUTTON_TEST_ID));
        await waitForElement(() =>
            getByText(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_INVALID_CANCEL_DATE_MESSAGE)
        );
        expect(customDeps.apiService.cancelDeposition).not.toHaveBeenCalled();
    });
    test("Shows error toast if cancel endpoint fails and depo status is pending", async () => {
        const startDate = moment(new Date()).add(30, "minutes").utc();
        const fullDeposition = getDepositionWithOverrideValues({ startDate });
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        customDeps.apiService.cancelDeposition = jest.fn().mockRejectedValue(async () => {
            throw Error("Something wrong");
        });
        const { getAllByTestId, getAllByText, getByText, getByTestId } = renderWithGlobalContext(
            <ActiveDepositionDetails />,
            customDeps
        );
        await waitForDomChange();
        const editButton = getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
        fireEvent.click(editButton[0]);
        const options = getAllByText("pending");
        userEvent.click(options[2]);
        const canceled = await waitForElement(() => getByText("Canceled"));
        userEvent.click(canceled);
        await wait(200);
        userEvent.click(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CONFIRM_BUTTON_TEST_ID));
        await waitForElement(() => getByText(CONSTANTS.NETWORK_ERROR));
    });
    test("Shows modal when canceling a confirmed depo and a toast if the cancel succeeds", async () => {
        const startDate = moment(new Date()).add(30, "minutes").utc();
        const fullDeposition = getDepositionWithOverrideValues({ startDate, status: "Confirmed" });
        const modalText = getModalTextContent(Status.canceled, fullDeposition);
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        customDeps.apiService.cancelDeposition = jest.fn().mockImplementation(async () => {
            return {};
        });
        const { getAllByTestId, getAllByText, getByText, getByTestId } = renderWithGlobalContext(
            <ActiveDepositionDetails />,
            customDeps
        );
        await waitForDomChange();
        const editButton = getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
        fireEvent.click(editButton[0]);
        const options = getAllByText("Confirmed");
        userEvent.click(options[2]);
        const canceled = await waitForElement(() => getByText("Canceled"));
        userEvent.click(canceled);
        await wait(200);
        userEvent.click(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CONFIRM_BUTTON_TEST_ID));
        await waitForDomChange();
        expect(getByText(modalText.cancelButton)).toBeInTheDocument();
        expect(getByText(modalText.confirmButton)).toBeInTheDocument();
        expect(getByText(modalText.message)).toBeInTheDocument();
        expect(getByText(modalText.title)).toBeInTheDocument();
        fireEvent.click(getByText(modalText.confirmButton));
        await waitForDomChange();
        await waitForElement(() => getByText(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_SUCCESS_TOAST));
        expect(customDeps.apiService.cancelDeposition).toHaveBeenCalledWith(fullDeposition.id);
    });
    test("Shows modal when canceling a confirmed depo and a toast if the cancel endpoint fails", async () => {
        const startDate = moment(new Date()).add(30, "minutes").utc();
        const fullDeposition = getDepositionWithOverrideValues({ startDate, status: "Confirmed" });
        const modalText = getModalTextContent(Status.canceled, fullDeposition);
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        customDeps.apiService.cancelDeposition = jest.fn().mockImplementation(async () => {
            throw Error("something went wrong");
        });
        const { getAllByTestId, getAllByText, getByText, getByTestId } = renderWithGlobalContext(
            <ActiveDepositionDetails />,
            customDeps
        );
        await waitForDomChange();
        const editButton = getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
        fireEvent.click(editButton[0]);
        const options = getAllByText("Confirmed");
        userEvent.click(options[2]);
        const canceled = await waitForElement(() => getByText("Canceled"));
        userEvent.click(canceled);
        await wait(200);
        userEvent.click(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CONFIRM_BUTTON_TEST_ID));
        await waitForDomChange();
        expect(getByText(modalText.cancelButton)).toBeInTheDocument();
        expect(getByText(modalText.confirmButton)).toBeInTheDocument();
        expect(getByText(modalText.message)).toBeInTheDocument();
        expect(getByText(modalText.title)).toBeInTheDocument();
        fireEvent.click(getByText(modalText.confirmButton));
        await waitForDomChange();
        await waitForElement(() => getByText(CONSTANTS.NETWORK_ERROR));
        expect(customDeps.apiService.cancelDeposition).toHaveBeenCalledWith(fullDeposition.id);
    });
    test("Shows modal when reverting a canceled depo and a toast if the revert fails", async () => {
        const { startDate } = TEST_CONSTANTS.EXPECTED_REACTIVATED_TO_PENDING_DEPO_BODY;
        const fullDeposition = getDepositionWithOverrideValues({ startDate, status: "Canceled" });
        const modalText = getModalTextContent(Status.pending, fullDeposition);
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        customDeps.apiService.revertCancelDeposition = jest.fn().mockImplementation(async () => {
            throw Error("something went wrong");
        });
        const { getAllByTestId, getAllByText, getByText, getByTestId } = renderWithGlobalContext(
            <ActiveDepositionDetails />,
            customDeps
        );
        await waitForDomChange();
        const editButton = getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
        fireEvent.click(editButton[0]);
        const options = getAllByText("Canceled");
        userEvent.click(options[2]);
        const pending = await waitForElement(() => getByText("Pending"));
        userEvent.click(pending);
        await wait(200);
        userEvent.click(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CONFIRM_BUTTON_TEST_ID));
        await waitForDomChange();
        expect(getByText(modalText.cancelButton)).toBeInTheDocument();
        expect(getByText(modalText.confirmButton)).toBeInTheDocument();
        expect(getByText(modalText.message)).toBeInTheDocument();
        expect(getByText(modalText.title)).toBeInTheDocument();
        fireEvent.click(getByText(modalText.confirmButton));
        await waitForDomChange();
        await waitForElement(() => getByText(CONSTANTS.NETWORK_ERROR));
        expect(customDeps.apiService.revertCancelDeposition).toHaveBeenCalledWith(
            fullDeposition.id,
            TEST_CONSTANTS.EXPECTED_REACTIVATED_TO_PENDING_DEPO_BODY,
            null,
            false
        );
    });
    test("Shows modal when reverting a canceled depo and a toast if the revert succeeds", async () => {
        const { startDate } = TEST_CONSTANTS.EXPECTED_REACTIVATED_TO_PENDING_DEPO_BODY;
        const fullDeposition = getDepositionWithOverrideValues({ startDate, status: "Canceled" });
        const modalText = getModalTextContent(Status.pending, fullDeposition);
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        customDeps.apiService.revertCancelDeposition = jest.fn().mockImplementation(async () => {
            return {};
        });
        const { getAllByTestId, getAllByText, getByText, getByTestId } = renderWithGlobalContext(
            <ActiveDepositionDetails />,
            customDeps
        );
        await waitForDomChange();
        const editButton = getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
        fireEvent.click(editButton[0]);
        const options = getAllByText("Canceled");
        userEvent.click(options[2]);
        const pending = await waitForElement(() => getByText("Pending"));
        userEvent.click(pending);
        await wait(200);
        userEvent.click(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CONFIRM_BUTTON_TEST_ID));
        await waitForDomChange();
        expect(getByText(modalText.cancelButton)).toBeInTheDocument();
        expect(getByText(modalText.confirmButton)).toBeInTheDocument();
        expect(getByText(modalText.message)).toBeInTheDocument();
        expect(getByText(modalText.title)).toBeInTheDocument();
        fireEvent.click(getByText(modalText.confirmButton));
        await waitForDomChange();
        await waitForElement(() => getByText(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_SUCCESS_TOAST));
        expect(customDeps.apiService.revertCancelDeposition).toHaveBeenCalledWith(
            fullDeposition.id,
            TEST_CONSTANTS.EXPECTED_REACTIVATED_TO_PENDING_DEPO_BODY,
            null,
            false
        );
    });
    test("Shows modal when reverting a canceled depo to confirmed and a toast if the revert succeeds", async () => {
        const { startDate } = TEST_CONSTANTS.EXPECTED_REACTIVATED_TO_PENDING_DEPO_BODY;
        const fullDeposition = getDepositionWithOverrideValues({ startDate, status: "Canceled" });
        const modalText = getModalTextContent(Status.confirmed, fullDeposition);
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        customDeps.apiService.revertCancelDeposition = jest.fn().mockImplementation(async () => {
            return {};
        });
        const { getAllByTestId, getAllByText, getByText, getByTestId } = renderWithGlobalContext(
            <ActiveDepositionDetails />,
            customDeps
        );
        await waitForDomChange();
        const editButton = getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
        fireEvent.click(editButton[0]);
        const options = getAllByText("Canceled");
        userEvent.click(options[2]);
        const confirmed = await waitForElement(() => getAllByText("Confirmed"));
        userEvent.click(confirmed[1]);
        await wait(200);
        userEvent.click(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CONFIRM_BUTTON_TEST_ID));
        await waitForDomChange();
        expect(getByText(modalText.cancelButton)).toBeInTheDocument();
        expect(getByText(modalText.confirmButton)).toBeInTheDocument();
        expect(getByText(modalText.message)).toBeInTheDocument();
        expect(getByText(modalText.title)).toBeInTheDocument();
        fireEvent.click(getByText(modalText.confirmButton));
        await waitForDomChange();
        await waitForElement(() => getByText(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_SUCCESS_TOAST));
        expect(customDeps.apiService.revertCancelDeposition).toHaveBeenCalledWith(
            fullDeposition.id,
            { ...TEST_CONSTANTS.EXPECTED_REACTIVATED_TO_PENDING_DEPO_BODY, status: "Confirmed" },
            null,
            false
        );
    });
    test("Shows modal when reverting a canceled depo to confirmed and a toast if the revert fails", async () => {
        const { startDate } = TEST_CONSTANTS.EXPECTED_REACTIVATED_TO_PENDING_DEPO_BODY;
        const fullDeposition = getDepositionWithOverrideValues({ startDate, status: "Canceled" });
        const modalText = getModalTextContent(Status.confirmed, fullDeposition);
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        customDeps.apiService.revertCancelDeposition = jest.fn().mockImplementation(async () => {
            throw Error("Something went wrong");
        });
        const { getAllByTestId, getAllByText, getByText, getByTestId } = renderWithGlobalContext(
            <ActiveDepositionDetails />,
            customDeps
        );
        await waitForDomChange();
        const editButton = getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
        fireEvent.click(editButton[0]);
        const options = getAllByText("Canceled");
        userEvent.click(options[2]);
        const confirmed = await waitForElement(() => getAllByText("Confirmed"));
        userEvent.click(confirmed[1]);
        await wait(200);
        userEvent.click(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CONFIRM_BUTTON_TEST_ID));
        await waitForDomChange();
        expect(getByText(modalText.cancelButton)).toBeInTheDocument();
        expect(getByText(modalText.confirmButton)).toBeInTheDocument();
        expect(getByText(modalText.message)).toBeInTheDocument();
        expect(getByText(modalText.title)).toBeInTheDocument();
        fireEvent.click(getByText(modalText.confirmButton));
        await waitForDomChange();
        await waitForElement(() => getByText(CONSTANTS.NETWORK_ERROR));
        expect(customDeps.apiService.revertCancelDeposition).toHaveBeenCalledWith(
            fullDeposition.id,
            { ...TEST_CONSTANTS.EXPECTED_REACTIVATED_TO_PENDING_DEPO_BODY, status: "Confirmed" },
            null,
            false
        );
    });

    test("Fields are disabled if depo is canceled", async () => {
        const { startDate } = TEST_CONSTANTS.EXPECTED_REACTIVATED_TO_PENDING_DEPO_BODY;
        const fullDeposition = getDepositionWithOverrideValues({ startDate, status: "Canceled" });
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        const { getAllByTestId, getByTestId } = renderWithGlobalContext(<ActiveDepositionDetails />, customDeps);
        await waitForDomChange();
        const testIds = [
            CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_DATA_TEST_ID_JOB,
            CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CAPTION_BUTTON_TEST_ID,
            "false NO",
            "true YES",
            CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_DATA_TEST_ID_DETAILS,
        ];
        const editButton = getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
        fireEvent.click(editButton[0]);
        testIds.map((item) => expect(getByTestId(item)).toBeDisabled());
    });
    test("shouldn´t revert a depo if the file is invalid", async () => {
        const { startDate } = TEST_CONSTANTS.EXPECTED_REACTIVATED_TO_PENDING_DEPO_BODY;
        const fullDeposition = getDepositionWithOverrideValues({ startDate, status: "Canceled" });
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        customDeps.apiService.revertCancelDeposition = jest.fn().mockImplementation(async () => {
            return {};
        });
        const { getAllByTestId, getAllByText, getByTestId } = renderWithGlobalContext(
            <ActiveDepositionDetails />,
            customDeps
        );
        await waitForDomChange();
        const editButton = getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
        fireEvent.click(editButton[0]);
        await waitForDomChange();
        const options = getAllByText("Canceled");
        userEvent.click(options[2]);
        const confirmed = await waitForElement(() => getAllByText("Confirmed"));
        userEvent.click(confirmed[1]);
        await wait(200);
        fireEvent.click(
            getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CAPTION_BUTTON_REMOVE_FILE_TEST_ID)
        );
        const file = new File(["file"], "file.png", { type: "application/image" });
        await act(async () => {
            await fireEvent.change(
                getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_UPLOAD_COMPONENT_DATA_TEST_ID),
                {
                    target: { files: [file] },
                }
            );
        });
        userEvent.click(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CONFIRM_BUTTON_TEST_ID));
        expect(customDeps.apiService.revertCancelDeposition).not.toHaveBeenCalled();
    });
});

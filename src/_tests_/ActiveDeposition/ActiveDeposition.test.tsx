import { fireEvent, act, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import userEvent from "@testing-library/user-event";
import { Route, Router, Switch } from "react-router";
import dayjs from "dayjs";
import { Status } from "prp-components-library/src/components/StatusPill/StatusPill";
import timezone from "dayjs/plugin/timezone";
import Do from "dayjs/plugin/advancedFormat";
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
import { PARTICIPANT_MOCK, PARTICIPANT_MOCK_NAME } from "../constants/preJoinDepo";
import { mapTimeZone, TimeZones } from "../../models/general";
import { getUser1, getUserNotAdmin } from "../constants/signUp";
import { rootReducer } from "../../state/GlobalState";

dayjs.extend(timezone);
dayjs.extend(Do);

const history = createMemoryHistory();

let customDeps;

const POST_DEPO_DETAILS = () => <div>POST-DEPO</div>;

jest.mock("../../helpers/downloadFile");

beforeEach(() => {
    customDeps = getMockDeps();
});

test("Error toast should appear if remove participant endpoint fails", async () => {
    customDeps.apiService.fetchParticipants = jest.fn().mockImplementation(async () => {
        return [PARTICIPANT_MOCK];
    });
    customDeps.apiService.removeParticipantFromExistingDepo = jest.fn().mockRejectedValue(Error);

    const deposition = getDepositionWithOverrideValues();
    const { getByText, findByText, findByTestId } = renderWithGlobalContext(
        <ParticipantListTable deposition={deposition} activeKey={CONSTANTS.DEPOSITION_DETAILS_TABS[1]} />,
        customDeps
    );
    fireEvent.click(await findByTestId(`${PARTICIPANT_MOCK_NAME}_delete_icon`));
    const modalButtonLabel = await findByText(CONSTANTS.DEPOSITION_DETAILS_DELETE_MODAL_CONFIRM_BUTTON_LABEL);
    fireEvent.click(modalButtonLabel);
    await waitFor(() => {
        expect(getByText(CONSTANTS.NETWORK_ERROR));
    });
});

test("Calls caption endpoint with proper params and helper function", async () => {
    const fullDeposition = getDepositionWithOverrideValues();
    customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
        return fullDeposition;
    });
    const { getByText } = renderWithGlobalContext(<ActiveDepositionDetails />, customDeps, {
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
        fireEvent.click(getByText(fullDeposition.caption.displayName));
        expect(customDeps.apiService.fetchCaption).toHaveBeenCalledWith(fullDeposition.id);
        expect(downloadFile).toHaveBeenCalledWith(CAPTION_MOCK.preSignedUrl);
    });
});

test("Toast should appear when removing a participant", async () => {
    customDeps.apiService.fetchParticipants = jest.fn().mockImplementation(async () => {
        return [PARTICIPANT_MOCK];
    });
    customDeps.apiService.removeParticipantFromExistingDepo = jest.fn().mockImplementation(async () => {
        return {};
    });

    const deposition = getDepositionWithOverrideValues();
    const { findByTestId, findByText } = renderWithGlobalContext(
        <ParticipantListTable deposition={deposition} activeKey={CONSTANTS.DEPOSITION_DETAILS_TABS[1]} />,
        customDeps
    );
    fireEvent.click(await findByTestId(`${PARTICIPANT_MOCK_NAME}_delete_icon`));
    fireEvent.click(await findByText(CONSTANTS.DEPOSITION_DETAILS_DELETE_MODAL_CONFIRM_BUTTON_LABEL));
    expect(await findByText(CONSTANTS.DEPOSITION_DETAILS_REMOVE_PARTICIPANT_TOAST));
    expect(customDeps.apiService.removeParticipantFromExistingDepo).toHaveBeenCalledWith(
        deposition.id,
        PARTICIPANT_MOCK.id
    );
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
    const deposition = getDepositionWithOverrideValues({ status: "Pending" });
    const { findByTestId, findByText, queryByText } = renderWithGlobalContext(
        <ParticipantListTable deposition={deposition} activeKey={CONSTANTS.DEPOSITION_DETAILS_TABS[1]} />,
        customDeps
    );
    fireEvent.click(await findByTestId(`${PARTICIPANT_MOCK_NAME}_delete_icon`));
    ModalTextsArray.map(async (text) => expect(await findByText(text)).toBeInTheDocument());
    fireEvent.click(await findByText(CONSTANTS.DEPOSITION_DETAILS_DELETE_MODAL_CANCEL_BUTTON_LABEL));
    ModalTextsArray.map((text) => expect(queryByText(text)).toBeNull());
});

test("Should display error toast if add participant endpoint fails", async () => {
    customDeps.apiService.fetchParticipants = jest.fn().mockImplementation(async () => {
        return [PARTICIPANT_MOCK];
    });
    customDeps.apiService.addParticipantToExistingDepo = jest.fn().mockRejectedValue(Error(""));
    const deposition = getDepositionWithOverrideValues();
    const { findByText, findByTestId, findAllByText } = renderWithGlobalContext(
        <ParticipantListTable deposition={deposition} activeKey={CONSTANTS.DEPOSITION_DETAILS_TABS[1]} />,
        customDeps
    );
    fireEvent.click(await findByText(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_BUTTON));
    await act(async () => {
        userEvent.click(await findByText(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_ROLE_SELECT_PLACEHOLDER));
        const role = await findByTestId("Attorney");
        userEvent.click(role);
    });
    fireEvent.click(await findByTestId(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_CONFIRM_BUTTON_TEST_ID));
    expect(await (await findAllByText(CONSTANTS.NETWORK_ERROR)).length).toBeGreaterThan(0);
});

test("Shows spinner on mount", async () => {
    customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
        await wait(100);
        return [];
    });
    const { getByTestId } = renderWithGlobalContext(<ActiveDepositionDetails />, customDeps, {
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
    expect(getByTestId("spinner")).toBeInTheDocument();
});
test("Shows error when fetch fails", async () => {
    customDeps.apiService.fetchDeposition = jest.fn().mockRejectedValue(async () => {
        throw Error("Something wrong");
    });
    const { getByText } = renderWithGlobalContext(<ActiveDepositionDetails />, customDeps, {
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
        expect(getByText(ERRORS_CONSTANTS.FETCH_ERROR_MODAL_TITLE)).toBeInTheDocument();
        expect(getByText(ERRORS_CONSTANTS.FETCH_ERROR_MODAL_BODY)).toBeInTheDocument();
        expect(getByText(ERRORS_CONSTANTS.FETCH_ERROR_MODAL_BODY)).toBeInTheDocument();
    });
});

test("Shows error when the current user is not admin", async () => {
    customDeps.apiService.currentUser = jest.fn().mockRejectedValue(async () => getUserNotAdmin());
    const { getByText } = renderWithGlobalContext(<ActiveDepositionDetails />, customDeps, {
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
        expect(getByText(ERRORS_CONSTANTS.FETCH_ERROR_MODAL_TITLE)).toBeInTheDocument();
        expect(getByText(ERRORS_CONSTANTS.FETCH_ERROR_MODAL_BODY)).toBeInTheDocument();
        expect(getByText(ERRORS_CONSTANTS.FETCH_ERROR_MODAL_BODY)).toBeInTheDocument();
    });
});

test("Shows correct info if fetch succeeds", async () => {
    customDeps.apiService.fetchDeposition = jest.fn().mockRejectedValue(async () => {
        throw Error("Something wrong");
    });
    const { getByText } = renderWithGlobalContext(<ActiveDepositionDetails />, customDeps, {
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
        expect(getByText(ERRORS_CONSTANTS.FETCH_ERROR_MODAL_TITLE)).toBeInTheDocument();
        expect(getByText(ERRORS_CONSTANTS.FETCH_ERROR_MODAL_BODY)).toBeInTheDocument();
        expect(getByText(ERRORS_CONSTANTS.FETCH_ERROR_MODAL_BODY)).toBeInTheDocument();
    });
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
    const month = dayjs(fullDeposition.creationDate).format("MMMM");
    const day = dayjs(fullDeposition.creationDate).format("Do");
    const year = dayjs(fullDeposition.creationDate).format("YYYY");
    const formattedDay = `${month} ${day}, ${year}`;

    customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
        return fullDeposition;
    });
    const { getByText, getAllByText, getByTestId } = renderWithGlobalContext(<ActiveDepositionDetails />, customDeps, {
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
        expect(getByText(fullDeposition.caseName)).toBeInTheDocument();
        expect(getByText(fullDeposition.caseNumber)).toBeInTheDocument();
        expect(getByText(fullDeposition.witness.name)).toBeInTheDocument();
        expect(
            getByText(
                dayjs(fullDeposition.startDate).tz(mapTimeZone[fullDeposition.timeZone]).format(CONSTANTS.FORMAT_DATE)
            )
        ).toBeInTheDocument();
        const startDate = dayjs(fullDeposition.startDate)
            .tz(mapTimeZone[fullDeposition.timeZone])
            .format(CONSTANTS.FORMAT_TIME)
            .split(" ");
        const completeDate = dayjs(fullDeposition.endDate)
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
});

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
    const { getAllByText } = renderWithGlobalContext(<ActiveDepositionDetails />, customDeps, {
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
        expect(getAllByText(CONSTANTS.DEPOSITION_NO_PARTICIPANT_TEXT)).toHaveLength(4);
    });
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
    const { getAllByText, getByText } = renderWithGlobalContext(<ActiveDepositionDetails />, customDeps, {
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
        expect(getAllByText(CONSTANTS.DEPOSITION_NO_TEXT)).toHaveLength(3);
        expect(getByText(CONSTANTS.DEPOSITION_VIDEO_RECORDING_FALSE_TEXT)).toBeInTheDocument();
    });
});
test("complete date is not shown if completed date is missing", async () => {
    const fullDeposition = getDepositionWithOverrideValues({
        endDate: "",
    });

    customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
        return fullDeposition;
    });
    const { queryByText, getByText } = renderWithGlobalContext(<ActiveDepositionDetails />, customDeps, {
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
        const startDate = dayjs(fullDeposition.startDate)
            .tz(mapTimeZone[fullDeposition.timeZone])
            .format(CONSTANTS.FORMAT_TIME)
            .split(" ");
        const completeDate = dayjs(fullDeposition.endDate)
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
                `${startDate[1] === completeDate.split(" ")[1] ? startDate[0] : startDate.join(" ").toLowerCase()} ${
                    fullDeposition.timeZone
                }`
            )
        ).toBeInTheDocument();
    });
});

test("Shows toast if caption endpoint fails", async () => {
    const fullDeposition = getDepositionWithOverrideValues();
    customDeps.apiService.fetchCaption = jest.fn().mockRejectedValue(async () => {
        throw Error("Something wrong");
    });
    customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
        return fullDeposition;
    });
    const { findByText } = renderWithGlobalContext(<ActiveDepositionDetails />, customDeps, {
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
    fireEvent.click(await findByText(fullDeposition.caption.displayName));
    expect(await findByText(CONSTANTS.CAPTION_NETWORK_ERROR)).toBeInTheDocument();
});

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
    await waitFor(() => {
        expect(getByText(ERRORS_CONSTANTS.FETCH_ERROR_MODAL_TITLE)).toBeInTheDocument();
        expect(getByText(ERRORS_CONSTANTS.FETCH_ERROR_MODAL_BODY)).toBeInTheDocument();
        expect(getByText(ERRORS_CONSTANTS.FETCH_ERROR_MODAL_BODY)).toBeInTheDocument();
    });
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
        expect(customDeps.apiService.fetchParticipants).toHaveBeenCalledWith(deposition.id, {});
    });
});

test("Calls the sorting endpoint with the ascend parameters", async () => {
    customDeps.apiService.fetchParticipants = jest.fn().mockImplementation(async () => {
        return [DEPO_PARTICIPANT_MOCK];
    });
    const deposition = getDepositionWithOverrideValues();
    const { findByText } = renderWithGlobalContext(
        <ParticipantListTable deposition={deposition} activeKey={CONSTANTS.DEPOSITION_DETAILS_TABS[1]} />,
        customDeps
    );
    await waitFor(() => {
        CONSTANTS.DEPOSITION_DETAILS_INVITED_PARTIES_COLUMNS.filter((column) => {
            const isASortingColumn = column.title !== "PHONE NUMBER";
            return isASortingColumn;
        }).map(async (element) => {
            fireEvent.click(await findByText(element.title));
            expect(customDeps.apiService.fetchParticipants).toHaveBeenLastCalledWith(deposition.id, {
                sortDirection: "ascend",
                sortField: element.title.toLowerCase(),
            });
        });
    });
});
test("Calls the sorting endpoint with the descend parameters", async () => {
    customDeps.apiService.fetchParticipants = jest.fn().mockImplementation(async () => {
        return [DEPO_PARTICIPANT_MOCK];
    });
    const deposition = getDepositionWithOverrideValues();
    const { findByText, getByText } = renderWithGlobalContext(
        <ParticipantListTable deposition={deposition} activeKey={CONSTANTS.DEPOSITION_DETAILS_TABS[1]} />,
        customDeps
    );
    await waitFor(() => {
        CONSTANTS.DEPOSITION_DETAILS_INVITED_PARTIES_COLUMNS.filter((column) => {
            const isASortingColumn = column.title !== "PHONE NUMBER";
            return isASortingColumn;
        }).map(async (element) => {
            fireEvent.click(await findByText(element.title));
            fireEvent.click(getByText(element.title));
            expect(customDeps.apiService.fetchParticipants).toHaveBeenLastCalledWith(deposition.id, {
                sortDirection: "descend",
                sortField: element.title.toLowerCase(),
            });
        });
    });
});

test("Calls the sorting endpoint with no parameters", async () => {
    customDeps.apiService.fetchParticipants = jest.fn().mockImplementation(async () => {
        return [DEPO_PARTICIPANT_MOCK];
    });
    const deposition = getDepositionWithOverrideValues();
    const { findByText } = renderWithGlobalContext(
        <ParticipantListTable deposition={deposition} activeKey={CONSTANTS.DEPOSITION_DETAILS_TABS[1]} />,
        customDeps
    );
    await waitFor(() => {
        CONSTANTS.DEPOSITION_DETAILS_INVITED_PARTIES_COLUMNS.filter((column) => {
            const isASortingColumn = column.title !== "PHONE NUMBER";
            return isASortingColumn;
        }).map(async (element) => {
            const title = await findByText(element.title);
            fireEvent.click(title);
            fireEvent.click(title);
            fireEvent.click(title);
            expect(customDeps.apiService.fetchParticipants).toHaveBeenLastCalledWith(deposition.id, {});
        });
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
    const deleteIcon = queryByTestId(`${participantMock.name}_delete_icon`);
    await waitFor(() => {
        expect(deleteIcon).toBeNull();
    });
});
test("Remove icon shows if participant is not a witness", async () => {
    customDeps.apiService.fetchParticipants = jest.fn().mockImplementation(async () => {
        return [PARTICIPANT_MOCK];
    });
    const deposition = getDepositionWithOverrideValues();
    const { findByTestId } = renderWithGlobalContext(
        <ParticipantListTable deposition={deposition} activeKey={CONSTANTS.DEPOSITION_DETAILS_TABS[1]} />,
        customDeps
    );
    expect(await findByTestId(`${PARTICIPANT_MOCK_NAME}_delete_icon`)).toBeInTheDocument();
});
test("Should validate add participant form", async () => {
    customDeps.apiService.fetchParticipants = jest.fn().mockImplementation(async () => {
        return [PARTICIPANT_MOCK];
    });
    const deposition = getDepositionWithOverrideValues();
    const { findByText, findByTestId } = renderWithGlobalContext(
        <ParticipantListTable deposition={deposition} activeKey={CONSTANTS.DEPOSITION_DETAILS_TABS[1]} />,
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

    fireEvent.click(await findByText(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_BUTTON));

    fireEvent.change(await findByTestId(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_DATA_TEST_ID_EMAIL), {
        target: { value: "test1234" },
    });
    fireEvent.change(await findByTestId(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_DATA_TEST_ID_PHONE), {
        target: { value: "test1234" },
    });
    fireEvent.click(await findByTestId(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_CONFIRM_BUTTON_TEST_ID));

    await waitFor(async () => {
        expect(
            await findByTestId(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_DATA_TEST_ID_INVALID_ROLE)
        ).toBeInTheDocument();
        expect(await findByText(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_EMAIL_INVALID)).toBeInTheDocument();
        expect(await findByText(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_PHONE_INVALID)).toBeInTheDocument();
    });
});
test("Should add participant and display toast", async () => {
    customDeps.apiService.fetchParticipants = jest.fn().mockImplementation(async () => {
        return [PARTICIPANT_MOCK];
    });
    customDeps.apiService.addParticipantToExistingDepo = jest.fn().mockImplementation(async () => {
        return {};
    });
    const deposition = getDepositionWithOverrideValues();
    const { findByTestId, findByText, findAllByText } = renderWithGlobalContext(
        <ParticipantListTable deposition={deposition} activeKey={CONSTANTS.DEPOSITION_DETAILS_TABS[1]} />,
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
    fireEvent.click(await findByText(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_BUTTON));
    userEvent.click(await findByText(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_ROLE_SELECT_PLACEHOLDER));
    const role = await findAllByText("Paralegal");

    userEvent.click(role[0]);
    await wait(200);
    fireEvent.change(await findByTestId(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_DATA_TEST_ID_EMAIL), {
        target: { value: "test@test.com" },
    });
    fireEvent.change(await findByTestId(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_DATA_TEST_ID_PHONE), {
        target: { value: "5555555555" },
    });
    fireEvent.change(await findByTestId(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_DATA_TEST_ID_NAME), {
        target: { value: "test" },
    });
    userEvent.click(await findByTestId(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_CONFIRM_BUTTON_TEST_ID));
    expect(
        await findByText(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_ADDED_PARTICIPANT_TOAST)
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
    const { findByTestId, findByText, findAllByText } = renderWithGlobalContext(
        <ParticipantListTable deposition={deposition} activeKey={CONSTANTS.DEPOSITION_DETAILS_TABS[1]} />,
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
    fireEvent.click(await findByText(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_BUTTON));
    userEvent.click(await findByText(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_ROLE_SELECT_PLACEHOLDER));
    const role = await findAllByText("Paralegal");
    userEvent.click(role[0]);
    await wait(200);
    userEvent.click(await findByTestId(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_CONFIRM_BUTTON_TEST_ID));
    expect(
        await findByText(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_PARTICIPANT_ALREADY_EXISTS_ERROR)
    ).toBeInTheDocument();
});

test("Court Reporter shouldn´t be an option in Add Participant Modal if there is already one present", async () => {
    const participant = getDepoParticipantWithOverrideValues();
    customDeps.apiService.fetchParticipants = jest.fn().mockImplementation(async () => {
        return [participant];
    });
    customDeps.apiService.addParticipantToExistingDepo = jest.fn().mockRejectedValue({});
    const deposition = getDepositionWithOverrideValues();
    const { findByText, findAllByText } = renderWithGlobalContext(
        <ParticipantListTable deposition={deposition} activeKey={CONSTANTS.DEPOSITION_DETAILS_TABS[1]} />,
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
    expect(await findByText("Court Reporter")).toBeInTheDocument();
    fireEvent.click(await findByText(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_BUTTON));
    userEvent.click(await findByText(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_ROLE_SELECT_PLACEHOLDER));
    const role = await findAllByText("Court Reporter");
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
        expect(queryByText(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_BUTTON)).toBeNull();
    });
});

test("Shows correct info when modal pops up after clicking the edit icon on the depo info", async () => {
    const fullDeposition = getDepositionWithOverrideValues();
    customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
        return fullDeposition;
    });
    const { findAllByTestId, findAllByText, findByTestId } = renderWithGlobalContext(
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
    const editButton = await findAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
    fireEvent.click(editButton[0]);
    expect(await findAllByText(fullDeposition.status)).toHaveLength(3);
    expect(await findByTestId("true YES")).toBeChecked();
    expect(await findByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_DATA_TEST_ID_JOB)).toHaveValue(
        fullDeposition.job
    );
    expect(
        await (
            await findByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CAPTION_BUTTON_TEST_ID)
        ).childNodes[1]
    ).toHaveTextContent(fullDeposition.caption.displayName);
    expect(await findByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_DATA_TEST_ID_DETAILS)).toHaveValue(
        fullDeposition.details
    );
});

test("Active deposition details should display a back button", async () => {
    const fullDeposition = getDepositionWithOverrideValues();
    customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
        return fullDeposition;
    });
    const { findByTestId } = renderWithGlobalContext(
        <Router history={history}>
            <ActiveDepositionDetails />
        </Router>,
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

    const backButton = await findByTestId("depo_active_detail_back_button");
    expect(backButton).toBeInTheDocument();
    fireEvent.click(backButton);
    await waitFor(() => {
        expect(history.location.pathname).toBe("/depositions");
    });
});

test("Shows correct info when modal pops up after clicking the edit icon on the requester info", async () => {
    const fullDeposition = getDepositionWithOverrideValues();
    customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
        return fullDeposition;
    });
    const { findAllByTestId, findByTestId } = renderWithGlobalContext(<ActiveDepositionDetails />, customDeps, {
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
    const editButton = await findAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
    fireEvent.click(editButton[1]);
    await waitFor(async () => {
        expect(await findByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_REQUESTER_MODAL_DATA_TEST_ID_INPUT)).toHaveValue(
            fullDeposition.requesterNotes
        );
    });
});
test("Shows toast when submitting", async () => {
    const fullDeposition = getDepositionWithOverrideValues();
    customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
        return fullDeposition;
    });
    customDeps.apiService.editDeposition = jest.fn().mockImplementation(async () => {
        return {};
    });
    const { findAllByTestId, findByTestId, findAllByText } = renderWithGlobalContext(
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
    const editButton = await findAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
    fireEvent.click(editButton[1]);
    fireEvent.change(await findByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_REQUESTER_MODAL_DATA_TEST_ID_INPUT), {
        target: { value: TEST_CONSTANTS.EXPECTED_EDIT_REQUESTER_BODY.requesterNotes },
    });
    fireEvent.click(await findByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_REQUESTER_MODAL_CONFIRM_BUTTON_TEST_ID));
    await findAllByText(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_SUCCESS_TOAST);
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
    const { findAllByTestId, findByTestId, findAllByText } = renderWithGlobalContext(
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
    const editButton = await findAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
    fireEvent.click(editButton[1]);
    fireEvent.change(await findByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_REQUESTER_MODAL_DATA_TEST_ID_INPUT), {
        target: { value: TEST_CONSTANTS.EXPECTED_EDIT_REQUESTER_BODY.requesterNotes },
    });
    fireEvent.click(await findByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_REQUESTER_MODAL_CONFIRM_BUTTON_TEST_ID));
    expect(await (await findAllByText(CONSTANTS.NETWORK_ERROR)).length).toBeGreaterThan(0);
});

test("Shows toast when properly canceled and depo status is pending", async () => {
    const startDate = dayjs(new Date()).add(30, "minutes").utc();
    const fullDeposition = getDepositionWithOverrideValues({ startDate });
    customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
        return fullDeposition;
    });
    customDeps.apiService.cancelDeposition = jest.fn().mockImplementation(async () => {
        return {};
    });
    const { findAllByTestId, findAllByText, findByText, findByTestId } = renderWithGlobalContext(
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
    const editButton = await findAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
    fireEvent.click(editButton[0]);
    const options = await findAllByText("pending");
    userEvent.click(options[2]);
    const canceled = await findByText("Canceled");
    userEvent.click(canceled);
    await wait(200);
    userEvent.click(await findByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CONFIRM_BUTTON_TEST_ID));
    await findAllByText(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_SUCCESS_TOAST);
    expect(customDeps.apiService.cancelDeposition).toHaveBeenCalledWith(fullDeposition.id);
});
test("Shows validation error message if start date is invalid", async () => {
    const startDate = dayjs(new Date()).add(0.5, "minutes").utc();
    const fullDeposition = getDepositionWithOverrideValues({ startDate });
    customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
        return fullDeposition;
    });
    customDeps.apiService.cancelDeposition = jest.fn().mockImplementation(async () => {
        return {};
    });
    const { findAllByTestId, findAllByText, findByText, findByTestId } = renderWithGlobalContext(
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
    const editButton = await findAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
    fireEvent.click(editButton[0]);
    const options = await findAllByText("pending");
    userEvent.click(options[2]);
    const canceled = await findByText("Canceled");
    userEvent.click(canceled);
    await wait(200);
    userEvent.click(await findByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CONFIRM_BUTTON_TEST_ID));
    await findByText(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_INVALID_CANCEL_DATE_MESSAGE);
    expect(customDeps.apiService.cancelDeposition).not.toHaveBeenCalled();
});
test("Shows error toast if cancel endpoint fails and depo status is pending", async () => {
    const startDate = dayjs(new Date()).add(30, "minutes").utc();
    const fullDeposition = getDepositionWithOverrideValues({ startDate });
    customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
        return fullDeposition;
    });
    customDeps.apiService.cancelDeposition = jest.fn().mockRejectedValue(async () => {
        throw Error("Something wrong");
    });
    const { findAllByTestId, findAllByText, findByText, findByTestId } = renderWithGlobalContext(
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
    const editButton = await findAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
    fireEvent.click(editButton[0]);
    const options = await findAllByText("pending");
    userEvent.click(options[2]);
    const canceled = await findByText("Canceled");
    userEvent.click(canceled);
    await wait(200);
    userEvent.click(await findByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CONFIRM_BUTTON_TEST_ID));
    await findByText(CONSTANTS.NETWORK_ERROR);
});
test("Shows modal when canceling a confirmed depo and a toast if the cancel succeeds", async () => {
    const startDate = dayjs(new Date()).add(30, "minutes").utc();
    const fullDeposition = getDepositionWithOverrideValues({ startDate, status: "Confirmed" });
    const modalText = getModalTextContent(Status.canceled, fullDeposition);
    customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
        return fullDeposition;
    });
    customDeps.apiService.cancelDeposition = jest.fn().mockImplementation(async () => {
        return {};
    });
    const { findAllByTestId, findAllByText, findByText, findByTestId } = renderWithGlobalContext(
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
    const editButton = await findAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
    fireEvent.click(editButton[0]);
    const options = await findAllByText("Confirmed");
    userEvent.click(options[2]);
    const canceled = await findByText("Canceled");
    userEvent.click(canceled);
    await wait(200);
    userEvent.click(await findByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CONFIRM_BUTTON_TEST_ID));
    expect(await findByText(modalText.cancelButton)).toBeInTheDocument();
    expect(await findByText(modalText.confirmButton)).toBeInTheDocument();
    expect(await findByText(modalText.message)).toBeInTheDocument();
    expect(await findByText(modalText.title)).toBeInTheDocument();
    fireEvent.click(await findByText(modalText.confirmButton));
    await findAllByText(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_SUCCESS_TOAST);
    expect(customDeps.apiService.cancelDeposition).toHaveBeenCalledWith(fullDeposition.id);
});
test("Shows modal when canceling a confirmed depo and a toast if the cancel endpoint fails", async () => {
    const startDate = dayjs(new Date()).add(30, "minutes").utc();
    const fullDeposition = getDepositionWithOverrideValues({ startDate, status: "Confirmed" });
    const modalText = getModalTextContent(Status.canceled, fullDeposition);
    customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
        return fullDeposition;
    });
    customDeps.apiService.cancelDeposition = jest.fn().mockImplementation(async () => {
        throw Error("something went wrong");
    });
    const { findAllByTestId, findAllByText, findByText, findByTestId } = renderWithGlobalContext(
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
    const editButton = await findAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
    fireEvent.click(editButton[0]);
    const options = await findAllByText("Confirmed");
    userEvent.click(options[2]);
    const canceled = await findByText("Canceled");
    userEvent.click(canceled);
    await wait(200);
    userEvent.click(await findByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CONFIRM_BUTTON_TEST_ID));
    expect(await findByText(modalText.cancelButton)).toBeInTheDocument();
    expect(await findByText(modalText.confirmButton)).toBeInTheDocument();
    expect(await findByText(modalText.message)).toBeInTheDocument();
    expect(await findByText(modalText.title)).toBeInTheDocument();
    fireEvent.click(await findByText(modalText.confirmButton));
    await findAllByText(CONSTANTS.NETWORK_ERROR);
    expect(customDeps.apiService.cancelDeposition).toHaveBeenCalledWith(fullDeposition.id);
});
test("Shows modal when reverting a canceled depo and a toast if the revert fails", async () => {
    const { startDate } = TEST_CONSTANTS.EXPECTED_DEPOSITION_BODY;
    const fullDeposition = getDepositionWithOverrideValues({ startDate, status: "Canceled", endDate: null });
    const modalText = getModalTextContent(Status.pending, fullDeposition);
    customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
        return fullDeposition;
    });
    customDeps.apiService.revertCancelDeposition = jest.fn().mockImplementation(async () => {
        throw Error("something went wrong");
    });
    const { findAllByTestId, findAllByText, findByText, findByTestId } = renderWithGlobalContext(
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
    const editButton = await findAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
    fireEvent.click(editButton[0]);
    const options = await findAllByText("Canceled");
    userEvent.click(options[2]);
    const pending = await findByText("Pending");
    userEvent.click(pending);
    await wait(200);
    userEvent.click(await findByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CONFIRM_BUTTON_TEST_ID));
    expect(await findByText(modalText.cancelButton)).toBeInTheDocument();
    expect(await findByText(modalText.confirmButton)).toBeInTheDocument();
    expect(await findByText(modalText.message)).toBeInTheDocument();
    expect(await findByText(modalText.title)).toBeInTheDocument();
    fireEvent.click(await findByText(modalText.confirmButton));
    await findAllByText(CONSTANTS.NETWORK_ERROR);
    expect(customDeps.apiService.revertCancelDeposition).toHaveBeenCalledWith(
        fullDeposition.id,
        {
            ...TEST_CONSTANTS.EXPECTED_REACTIVATED_TO_PENDING_DEPO_BODY,
            endDate: null,
            startDate: dayjs(startDate).tz(mapTimeZone[TimeZones.ET]),
        },
        null,
        false
    );
});
test("Shows modal when reverting a canceled depo and a toast if the revert succeeds", async () => {
    const { startDate } = TEST_CONSTANTS.EXPECTED_REACTIVATED_TO_PENDING_DEPO_BODY;
    const fullDeposition = getDepositionWithOverrideValues({ startDate, status: "Canceled", endDate: null });
    const modalText = getModalTextContent(Status.pending, fullDeposition);
    customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
        return fullDeposition;
    });
    customDeps.apiService.revertCancelDeposition = jest.fn().mockImplementation(async () => {
        return {};
    });
    const { findAllByTestId, findAllByText, findByText, findByTestId } = renderWithGlobalContext(
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
    const editButton = await findAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
    fireEvent.click(editButton[0]);
    const options = await findAllByText("Canceled");
    userEvent.click(options[2]);
    const pending = await findByText("Pending");
    userEvent.click(pending);
    await wait(200);
    userEvent.click(await findByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CONFIRM_BUTTON_TEST_ID));
    expect(await findByText(modalText.cancelButton)).toBeInTheDocument();
    expect(await findByText(modalText.confirmButton)).toBeInTheDocument();
    expect(await findByText(modalText.message)).toBeInTheDocument();
    expect(await findByText(modalText.title)).toBeInTheDocument();
    fireEvent.click(await findByText(modalText.confirmButton));
    await findAllByText(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_SUCCESS_TOAST);
    expect(customDeps.apiService.revertCancelDeposition).toHaveBeenCalledWith(
        fullDeposition.id,
        {
            ...TEST_CONSTANTS.EXPECTED_REACTIVATED_TO_PENDING_DEPO_BODY,
            endDate: null,
            startDate: dayjs(startDate).tz(mapTimeZone[TimeZones.ET]),
        },
        null,
        false
    );
});
test("Shows modal when reverting a canceled depo to confirmed and a toast if the revert succeeds", async () => {
    const { startDate } = TEST_CONSTANTS.EXPECTED_REACTIVATED_TO_PENDING_DEPO_BODY;
    const fullDeposition = getDepositionWithOverrideValues({ startDate, status: "Canceled", endDate: null });
    const modalText = getModalTextContent(Status.confirmed, fullDeposition);
    customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
        return fullDeposition;
    });
    customDeps.apiService.revertCancelDeposition = jest.fn().mockImplementation(async () => {
        return {};
    });
    const { findAllByTestId, findAllByText, findByText, findByTestId } = renderWithGlobalContext(
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
    const editButton = await findAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
    fireEvent.click(editButton[0]);
    const options = await findAllByText("Canceled");
    userEvent.click(options[2]);
    const confirmed = await findAllByText("Confirmed");
    userEvent.click(confirmed[1]);
    await wait(200);
    userEvent.click(await findByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CONFIRM_BUTTON_TEST_ID));
    expect(await findByText(modalText.cancelButton)).toBeInTheDocument();
    expect(await findByText(modalText.confirmButton)).toBeInTheDocument();
    expect(await findByText(modalText.message)).toBeInTheDocument();
    expect(await findByText(modalText.title)).toBeInTheDocument();
    fireEvent.click(await findByText(modalText.confirmButton));
    await waitFor(() => findByText(CONSTANTS.DEPOSITION_DETAILS_CHANGE_TO_CONFIRM_EMAIL_SENT_TO_ALL));
    expect(customDeps.apiService.revertCancelDeposition).toHaveBeenCalledWith(
        fullDeposition.id,
        {
            ...TEST_CONSTANTS.EXPECTED_REACTIVATED_TO_PENDING_DEPO_BODY,
            status: "Confirmed",
            endDate: null,
            startDate: dayjs(startDate).tz(mapTimeZone[TimeZones.ET]),
        },
        null,
        false
    );
});
test("Shows modal when reverting a canceled depo to confirmed and a toast if the revert fails", async () => {
    const { startDate } = TEST_CONSTANTS.EXPECTED_DEPOSITION_BODY;
    const fullDeposition = getDepositionWithOverrideValues({
        startDate,
        endDate: null,
        status: "Canceled",
    });
    const modalText = getModalTextContent(Status.confirmed, fullDeposition);
    customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
        return fullDeposition;
    });
    customDeps.apiService.revertCancelDeposition = jest.fn().mockImplementation(async () => {
        throw Error("Something went wrong");
    });
    const { findAllByTestId, findAllByText, findByText, findByTestId } = renderWithGlobalContext(
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
    const editButton = await findAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
    fireEvent.click(editButton[0]);
    const options = await findAllByText("Canceled");
    userEvent.click(options[2]);
    const confirmed = await findAllByText("Confirmed");
    userEvent.click(confirmed[1]);
    await wait(200);
    userEvent.click(await findByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CONFIRM_BUTTON_TEST_ID));
    expect(await findByText(modalText.cancelButton)).toBeInTheDocument();
    expect(await findByText(modalText.confirmButton)).toBeInTheDocument();
    expect(await findByText(modalText.message)).toBeInTheDocument();
    expect(await findByText(modalText.title)).toBeInTheDocument();
    fireEvent.click(await findByText(modalText.confirmButton));
    await findAllByText(CONSTANTS.NETWORK_ERROR);
    expect(customDeps.apiService.revertCancelDeposition).toHaveBeenCalledWith(
        fullDeposition.id,
        {
            ...TEST_CONSTANTS.EXPECTED_REACTIVATED_TO_PENDING_DEPO_BODY,
            endDate: null,
            status: "Confirmed",
            startDate: dayjs(startDate).tz(mapTimeZone[TimeZones.ET]),
        },
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
    const { findAllByTestId, findByTestId } = renderWithGlobalContext(<ActiveDepositionDetails />, customDeps, {
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
    const testIds = [
        CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_DATA_TEST_ID_JOB,
        CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CAPTION_BUTTON_TEST_ID,
        "false NO",
        "true YES",
        CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_DATA_TEST_ID_DETAILS,
    ];
    const editButton = await findAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
    fireEvent.click(editButton[0]);
    testIds.map(async (item) => expect(await findByTestId(item)).toBeDisabled());
});
test("shouldn´t revert a depo if the file is invalid", async () => {
    const { startDate } = TEST_CONSTANTS.EXPECTED_REACTIVATED_TO_PENDING_DEPO_BODY;
    const fullDeposition = getDepositionWithOverrideValues({ startDate, status: "Canceled" });
    customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => fullDeposition);
    customDeps.apiService.revertCancelDeposition = jest.fn().mockImplementation(async () => {});
    const { findAllByTestId, findAllByText, findByTestId } = renderWithGlobalContext(
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
    await waitFor(async () => {
        const editButton = await findAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
        fireEvent.click(editButton[0]);
        const options = await findAllByText("Canceled");
        userEvent.click(options[2]);
        const confirmed = await findAllByText("Confirmed");
        userEvent.click(confirmed[1]);
        await wait(200);
        fireEvent.click(
            await (
                await findByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CAPTION_BUTTON_TEST_ID)
            ).childNodes[2]
        );
        const file = new File(["file"], "file.png", { type: "application/image" });
        await act(async () => {
            fireEvent.change(
                await findByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_UPLOAD_COMPONENT_DATA_TEST_ID),
                {
                    target: { files: [file] },
                }
            );
        });
        userEvent.click(await findByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CONFIRM_BUTTON_TEST_ID));
        expect(customDeps.apiService.revertCancelDeposition).not.toHaveBeenCalled();
    });
});

test("Redirects to post-depo is deposition status is completed", async () => {
    const fullDeposition = getDepositionWithOverrideValues({
        status: "Completed",
    });

    customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
        return fullDeposition;
    });
    customDeps.apiService.currentUser = jest.fn().mockResolvedValue(getUser1());
    const { queryByText } = renderWithGlobalContext(
        <Switch>
            <Route exact path={TEST_CONSTANTS.ACTIVE_DEPO_DETAILS_ROUTE} component={ActiveDepositionDetails} />
            <Route exact path={TEST_CONSTANTS.ACTIVE_POST_DEPO_DETAILS_ROUTE} component={POST_DEPO_DETAILS} />
        </Switch>,
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
        },
        history
    );
    history.push(TEST_CONSTANTS.ACTIVE_DEPO_DETAILS_ROUTE);
    await waitFor(() => expect(queryByText("POST-DEPO")).toBeInTheDocument());
});

import { fireEvent, waitForDomChange, waitForElement } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Amplify, Auth } from "aws-amplify";
import React from "react";
import { act } from "react-dom/test-utils";
import TEMP_TOKEN from "../../constants/ApiService";
import * as CONSTANTS from "../../constants/preJoinDepo";
import PreJoinDepo from "../../routes/PreJoinDepo";
import { AMPLIFY_CONFIG } from "../constants/login";
import * as TEST_CONSTANTS from "../constants/preJoinDepo";
import * as AUTH from "../mocks/Auth";
import getMockDeps from "../utils/getMockDeps";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";

Amplify.configure({
    Auth: AMPLIFY_CONFIG,
});

const deps = getMockDeps();
const mockHistoryPush = jest.fn();

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useParams: () => ({ depositionID: "depoId" }),
    useLocation: () => {},
    useHistory: () => ({
        push: mockHistoryPush,
    }),
    Redirect: jest.fn(({ to }) => `Redirected to ${to}`),
}));

let signalREventTriggered;

jest.mock("../../hooks/useSignalR", () => () => ({
    subscribeToGroup: (text, func) => {
        signalREventTriggered = func;
    },
    signalR: true,
}));

describe("it tests validations on the initial flow", () => {
    beforeEach(() => {
        AUTH.NOT_VALID();
    });
    test("should validate empty email input", async () => {
        const { getByTestId, getByText } = renderWithGlobalContext(<PreJoinDepo />);
        await waitForDomChange();
        fireEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        expect(getByText(CONSTANTS.EMPTY_EMAIL_MESSAGE)).toBeInTheDocument();
    });

    test("should validate invalid email input", async () => {
        const { getByTestId, getByText } = renderWithGlobalContext(<PreJoinDepo />);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_NAME } });
        fireEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        expect(getByText(CONSTANTS.INVALID_EMAIL_MESSAGE)).toBeInTheDocument();
    });

    test("toast should appear if userDepoStatus fetch fails", async () => {
        deps.apiService.checkUserDepoStatus = jest.fn().mockRejectedValue(new Error("error"));
        const { getByTestId, getByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        await waitForElement(() => getByText(CONSTANTS.NETWORK_ERROR));
    });
});

describe("It tests the non-registered and non-participant flow", () => {
    beforeEach(() => {
        AUTH.NOT_VALID();
        deps.apiService.checkUserDepoStatus = jest
            .fn()
            .mockResolvedValue(TEST_CONSTANTS.getUserDepoStatusWithoutParticipant(false));
    });

    test("should show step 2", async () => {
        const { getByTestId, getByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        expect(getByTestId(CONSTANTS.STEP_1_BUTTON_ID)).toBeDisabled();
        await waitForDomChange();
        await waitForElement(() => getByText(TEST_CONSTANTS.STEP_2_TEXT));
        expect(getByText(TEST_CONSTANTS.MOCKED_EMAIL)).toBeInTheDocument();
        expect(deps.apiService.checkUserDepoStatus).toHaveBeenCalledWith(
            TEST_CONSTANTS.DEPO_ID,
            TEST_CONSTANTS.MOCKED_EMAIL
        );
    });

    test("should validate name input", async () => {
        const { getByTestId, getByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        await waitForDomChange();
        expect(getByText(CONSTANTS.INVALID_NAME_MESSAGE)).toBeInTheDocument();
    });

    test("should validate role input", async () => {
        const { getByTestId, getByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        await waitForDomChange();
        expect(getByText(CONSTANTS.INVALID_ROLE_MESSAGE)).toBeInTheDocument();
    });

    test("should not display role validation message when a role is selected", async () => {
        const { getByTestId, getByText, getAllByText, queryByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        userEvent.click(getByText(CONSTANTS.ROLE_INPUT));
        const role = await waitForElement(() => getAllByText(TEST_CONSTANTS.ROLE));
        userEvent.click(role[1]);
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        expect(queryByText(CONSTANTS.INVALID_ROLE_MESSAGE)).toBeFalsy();
        await waitForDomChange();
    });

    test("should not display name validation message if a name is entered", async () => {
        const { getByTestId, queryByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.NAME_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_NAME } });
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        expect(queryByText(CONSTANTS.INVALID_NAME_MESSAGE)).toBeFalsy();
        await waitForDomChange();
    });

    test("should go back to the previous step when clicking the button", async () => {
        const { getByTestId, getByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        userEvent.click(getByTestId(CONSTANTS.BACK_BUTTON_ID));
        await waitForDomChange();
        expect(getByText(TEST_CONSTANTS.STEP_1_TEXT)).toBeInTheDocument();
    });

    test("should display message when registerParticipant service fails", async () => {
        deps.apiService.registerGuestDepoParticipant = jest.fn().mockRejectedValue(new Error(""));
        const { getByTestId, getByText, getAllByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.NAME_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_NAME } });
        userEvent.click(getByText(CONSTANTS.ROLE_INPUT));
        const role = await waitForElement(() => getAllByText(TEST_CONSTANTS.ROLE));
        userEvent.click(role[1]);
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        await waitForDomChange();
        await waitForElement(() => getAllByText(CONSTANTS.NETWORK_ERROR));
    });

    test("should display witness error message if guestDepoParticipant endpoint returns a 400", async () => {
        deps.apiService.registerGuestDepoParticipant = jest.fn().mockRejectedValue(400);
        const { getByTestId, getByText, getAllByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.NAME_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_NAME } });
        userEvent.click(getByText(CONSTANTS.ROLE_INPUT));
        const role = await waitForElement(() => getAllByText(TEST_CONSTANTS.ROLE));
        userEvent.click(role[1]);
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        await waitForDomChange();
        expect(getByText(CONSTANTS.WITNESS_ALREADY_PRESENT_ERROR)).toBeInTheDocument();
    });

    test("should display WaitingRoom and set token", async () => {
        deps.apiService.registerGuestDepoParticipant = jest.fn().mockResolvedValue({ idToken: TEST_CONSTANTS.TOKEN });
        const { getByTestId, getByText, getAllByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.NAME_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_NAME } });
        userEvent.click(getByText(CONSTANTS.ROLE_INPUT));
        const role = await waitForElement(() => getAllByText(TEST_CONSTANTS.ROLE));
        userEvent.click(role[1]);
        const step2 = await waitForElement(() => getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        userEvent.click(step2);
        expect(step2).toBeDisabled();
        expect(getByTestId(CONSTANTS.BACK_BUTTON_ID)).toBeDisabled();
        expect(deps.apiService.registerGuestDepoParticipant).toHaveBeenCalledWith(TEST_CONSTANTS.DEPO_ID, {
            emailAddress: TEST_CONSTANTS.MOCKED_EMAIL,
            name: TEST_CONSTANTS.MOCKED_NAME,
            participantType: TEST_CONSTANTS.ROLE,
        });
        await waitForDomChange();
        expect(getByText(CONSTANTS.WAITING_ROOM_SUBTITLE)).toBeInTheDocument();
        expect(localStorage.getItem(TEMP_TOKEN)).toEqual(TEST_CONSTANTS.TOKEN);
    });

    test("should display WaitingRoom and show deny text when is not admitted", async () => {
        deps.apiService.registerGuestDepoParticipant = jest.fn().mockResolvedValue({ idToken: TEST_CONSTANTS.TOKEN });
        const { getByTestId, getByText, getAllByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.NAME_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_NAME } });
        userEvent.click(getByText(CONSTANTS.ROLE_INPUT));
        const role = await waitForElement(() => getAllByText(TEST_CONSTANTS.ROLE));
        userEvent.click(role[1]);
        const step2 = await waitForElement(() => getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        userEvent.click(step2);
        await waitForDomChange();
        act(() => {
            signalREventTriggered({
                entityType: "joinResponse",
                content: { isAdmitted: false },
            });
        });
        const denyText = await waitForElement(() => getByText(CONSTANTS.ACCESS_DENIED_TITLE));
        expect(denyText).toBeInTheDocument();
    });
    test("should display WaitingRoom and redirect to indepo when admitted", async () => {
        deps.apiService.registerGuestDepoParticipant = jest.fn().mockResolvedValue({ idToken: TEST_CONSTANTS.TOKEN });
        const { getByTestId, getByText, getAllByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.NAME_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_NAME } });
        userEvent.click(getByText(CONSTANTS.ROLE_INPUT));
        const role = await waitForElement(() => getAllByText(TEST_CONSTANTS.ROLE));
        userEvent.click(role[1]);
        const step2 = await waitForElement(() => getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        userEvent.click(step2);
        await waitForDomChange();
        act(() => {
            signalREventTriggered({
                entityType: "joinResponse",
                content: { isAdmitted: true },
            });
        });
        expect(getByText(`Redirected to ${CONSTANTS.DEPOSITION_ROUTE}${TEST_CONSTANTS.DEPO_ID}`)).toBeInTheDocument();
    });
});

describe("It tests the non-registered and participant flow", () => {
    beforeEach(() => {
        AUTH.NOT_VALID();
        deps.apiService.checkUserDepoStatus = jest
            .fn()
            .mockResolvedValue(TEST_CONSTANTS.getUserDepoStatusWithParticipantNotAdmitted(false));
    });

    test("should preload name, role shouldn´t be editable but name should be editable", async () => {
        deps.apiService.registerGuestDepoParticipant = jest.fn().mockResolvedValue({ idToken: TEST_CONSTANTS.TOKEN });
        const { getByTestId, getByText, getByDisplayValue, queryByTestId } = renderWithGlobalContext(
            <PreJoinDepo />,
            deps
        );
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        expect(getByText(TEST_CONSTANTS.MOCKED_EMAIL)).toBeInTheDocument();
        expect(getByDisplayValue(TEST_CONSTANTS.PARTICIPANT_MOCK_NAME)).toBeInTheDocument();
        expect(getByText(TEST_CONSTANTS.PARTICIPANT_MOCK_ROLE)).toBeInTheDocument();
        expect(queryByTestId(CONSTANTS.ENABLED_ROLE_INPUT_ID)).toBeFalsy();
        expect(getByTestId(CONSTANTS.DISABLED_ROLE_INPUT_ID)).toBeInTheDocument();
        expect(getByTestId(CONSTANTS.NAME_INPUT_ID)).not.toBeDisabled();
    });

    test("should go back to the previous step when clicking the button", async () => {
        const { getByTestId, getByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        userEvent.click(getByTestId(CONSTANTS.BACK_BUTTON_ID));
        await waitForDomChange();
        expect(getByText(TEST_CONSTANTS.STEP_1_TEXT)).toBeInTheDocument();
    });

    test("should display message when registerParticipant service fails", async () => {
        deps.apiService.registerGuestDepoParticipant = jest.fn().mockRejectedValue(new Error(""));
        const { getByTestId, getAllByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        await waitForDomChange();
        await waitForElement(() => getAllByText(CONSTANTS.NETWORK_ERROR));
    });

    test("should display WaitingRoom and set token", async () => {
        deps.apiService.registerGuestDepoParticipant = jest.fn().mockResolvedValue({ idToken: TEST_CONSTANTS.TOKEN });
        const { getByText, getByTestId } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        expect(getByTestId(CONSTANTS.STEP_2_BUTTON_ID)).toBeDisabled();
        expect(getByTestId(CONSTANTS.BACK_BUTTON_ID)).toBeDisabled();
        expect(deps.apiService.registerGuestDepoParticipant).toHaveBeenCalledWith(TEST_CONSTANTS.DEPO_ID, {
            emailAddress: TEST_CONSTANTS.MOCKED_EMAIL,
            name: TEST_CONSTANTS.PARTICIPANT_MOCK_NAME,
            participantType: TEST_CONSTANTS.PARTICIPANT_MOCK_ROLE,
        });
        await waitForDomChange();
        expect(getByText(CONSTANTS.WAITING_ROOM_SUBTITLE)).toBeInTheDocument();
        expect(localStorage.getItem(TEMP_TOKEN)).toEqual(TEST_CONSTANTS.TOKEN);
    });
    test("should display WaitingRoom and show deny text when is not admitted", async () => {
        deps.apiService.registerGuestDepoParticipant = jest.fn().mockResolvedValue({ idToken: TEST_CONSTANTS.TOKEN });
        const { getByText, getByTestId } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        await waitForDomChange();
        act(() => {
            signalREventTriggered({
                entityType: "joinResponse",
                content: { isAdmitted: false },
            });
        });
        const denyText = await waitForElement(() => getByText(CONSTANTS.ACCESS_DENIED_TITLE));
        expect(denyText).toBeInTheDocument();
    });
    test("should display WaitingRoom and redirect to indepo when admitted", async () => {
        deps.apiService.registerGuestDepoParticipant = jest.fn().mockResolvedValue({ idToken: TEST_CONSTANTS.TOKEN });
        const { getByText, getByTestId } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        await waitForDomChange();
        act(() => {
            signalREventTriggered({
                entityType: "joinResponse",
                content: { isAdmitted: true },
            });
        });
        expect(getByText(`Redirected to ${CONSTANTS.DEPOSITION_ROUTE}${TEST_CONSTANTS.DEPO_ID}`)).toBeInTheDocument();
    });
});

describe("It tests the registered and not logged in user and non-participant flow", () => {
    beforeEach(() => {
        AUTH.NOT_VALID();
        AUTH.SUCCESSFUL_SIGN_IN();
        deps.apiService.checkUserDepoStatus = jest
            .fn()
            .mockResolvedValue(TEST_CONSTANTS.getUserDepoStatusWithoutParticipant(true));
    });
    test("should show error toast if signIn method fails", async () => {
        AUTH.REJECTED_SIGN_IN();
        const { getByTestId, getByText, getAllByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        userEvent.click(getByText(CONSTANTS.ROLE_INPUT));
        const role = await waitForElement(() => getAllByText(TEST_CONSTANTS.ROLE));
        userEvent.click(role[1]);
        fireEvent.change(getByTestId(CONSTANTS.PASSWORD_INPUT_ID), {
            target: { value: TEST_CONSTANTS.MOCKED_PASSWORD },
        });
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        await waitForDomChange();
        await waitForElement(() => getByText(TEST_CONSTANTS.SIGN_IN_ERROR));
    });
    test("should show toast when checkUserDepoStatus fails", async () => {
        deps.apiService.checkUserDepoStatus = jest.fn().mockRejectedValue(Error(""));
        const { getByTestId, getByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForElement(() => getByText(CONSTANTS.NETWORK_ERROR));
    });

    test("should show error toast if Add Participant fetch fails", async () => {
        deps.apiService.addDepoParticipant = jest.fn().mockRejectedValue(Error("Error"));
        const { getByTestId, getByText, getAllByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        userEvent.click(getByText(CONSTANTS.ROLE_INPUT));
        const role = await waitForElement(() => getAllByText(TEST_CONSTANTS.ROLE));
        userEvent.click(role[1]);

        fireEvent.change(getByTestId(CONSTANTS.PASSWORD_INPUT_ID), {
            target: { value: TEST_CONSTANTS.MOCKED_PASSWORD },
        });
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        await waitForDomChange();
        await waitForElement(() => getByText(CONSTANTS.NETWORK_ERROR));
    });
    test("should display witness error message if addDepoParticipant endpoint returns a 400", async () => {
        deps.apiService.addDepoParticipant = jest.fn().mockRejectedValue(400);
        const { getByTestId, getByText, getAllByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        userEvent.click(getByText(CONSTANTS.ROLE_INPUT));
        const role = await waitForElement(() => getAllByText(TEST_CONSTANTS.ROLE));
        userEvent.click(role[1]);

        fireEvent.change(getByTestId(CONSTANTS.PASSWORD_INPUT_ID), {
            target: { value: TEST_CONSTANTS.MOCKED_PASSWORD },
        });
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        await waitForDomChange();
        await waitForElement(() => getByText(CONSTANTS.WITNESS_ALREADY_PRESENT_ERROR));
    });
    test("should show step 1, should not show logged user´s email", async () => {
        const { queryByText, queryByTestId } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        expect(queryByText(TEST_CONSTANTS.LOGGED_USER_EMAIL)).toBeFalsy();
        expect(queryByTestId(CONSTANTS.EMAIL_INPUT_ID)).toBeTruthy();
        expect(deps.apiService.checkUserDepoStatus).toHaveBeenCalledTimes(0);
    });
    test("should show step 2, and the proper inputs", async () => {
        const { getByTestId, getByText, queryByTestId } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        fireEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        expect(getByText(TEST_CONSTANTS.STEP_2_TEXT)).toBeTruthy();
        expect(getByText(TEST_CONSTANTS.MOCKED_EMAIL)).toBeTruthy();
        expect(queryByTestId(CONSTANTS.NAME_INPUT_ID)).toBeFalsy();
        expect(getByTestId(CONSTANTS.BACK_BUTTON_ID)).toBeInTheDocument();
        expect(getByTestId(CONSTANTS.PASSWORD_INPUT_ID)).toBeInTheDocument();
        expect(getByTestId(CONSTANTS.ENABLED_ROLE_INPUT_ID)).toBeInTheDocument();
        expect(deps.apiService.checkUserDepoStatus).toHaveBeenCalled();
    });

    test("should go back when clicking the button", async () => {
        const { getByTestId } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        userEvent.click(getByTestId(CONSTANTS.BACK_BUTTON_ID));
        expect(getByTestId(CONSTANTS.STEP_1_BUTTON_ID)).toBeInTheDocument();
    });
    test("should call all services with the proper params and display WaitingRoom", async () => {
        deps.apiService.addDepoParticipant = jest.fn().mockResolvedValue(true);
        const { getByTestId, getByText, getAllByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        userEvent.click(getByText(CONSTANTS.ROLE_INPUT));
        const role = await waitForElement(() => getAllByText(TEST_CONSTANTS.ROLE));
        userEvent.click(role[1]);
        fireEvent.change(getByTestId(CONSTANTS.PASSWORD_INPUT_ID), {
            target: { value: TEST_CONSTANTS.MOCKED_PASSWORD },
        });
        const step2 = await waitForElement(() => getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        userEvent.click(step2);
        await waitForDomChange();
        expect(deps.apiService.addDepoParticipant).toHaveBeenCalledWith(TEST_CONSTANTS.DEPO_ID, {
            emailAddress: TEST_CONSTANTS.MOCKED_EMAIL,
            participantType: TEST_CONSTANTS.ROLE,
        });
        expect(Auth.signIn).toHaveBeenCalledWith(TEST_CONSTANTS.MOCKED_EMAIL, TEST_CONSTANTS.MOCKED_PASSWORD);
        expect(getByText(CONSTANTS.WAITING_ROOM_SUBTITLE)).toBeInTheDocument();
    });

    test("should validate all inputs", async () => {
        const { getByTestId, getByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        expect(getByText(CONSTANTS.EMPTY_EMAIL_MESSAGE)).toBeInTheDocument();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        await waitForDomChange();
        expect(getByText(CONSTANTS.INVALID_PASSWORD_MESSAGE)).toBeInTheDocument();
        expect(getByText(CONSTANTS.INVALID_ROLE_MESSAGE)).toBeInTheDocument();
    });
    test("should display WaitingRoom and show deny text when is not admitted", async () => {
        deps.apiService.addDepoParticipant = jest.fn().mockResolvedValue(true);
        const { getByTestId, getByText, getAllByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        userEvent.click(getByText(CONSTANTS.ROLE_INPUT));
        const role = await waitForElement(() => getAllByText(TEST_CONSTANTS.ROLE));
        userEvent.click(role[1]);
        fireEvent.change(getByTestId(CONSTANTS.PASSWORD_INPUT_ID), {
            target: { value: TEST_CONSTANTS.MOCKED_PASSWORD },
        });
        const step2 = await waitForElement(() => getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        userEvent.click(step2);
        await waitForDomChange();
        act(() => {
            signalREventTriggered({
                entityType: "joinResponse",
                content: { isAdmitted: false },
            });
        });
        const denyText = await waitForElement(() => getByText(CONSTANTS.ACCESS_DENIED_TITLE));
        expect(denyText).toBeInTheDocument();
    });
    test("should display WaitingRoom and redirect to indepo when admitted", async () => {
        deps.apiService.addDepoParticipant = jest.fn().mockResolvedValue(true);
        const { getByTestId, getByText, getAllByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        userEvent.click(getByText(CONSTANTS.ROLE_INPUT));
        const role = await waitForElement(() => getAllByText(TEST_CONSTANTS.ROLE));
        userEvent.click(role[1]);
        fireEvent.change(getByTestId(CONSTANTS.PASSWORD_INPUT_ID), {
            target: { value: TEST_CONSTANTS.MOCKED_PASSWORD },
        });
        const step2 = await waitForElement(() => getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        userEvent.click(step2);
        await waitForDomChange();
        act(() => {
            signalREventTriggered({
                entityType: "joinResponse",
                content: { isAdmitted: true },
            });
        });
        expect(getByText(`Redirected to ${CONSTANTS.DEPOSITION_ROUTE}${TEST_CONSTANTS.DEPO_ID}`)).toBeInTheDocument();
    });
});

describe("It tests the registered and logged in user and non-participant flow", () => {
    beforeEach(() => {
        AUTH.VALID();
        deps.apiService.checkUserDepoStatus = jest
            .fn()
            .mockResolvedValue(TEST_CONSTANTS.getUserDepoStatusWithoutParticipant(true));
    });
    test("should show error toast if Add Participant fetch fails", async () => {
        deps.apiService.addDepoParticipant = jest.fn().mockRejectedValue(Error("Error"));
        const { getByText, getAllByText, getByTestId } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        userEvent.click(getByText(CONSTANTS.ROLE_INPUT));
        const role = await waitForElement(() => getAllByText(TEST_CONSTANTS.ROLE));
        userEvent.click(role[1]);
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        await waitForElement(() => getByText(CONSTANTS.NETWORK_ERROR));
    });
    test("should show spinner and show error screen if userStatus fetch fails", async () => {
        deps.apiService.checkUserDepoStatus = jest.fn().mockRejectedValue(Error("Error"));
        const { getByTestId, getByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        expect(getByTestId("spinner")).toBeInTheDocument();
        await waitForDomChange();
        expect(getByText(CONSTANTS.FETCH_ERROR_RESULT_TITLE)).toBeInTheDocument();
        expect(getByText(CONSTANTS.FETCH_ERROR_RESULT_BODY)).toBeInTheDocument();
        expect(getByText(CONSTANTS.FETCH_ERROR_RESULT_BUTTON)).toBeInTheDocument();
        fireEvent.click(getByTestId("error_screen_button"));
        expect(deps.apiService.checkUserDepoStatus).toHaveBeenCalledTimes(2);
        await waitForDomChange();
    });

    test("should not show step text and back button, should show logged user´s email and there should only be a role input", async () => {
        const { getByTestId, queryByText, queryByTestId, getByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        expect(getByText(TEST_CONSTANTS.LOGGED_USER_EMAIL)).toBeInTheDocument();
        expect(queryByText(CONSTANTS.BACK_BUTTON_ID)).toBeFalsy();
        expect(queryByText(TEST_CONSTANTS.STEP_1_TEXT)).toBeFalsy();
        expect(queryByText(TEST_CONSTANTS.STEP_2_TEXT)).toBeFalsy();
        expect(getByTestId(CONSTANTS.ENABLED_ROLE_INPUT_ID)).toBeInTheDocument();
        expect(queryByTestId(CONSTANTS.PASSWORD_INPUT_ID)).toBeFalsy();
        expect(queryByTestId(CONSTANTS.EMAIL_INPUT_ID)).toBeFalsy();
        expect(queryByTestId(CONSTANTS.NAME_INPUT_ID)).toBeFalsy();
    });

    test("should validate role input", async () => {
        const { getByTestId, getByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        expect(getByText(CONSTANTS.INVALID_ROLE_MESSAGE)).toBeInTheDocument();
        await waitForDomChange();
    });
    test("should call add participant and history with the right parameters and display waiting room", async () => {
        deps.apiService.addDepoParticipant = jest.fn().mockResolvedValue(true);
        const { getByText, getAllByText, getByTestId } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        userEvent.click(getByText(CONSTANTS.ROLE_INPUT));
        const role = await waitForElement(() => getAllByText(TEST_CONSTANTS.ROLE));
        userEvent.click(role[1]);
        await waitForDomChange();
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        await waitForDomChange();
        expect(deps.apiService.addDepoParticipant).toHaveBeenCalledWith(TEST_CONSTANTS.DEPO_ID, {
            emailAddress: TEST_CONSTANTS.LOGGED_USER_EMAIL,
            participantType: TEST_CONSTANTS.ROLE,
        });
        expect(getByText(CONSTANTS.WAITING_ROOM_SUBTITLE)).toBeInTheDocument();
    });
    test("should display WaitingRoom and show deny text when is not admitted", async () => {
        deps.apiService.addDepoParticipant = jest.fn().mockResolvedValue(true);
        const { getByText, getAllByText, getByTestId } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        userEvent.click(getByText(CONSTANTS.ROLE_INPUT));
        const role = await waitForElement(() => getAllByText(TEST_CONSTANTS.ROLE));
        userEvent.click(role[1]);
        const step2 = await waitForElement(() => getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        userEvent.click(step2);
        await waitForDomChange();
        act(() => {
            signalREventTriggered({
                entityType: "joinResponse",
                content: { isAdmitted: false },
            });
        });
        const denyText = await waitForElement(() => getByText(CONSTANTS.ACCESS_DENIED_TITLE));
        expect(denyText).toBeInTheDocument();
    });
    test("should display WaitingRoom and redirect to indepo when admitted", async () => {
        deps.apiService.addDepoParticipant = jest.fn().mockResolvedValue(true);
        const { getByText, getAllByText, getByTestId } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        userEvent.click(getByText(CONSTANTS.ROLE_INPUT));
        const role = await waitForElement(() => getAllByText(TEST_CONSTANTS.ROLE));
        userEvent.click(role[1]);
        const step2 = await waitForElement(() => getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        userEvent.click(step2);
        await waitForDomChange();
        act(() => {
            signalREventTriggered({
                entityType: "joinResponse",
                content: { isAdmitted: true },
            });
        });
        expect(getByText(`Redirected to ${CONSTANTS.DEPOSITION_ROUTE}${TEST_CONSTANTS.DEPO_ID}`)).toBeInTheDocument();
    });
});

describe("It tests the registered and logged in user and participant flow", () => {
    beforeEach(() => {
        AUTH.VALID();
        deps.apiService.checkUserDepoStatus = jest
            .fn()
            .mockResolvedValue(TEST_CONSTANTS.getUserDepoStatusWithParticipantAdmitted(true));
    });

    test("should show spinner and show error screen if userStatus fetch fails", async () => {
        deps.apiService.checkUserDepoStatus = jest.fn().mockRejectedValue(Error("Error"));
        const { getByTestId, getByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        expect(getByTestId("spinner")).toBeInTheDocument();
        await waitForDomChange();
        expect(getByText(CONSTANTS.FETCH_ERROR_RESULT_TITLE)).toBeInTheDocument();
        expect(getByText(CONSTANTS.FETCH_ERROR_RESULT_BODY)).toBeInTheDocument();
        expect(getByText(CONSTANTS.FETCH_ERROR_RESULT_BUTTON)).toBeInTheDocument();
        fireEvent.click(getByTestId("error_screen_button"));
        expect(deps.apiService.checkUserDepoStatus).toHaveBeenCalledTimes(2);
        await waitForDomChange();
    });

    test("should redirect to deposition", async () => {
        const { getByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        expect(getByText(`Redirected to ${CONSTANTS.DEPOSITION_ROUTE}${TEST_CONSTANTS.DEPO_ID}`)).toBeInTheDocument();
    });
});

describe("It tests the registered and  not logged in user and participant flow", () => {
    beforeEach(() => {
        AUTH.NOT_VALID();
        AUTH.SUCCESSFUL_SIGN_IN();
        deps.apiService.checkUserDepoStatus = jest
            .fn()
            .mockResolvedValue(TEST_CONSTANTS.getUserDepoStatusWithParticipantAdmitted(true));
    });

    test("should show user´s email and there should only be a password input", async () => {
        const { getByTestId, queryByTestId, getByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        expect(getByText(TEST_CONSTANTS.MOCKED_EMAIL)).toBeInTheDocument();
        expect(queryByTestId(CONSTANTS.ENABLED_ROLE_INPUT_ID)).toBeFalsy();
        expect(getByTestId(CONSTANTS.PASSWORD_INPUT_ID)).toBeInTheDocument();
        expect(queryByTestId(CONSTANTS.EMAIL_INPUT_ID)).toBeFalsy();
        expect(queryByTestId(CONSTANTS.NAME_INPUT_ID)).toBeFalsy();
    });

    test("should validate password input", async () => {
        const { getByTestId, getByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        expect(getByText(CONSTANTS.INVALID_PASSWORD_MESSAGE)).toBeInTheDocument();
        await waitForDomChange();
    });
    test("should call services with the right params and redirect to depo", async () => {
        Auth.signIn = jest.fn().mockImplementation(() => AUTH.VALID());
        const { getByTestId, getByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.PASSWORD_INPUT_ID), {
            target: { value: TEST_CONSTANTS.MOCKED_PASSWORD },
        });
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        await waitForDomChange();
        expect(Auth.signIn).toHaveBeenCalledWith(TEST_CONSTANTS.MOCKED_EMAIL, TEST_CONSTANTS.MOCKED_PASSWORD);
        expect(getByText(`Redirected to ${CONSTANTS.DEPOSITION_ROUTE}${TEST_CONSTANTS.DEPO_ID}`)).toBeInTheDocument();
    });
    test("should show error toast if login service fails", async () => {
        AUTH.REJECTED_SIGN_IN();
        const { getByText, getByTestId } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.PASSWORD_INPUT_ID), {
            target: { value: TEST_CONSTANTS.MOCKED_PASSWORD },
        });
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        await waitForDomChange();
        await waitForElement(() => getByText(TEST_CONSTANTS.SIGN_IN_ERROR));
    });
});

describe("It tests the registered and  not logged in user and participant flow", () => {
    beforeEach(() => {
        AUTH.NOT_VALID();
        AUTH.SUCCESSFUL_SIGN_IN();
        deps.apiService.checkUserDepoStatus = jest
            .fn()
            .mockResolvedValue(TEST_CONSTANTS.getUserDepoStatusWithParticipantNotAdmitted(true));
    });

    test("should show user´s email and there should only be a password input", async () => {
        const { getByTestId, queryByTestId, getByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        expect(getByText(TEST_CONSTANTS.MOCKED_EMAIL)).toBeInTheDocument();
        expect(queryByTestId(CONSTANTS.ENABLED_ROLE_INPUT_ID)).toBeFalsy();
        expect(getByTestId(CONSTANTS.PASSWORD_INPUT_ID)).toBeInTheDocument();
        expect(queryByTestId(CONSTANTS.EMAIL_INPUT_ID)).toBeFalsy();
        expect(queryByTestId(CONSTANTS.NAME_INPUT_ID)).toBeFalsy();
    });

    test("should validate password input", async () => {
        const { getByTestId, getByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        expect(getByText(CONSTANTS.INVALID_PASSWORD_MESSAGE)).toBeInTheDocument();
        await waitForDomChange();
    });
    test("should call services with the right params and display waiting room", async () => {
        const { getByTestId, getByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.PASSWORD_INPUT_ID), {
            target: { value: TEST_CONSTANTS.MOCKED_PASSWORD },
        });
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        await waitForDomChange();
        expect(Auth.signIn).toHaveBeenCalledWith(TEST_CONSTANTS.MOCKED_EMAIL, TEST_CONSTANTS.MOCKED_PASSWORD);
        expect(getByText(CONSTANTS.WAITING_ROOM_SUBTITLE)).toBeInTheDocument();
    });
    test("should show error toast if login service fails", async () => {
        AUTH.REJECTED_SIGN_IN();
        const { getByText, getByTestId } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.PASSWORD_INPUT_ID), {
            target: { value: TEST_CONSTANTS.MOCKED_PASSWORD },
        });
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        await waitForDomChange();
        await waitForElement(() => getByText(TEST_CONSTANTS.SIGN_IN_ERROR));
    });
    test("should display WaitingRoom and show deny text when is not admitted", async () => {
        const { getByTestId, getByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.PASSWORD_INPUT_ID), {
            target: { value: TEST_CONSTANTS.MOCKED_PASSWORD },
        });
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        await waitForDomChange();

        act(() => {
            signalREventTriggered({
                entityType: "joinResponse",
                content: { isAdmitted: false },
            });
        });
        const denyText = await waitForElement(() => getByText(CONSTANTS.ACCESS_DENIED_TITLE));
        expect(denyText).toBeInTheDocument();
    });
    test("should display WaitingRoom and redirect to indepo when admitted", async () => {
        const { getByTestId, getByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.PASSWORD_INPUT_ID), {
            target: { value: TEST_CONSTANTS.MOCKED_PASSWORD },
        });
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        await waitForDomChange();

        act(() => {
            signalREventTriggered({
                entityType: "joinResponse",
                content: { isAdmitted: true },
            });
        });
        expect(getByText(`Redirected to ${CONSTANTS.DEPOSITION_ROUTE}${TEST_CONSTANTS.DEPO_ID}`)).toBeInTheDocument();
    });
});

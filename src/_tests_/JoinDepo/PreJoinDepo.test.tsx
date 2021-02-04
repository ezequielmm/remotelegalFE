import { fireEvent, waitForDomChange, waitForElement } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";
import { Amplify } from "aws-amplify";
import * as CONSTANTS from "../../constants/preJoinDepo";
import PreJoinDepo from "../../routes/PreJoinDepo";
import * as AUTH from "../mocks/Auth";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import getMockDeps from "../utils/getMockDeps";
import * as TEST_CONSTANTS from "../constants/preJoinDepo";
import TEMP_TOKEN from "../../constants/ApiService";
import { AMPLIFY_CONFIG } from "../constants/login";

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
}));

describe("it tests validations on the initial flow", () => {
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
        deps.apiService.checkUserDepoStatus = jest.fn().mockResolvedValue({ isUser: false, participant: null });
        AUTH.NOT_VALID();
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
        deps.apiService.registerDepoParticipant = jest.fn().mockRejectedValue(new Error(""));
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
        expect(getByText(CONSTANTS.NETWORK_ERROR)).toBeInTheDocument();
    });

    test("should redirect to InDepo page and set token", async () => {
        deps.apiService.registerDepoParticipant = jest.fn().mockResolvedValue({ idToken: TEST_CONSTANTS.TOKEN });
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
        expect(getByTestId(CONSTANTS.STEP_2_BUTTON_ID)).toBeDisabled();
        expect(getByTestId(CONSTANTS.BACK_BUTTON_ID)).toBeDisabled();
        expect(deps.apiService.registerDepoParticipant).toHaveBeenCalledWith(TEST_CONSTANTS.DEPO_ID, {
            emailAddress: TEST_CONSTANTS.MOCKED_EMAIL,
            name: TEST_CONSTANTS.MOCKED_NAME,
            participantType: TEST_CONSTANTS.ROLE,
        });
        await waitForDomChange();
        expect(mockHistoryPush).toHaveBeenCalledWith(`${CONSTANTS.DEPOSITION_ROUTE}${TEST_CONSTANTS.DEPO_ID}`);
        expect(localStorage.getItem(TEMP_TOKEN)).toEqual(TEST_CONSTANTS.TOKEN);
    });
});

describe("It tests the non-registered and participant flow", () => {
    beforeEach(() => {
        deps.apiService.checkUserDepoStatus = jest
            .fn()
            .mockResolvedValue({ isUser: false, participant: TEST_CONSTANTS.PARTICIPANT_MOCK });
        AUTH.NOT_VALID();
    });

    test("should preload name, role shouldn´t be editable but name should be editable", async () => {
        deps.apiService.registerDepoParticipant = jest.fn().mockResolvedValue({ idToken: TEST_CONSTANTS.TOKEN });
        const { getByTestId, getByText, getByDisplayValue, queryByTestId } = renderWithGlobalContext(
            <PreJoinDepo />,
            deps
        );
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        expect(getByText(TEST_CONSTANTS.MOCKED_EMAIL)).toBeInTheDocument();
        expect(getByDisplayValue(TEST_CONSTANTS.PARTICIPANT_MOCK.name)).toBeInTheDocument();
        expect(getByText(TEST_CONSTANTS.PARTICIPANT_MOCK.role)).toBeInTheDocument();
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
        deps.apiService.registerDepoParticipant = jest.fn().mockRejectedValue(new Error(""));
        const { getByTestId, getByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        await waitForDomChange();
        expect(getByText(CONSTANTS.NETWORK_ERROR)).toBeInTheDocument();
    });

    test("should redirect to InDepo page and set token", async () => {
        deps.apiService.registerDepoParticipant = jest.fn().mockResolvedValue({ idToken: TEST_CONSTANTS.TOKEN });
        const { getByTestId } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        expect(getByTestId(CONSTANTS.STEP_2_BUTTON_ID)).toBeDisabled();
        expect(getByTestId(CONSTANTS.BACK_BUTTON_ID)).toBeDisabled();
        expect(deps.apiService.registerDepoParticipant).toHaveBeenCalledWith(TEST_CONSTANTS.DEPO_ID, {
            emailAddress: TEST_CONSTANTS.MOCKED_EMAIL,
            name: TEST_CONSTANTS.PARTICIPANT_MOCK.name,
            participantType: TEST_CONSTANTS.PARTICIPANT_MOCK.role,
        });
        await waitForDomChange();
        expect(mockHistoryPush).toHaveBeenCalledWith(`${CONSTANTS.DEPOSITION_ROUTE}${TEST_CONSTANTS.DEPO_ID}`);
        expect(localStorage.getItem(TEMP_TOKEN)).toEqual(TEST_CONSTANTS.TOKEN);
    });
});

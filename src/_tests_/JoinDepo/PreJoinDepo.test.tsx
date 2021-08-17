import { fireEvent, waitFor, screen, waitForDomChange, waitForElement } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Amplify, Auth } from "aws-amplify";
import { Redirect } from "react-router";
import * as CONSTANTS from "../../constants/preJoinDepo";
import PreJoinDepo from "../../routes/PreJoinDepo";
import * as AUTH from "../mocks/Auth";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import getMockDeps from "../utils/getMockDeps";
import * as TEST_CONSTANTS from "../constants/preJoinDepo";
import TEMP_TOKEN from "../../constants/ApiService";
import { AMPLIFY_CONFIG } from "../constants/login";
import { wait } from "../../helpers/wait";

Amplify.configure({
    Auth: AMPLIFY_CONFIG,
});

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

describe("it tests validations on the initial flow", () => {
    let deps;
    beforeEach(() => {
        deps = getMockDeps();
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
        const { getByTestId, getAllByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        await waitForElement(() => getAllByText(CONSTANTS.NETWORK_ERROR));
    });

    test("toast should appear only once if userDepoStatus fetch fails, even though the user continue clicking btn", async () => {
        deps.apiService.checkUserDepoStatus = jest.fn().mockRejectedValue(new Error("error"));
        renderWithGlobalContext(<PreJoinDepo />, deps);
        let button;
        await waitFor(() => {
            button = screen.getByTestId(CONSTANTS.STEP_1_BUTTON_ID);
        });
        fireEvent.change(screen.getByTestId(CONSTANTS.EMAIL_INPUT_ID), {
            target: { value: TEST_CONSTANTS.MOCKED_EMAIL },
        });
        fireEvent.click(button);
        await wait(0);
        fireEvent.click(button);
        await wait(0);
        fireEvent.click(button);
        await waitFor(() => {
            expect(screen.getAllByText(CONSTANTS.NETWORK_ERROR)).toHaveLength(1);
        });
    });
});

describe("It tests the non-registered and non-participant flow", () => {
    let deps;
    beforeEach(() => {
        deps = getMockDeps();
        AUTH.NOT_VALID();
        deps.apiService.checkUserDepoStatus = jest.fn().mockResolvedValue({ isUser: false, participant: null });
    });
    test("step 2 links redirect somewhere", async () => {
        const mappedLinks = TEST_CONSTANTS.getMappedFrontEndContent();
        const { getByTestId, getByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        await waitForElement(() => getByText(TEST_CONSTANTS.STEP_2_TEXT));
        const TermsOfUseLink = getByTestId(CONSTANTS.PREJOIN_AGREE_LINK_BUTTON_ID);
        expect(TermsOfUseLink.href).toBe(mappedLinks[CONSTANTS.PREJOIN_TERMS_OF_USE_KEY].url);

        const CertifyLinkButton = getByTestId(CONSTANTS.PREJOIN_CERTIFY_INFORMATION_LINK_BUTTON_ID);
        expect(CertifyLinkButton.href).toBe(mappedLinks[CONSTANTS.PREJOIN_CERTIFICATION_KEY].url);
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
        userEvent.click(getByTestId(CONSTANTS.PREJOIN_CERTIFY_INFORMATION_TEXT_TEST_ID));
        userEvent.click(getByTestId(CONSTANTS.PREJOIN_AGREE_TERMS_AND_CONDITION_TEXT_TEST_ID));
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
        userEvent.click(getByTestId(CONSTANTS.PREJOIN_CERTIFY_INFORMATION_TEXT_TEST_ID));
        userEvent.click(getByTestId(CONSTANTS.PREJOIN_AGREE_TERMS_AND_CONDITION_TEXT_TEST_ID));
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
        userEvent.click(getByTestId(CONSTANTS.PREJOIN_CERTIFY_INFORMATION_TEXT_TEST_ID));
        userEvent.click(getByTestId(CONSTANTS.PREJOIN_AGREE_TERMS_AND_CONDITION_TEXT_TEST_ID));
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
        userEvent.click(getByTestId(CONSTANTS.PREJOIN_CERTIFY_INFORMATION_TEXT_TEST_ID));
        userEvent.click(getByTestId(CONSTANTS.PREJOIN_AGREE_TERMS_AND_CONDITION_TEXT_TEST_ID));
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        expect(queryByText(CONSTANTS.INVALID_NAME_MESSAGE)).toBeFalsy();
        await waitForDomChange();
    });

    test("should go back to the previous step when clicking the button", async () => {
        const { getByTestId, getByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        const backButton = await waitForElement(() => getByTestId(CONSTANTS.BACK_BUTTON_ID));
        userEvent.click(backButton);
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
        userEvent.click(getByTestId(CONSTANTS.PREJOIN_CERTIFY_INFORMATION_TEXT_TEST_ID));
        userEvent.click(getByTestId(CONSTANTS.PREJOIN_AGREE_TERMS_AND_CONDITION_TEXT_TEST_ID));
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
        userEvent.click(getByTestId(CONSTANTS.PREJOIN_CERTIFY_INFORMATION_TEXT_TEST_ID));
        userEvent.click(getByTestId(CONSTANTS.PREJOIN_AGREE_TERMS_AND_CONDITION_TEXT_TEST_ID));
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        await waitForDomChange();
        expect(getByText(CONSTANTS.WITNESS_ALREADY_PRESENT_ERROR)).toBeInTheDocument();
    });

    test("should redirect to InDepo page and set token", async () => {
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
        userEvent.click(getByTestId(CONSTANTS.PREJOIN_CERTIFY_INFORMATION_TEXT_TEST_ID));
        userEvent.click(getByTestId(CONSTANTS.PREJOIN_AGREE_TERMS_AND_CONDITION_TEXT_TEST_ID));
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        expect(getByTestId(CONSTANTS.STEP_2_BUTTON_ID)).toBeDisabled();
        expect(getByTestId(CONSTANTS.BACK_BUTTON_ID)).toBeDisabled();
        expect(deps.apiService.registerGuestDepoParticipant).toHaveBeenCalledWith(TEST_CONSTANTS.DEPO_ID, {
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
    let deps;
    beforeEach(() => {
        deps = getMockDeps();
        AUTH.NOT_VALID();
        deps.apiService.checkUserDepoStatus = jest
            .fn()
            .mockResolvedValue({ isUser: false, participant: TEST_CONSTANTS.PARTICIPANT_MOCK });
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
        const backButton = await waitForElement(() => getByTestId(CONSTANTS.BACK_BUTTON_ID));
        userEvent.click(backButton);
        expect(getByText(TEST_CONSTANTS.STEP_1_TEXT)).toBeInTheDocument();
    });

    test("should display message when registerParticipant service fails", async () => {
        deps.apiService.registerGuestDepoParticipant = jest.fn().mockRejectedValue(new Error(""));
        const { getByTestId, getAllByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        userEvent.click(getByTestId(CONSTANTS.PREJOIN_CERTIFY_INFORMATION_TEXT_TEST_ID));
        userEvent.click(getByTestId(CONSTANTS.PREJOIN_AGREE_TERMS_AND_CONDITION_TEXT_TEST_ID));
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        await waitForDomChange();
        await waitForElement(() => getAllByText(CONSTANTS.NETWORK_ERROR));
    });

    test("should redirect to InDepo page and set token", async () => {
        deps.apiService.registerGuestDepoParticipant = jest.fn().mockResolvedValue({ idToken: TEST_CONSTANTS.TOKEN });
        const { getByTestId } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        userEvent.click(getByTestId(CONSTANTS.PREJOIN_CERTIFY_INFORMATION_TEXT_TEST_ID));
        userEvent.click(getByTestId(CONSTANTS.PREJOIN_AGREE_TERMS_AND_CONDITION_TEXT_TEST_ID));
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        expect(getByTestId(CONSTANTS.STEP_2_BUTTON_ID)).toBeDisabled();
        expect(getByTestId(CONSTANTS.BACK_BUTTON_ID)).toBeDisabled();
        expect(deps.apiService.registerGuestDepoParticipant).toHaveBeenCalledWith(TEST_CONSTANTS.DEPO_ID, {
            emailAddress: TEST_CONSTANTS.MOCKED_EMAIL,
            name: TEST_CONSTANTS.PARTICIPANT_MOCK.name,
            participantType: TEST_CONSTANTS.PARTICIPANT_MOCK.role,
        });
        await waitForDomChange();
        expect(mockHistoryPush).toHaveBeenCalledWith(`${CONSTANTS.DEPOSITION_ROUTE}${TEST_CONSTANTS.DEPO_ID}`);
        expect(localStorage.getItem(TEMP_TOKEN)).toEqual(TEST_CONSTANTS.TOKEN);
    });
});

describe("It tests the registered and not logged in user and non-participant flow", () => {
    let deps;
    beforeEach(() => {
        deps = getMockDeps();
        AUTH.NOT_VALID();
        AUTH.SUCCESSFUL_SIGN_IN();
        deps.apiService.checkUserDepoStatus = jest.fn().mockResolvedValue({ isUser: true, participant: null });
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
        const { getByTestId, getAllByText } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForElement(() => getAllByText(CONSTANTS.NETWORK_ERROR));
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
        await waitForElement(() => getAllByText(CONSTANTS.NETWORK_ERROR));
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
    test("should call all services with the proper params", async () => {
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
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        await waitForDomChange();
        expect(deps.apiService.addDepoParticipant).toHaveBeenCalledWith(TEST_CONSTANTS.DEPO_ID, {
            emailAddress: TEST_CONSTANTS.MOCKED_EMAIL,
            participantType: TEST_CONSTANTS.ROLE,
        });
        expect(Auth.signIn).toHaveBeenCalledWith(TEST_CONSTANTS.MOCKED_EMAIL, TEST_CONSTANTS.MOCKED_PASSWORD);
        expect(mockHistoryPush).toHaveBeenCalledWith(`${CONSTANTS.DEPOSITION_ROUTE}${TEST_CONSTANTS.DEPO_ID}`);
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
});

describe("It tests the registered and logged in user and non-participant flow", () => {
    let deps;
    beforeEach(() => {
        deps = getMockDeps();
        AUTH.VALID();
        deps.apiService.checkUserDepoStatus = jest.fn().mockResolvedValue({ isUser: true, participant: null });
    });
    test("should show error toast if Add Participant fetch fails", async () => {
        deps.apiService.addDepoParticipant = jest.fn().mockRejectedValue(Error("Error"));
        const { getByText, getAllByText, getByTestId } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        userEvent.click(getByText(CONSTANTS.ROLE_INPUT));
        const role = await waitForElement(() => getAllByText(TEST_CONSTANTS.ROLE));
        userEvent.click(role[1]);
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        await waitForElement(() => getAllByText(CONSTANTS.NETWORK_ERROR));
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
    test("should call add participant and history with the right parameters", async () => {
        deps.apiService.addDepoParticipant = jest.fn().mockResolvedValue(true);
        const { getByText, getAllByText, getByTestId } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitFor(() => getByText(CONSTANTS.ROLE_INPUT));
        userEvent.click(getByText(CONSTANTS.ROLE_INPUT));
        const role = await waitFor(() => getAllByText(TEST_CONSTANTS.ROLE));
        userEvent.click(role[1]);
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        await waitFor(() => {
            expect(deps.apiService.addDepoParticipant).toHaveBeenCalledWith(TEST_CONSTANTS.DEPO_ID, {
                emailAddress: TEST_CONSTANTS.LOGGED_USER_EMAIL,
                participantType: TEST_CONSTANTS.ROLE,
            });
            expect(mockHistoryPush).toHaveBeenCalledWith(`${CONSTANTS.DEPOSITION_ROUTE}${TEST_CONSTANTS.DEPO_ID}`);
        });
    });
});

describe("It tests the registered and logged in user and participant flow", () => {
    let deps;
    beforeEach(() => {
        deps = getMockDeps();
        AUTH.VALID();
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
        deps.apiService.checkUserDepoStatus = jest
            .fn()
            .mockResolvedValue({ isUser: true, participant: { isAdmitted: true } });
        renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        expect(Redirect).toHaveBeenCalledWith({ to: "/deposition/pre-join/troubleshoot-devices/depoId" }, {});
    });
});

describe("It tests the registered and  not logged in user and participant flow", () => {
    let deps;
    beforeEach(() => {
        deps = getMockDeps();
        AUTH.NOT_VALID();
        AUTH.SUCCESSFUL_SIGN_IN();
        deps.apiService.checkUserDepoStatus = jest
            .fn()
            .mockResolvedValue({ isUser: true, participant: { isAdmitted: true, role: "Attorney" } });
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
    test("should call services with the right params", async () => {
        const { getByTestId } = renderWithGlobalContext(<PreJoinDepo />, deps);
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
        expect(mockHistoryPush).toHaveBeenCalledWith(`${CONSTANTS.DEPOSITION_ROUTE}${TEST_CONSTANTS.DEPO_ID}`);
    });
    test("should show error toast if login service fails", async () => {
        AUTH.REJECTED_SIGN_IN();
        const { getAllByText, getByTestId } = renderWithGlobalContext(<PreJoinDepo />, deps);
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.EMAIL_INPUT_ID), { target: { value: TEST_CONSTANTS.MOCKED_EMAIL } });
        userEvent.click(getByTestId(CONSTANTS.STEP_1_BUTTON_ID));
        await waitForDomChange();
        fireEvent.change(getByTestId(CONSTANTS.PASSWORD_INPUT_ID), {
            target: { value: TEST_CONSTANTS.MOCKED_PASSWORD },
        });
        userEvent.click(getByTestId(CONSTANTS.STEP_2_BUTTON_ID));
        await waitForDomChange();
        await waitForElement(() => getAllByText(TEST_CONSTANTS.SIGN_IN_ERROR));
    });
});

/* eslint-disable no-await-in-loop */
import { fireEvent, waitForElement, waitForDomChange } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import moment from "moment-timezone";
import "mutationobserver-shim";
import React from "react";
import { act } from "react-dom/test-utils";
import * as TEST_CONSTANTS from "../constants/createDepositions";
import * as CONSTANTS from "../../constants/createDeposition";
import * as ADD_PARTICIPANTS_CONSTANTS from "../../constants/otherParticipants";
import CreateDeposition from "../../routes/CreateDeposition";
import * as CASE_TEST_CONSTANTS from "../constants/cases";
import * as ERRORS_CONSTANTS from "../../constants/errors";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import getMockDeps from "../utils/getMockDeps";
import { getUserNotAdmin } from "../constants/signUp";

global.MutationObserver = window.MutationObserver;
const customDeps = getMockDeps();

beforeEach(() => jest.resetModules());

it("Should show case selection validation if no case is selected", async () => {
    const { getByText, getByTestId } = renderWithGlobalContext(<CreateDeposition />);
    await waitForDomChange();
    fireEvent.click(getByTestId("create_deposition_button"));
    await waitForDomChange();
    expect(getByText(CONSTANTS.INVALID_CASE_MESSAGE)).toBeInTheDocument();
});
it("Should show case selection validation on blur", async () => {
    const { getByText, container } = renderWithGlobalContext(<CreateDeposition />);
    const caseSelect = await waitForElement(() => getByText(CONSTANTS.CASE_SELECT_PLACEHOLDER));
    act(() => {
        fireEvent.blur(caseSelect);
    });
    userEvent.click(container);
    await waitForDomChange();
    expect(getByText(CONSTANTS.INVALID_CASE_MESSAGE)).toBeInTheDocument();
});
it("Should show case modal", async () => {
    const { getByText, getByTestId } = renderWithGlobalContext(<CreateDeposition />);
    const caseSelect = await waitForElement(() => getByText(CONSTANTS.CASE_SELECT_PLACEHOLDER));
    act(() => {
        userEvent.click(caseSelect);
    });
    userEvent.click(getByTestId("new_case_button"));
    await waitForDomChange();
    expect(getByTestId("add_new_case_modal")).toBeInTheDocument();
});

it("Should show a toast when adding a new case", async () => {
    const { getByText, getByTestId, getByPlaceholderText } = renderWithGlobalContext(<CreateDeposition />);
    const caseSelect = await waitForElement(() => getByText(CONSTANTS.CASE_SELECT_PLACEHOLDER));
    act(() => {
        userEvent.click(caseSelect);
    });
    userEvent.click(getByTestId("new_case_button"));
    await waitForDomChange();

    fireEvent.change(getByPlaceholderText("Type case name"), {
        target: { value: CASE_TEST_CONSTANTS.getOneCase()[0].name },
    });
    fireEvent.click(getByTestId("Add case"));
    await waitForDomChange();
    expect(getByText("The case was successfully created!")).toBeInTheDocument();
});

it("Court Reporter shouldn´t appear again in the options once selected", async () => {
    const { getByTestId, getByText, getAllByText } = renderWithGlobalContext(<CreateDeposition />);
    const addParticipantButton = getByTestId("show_modal_add_participants_button");
    await act(async () => {
        userEvent.click(addParticipantButton);
    });
    await act(async () => {
        userEvent.click(await waitForElement(() => getByText(ADD_PARTICIPANTS_CONSTANTS.ROLE_PLACEHOLDER)));
        const courtReporterRole = await waitForElement(() => getByText(ADD_PARTICIPANTS_CONSTANTS.COURT_REPORTER_ROLE));
        userEvent.click(courtReporterRole);
    });
    userEvent.click(getByTestId("add_participants_add_modal_button"));
    await waitForDomChange();
    userEvent.click(addParticipantButton);
    await waitForDomChange();
    await act(async () => {
        userEvent.click(await waitForElement(() => getByText(ADD_PARTICIPANTS_CONSTANTS.ROLE_PLACEHOLDER)));
        expect(getAllByText("Court Reporter")).toHaveLength(1);
    });
});
it("should display all available roles for user admin", async () => {
    const { getByTestId, getAllByText, getByText } = renderWithGlobalContext(<CreateDeposition />);
    await act(async () => {
        userEvent.click(getByTestId("show_modal_add_participants_button"));
    });
    await act(async () => {
        userEvent.click(await waitForElement(() => getByText(ADD_PARTICIPANTS_CONSTANTS.ROLE_PLACEHOLDER)));
        await waitForElement(() =>
            ADD_PARTICIPANTS_CONSTANTS.getOtherParticipantsRoles(true).map((role) => getAllByText(role))
        );
    });
});
it("should display all available roles for user not admin", async () => {
    customDeps.apiService.currentUser = jest.fn().mockResolvedValue(getUserNotAdmin());
    const { getByTestId, getAllByText, getByText } = renderWithGlobalContext(<CreateDeposition />);
    await act(async () => {
        userEvent.click(getByTestId("show_modal_add_participants_button"));
    });
    await act(async () => {
        userEvent.click(await waitForElement(() => getByText(ADD_PARTICIPANTS_CONSTANTS.ROLE_PLACEHOLDER)));
        await waitForElement(() =>
            ADD_PARTICIPANTS_CONSTANTS.getOtherParticipantsRoles(false).map((role) => getAllByText(role))
        );
    });
});

it("show an empty list of cases if not admin and filter empty", async () => {
    customDeps.apiService.currentUser = jest.fn().mockResolvedValue(getUserNotAdmin());
    const { getByTestId, queryAllByText } = renderWithGlobalContext(<CreateDeposition />, customDeps);
    const caseSelect = await waitForElement(() => getByTestId("case_selector"));
    const caseInput = caseSelect.getElementsByTagName("input")[0];
    await act(async () => {
        await userEvent.click(caseSelect);
    });
    await act(async () => {
        await fireEvent.change(caseInput, { target: { value: CASE_TEST_CONSTANTS.CASE_NAME } });
    });
    const caseNames = await waitForElement(() => queryAllByText(RegExp(`.${CASE_TEST_CONSTANTS.CASE_NAME}`, "i")));
    expect(caseNames.length).toBe(10);
});

it("trigger validations when blur/change inputs on WitnessesSection", async () => {
    const { getAllByPlaceholderText, queryByText, getAllByRole } = renderWithGlobalContext(<CreateDeposition />);
    await waitForDomChange();
    // EMAIL VALIDATIONS
    const emailInput = getAllByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER)[1];
    await act(async () => {
        await fireEvent.change(emailInput, { target: { value: "a" } });
    });
    expect(queryByText(CONSTANTS.EMAIL_ERROR)).toBeFalsy();
    await act(async () => {
        await fireEvent.blur(emailInput);
    });
    expect(queryByText(CONSTANTS.EMAIL_ERROR)).toBeTruthy();
    await act(async () => {
        await fireEvent.change(emailInput, { target: { value: "a@a.a" } });
    });
    expect(queryByText(CONSTANTS.EMAIL_ERROR)).toBeFalsy();
    // PHONE VALIDATIONS
    const phoneInput = getAllByPlaceholderText(CONSTANTS.PHONE_PLACEHOLDER)[1];
    await act(async () => {
        await fireEvent.change(phoneInput, { target: { value: "0" } });
    });
    expect(queryByText(CONSTANTS.PHONE_ERROR)).toBeFalsy();
    await act(async () => {
        await fireEvent.blur(phoneInput);
    });
    expect(queryByText(CONSTANTS.PHONE_ERROR)).toBeTruthy();
    await act(async () => {
        await fireEvent.change(phoneInput, { target: { value: "311-222-2222" } });
    });
    expect(queryByText(CONSTANTS.PHONE_ERROR)).toBeFalsy();
    // TIME VALIDATIONS
    const [startInput, endInput] = getAllByPlaceholderText(CONSTANTS.START_PLACEHOLDER);
    // Set start time empty and check for error
    await act(async () => {
        await fireEvent.change(startInput, { target: { value: "" } });
    });
    expect(queryByText(CONSTANTS.REQUIRED_TIME_ERROR)).toBeFalsy();
    await act(async () => {
        await fireEvent.blur(startInput);
    });
    expect(queryByText(CONSTANTS.REQUIRED_TIME_ERROR)).toBeTruthy();
    // Set start time with 12:30 AM and check for error
    await act(async () => {
        await userEvent.click(startInput);
        await fireEvent.change(startInput, { target: { value: "12:30 AM" } });
    });
    await act(async () => {
        const okButton = getAllByRole("button", { name: /ok/i })[0];
        expect(okButton).toBeEnabled();
        await userEvent.click(okButton);
        await fireEvent.keyDown(endInput, { key: "enter", keyCode: 13 });
    });

    // Set start time empty and check for error
    await act(async () => {
        await fireEvent.change(endInput, { target: { value: "12:30 AM" } });
    });
    expect(queryByText(CONSTANTS.INVALID_END_TIME_ERROR)).toBeFalsy();
    await act(async () => {
        await fireEvent.keyDown(endInput, { key: "enter", keyCode: 13 });
        await fireEvent.blur(endInput);
    });
    expect(queryByText(CONSTANTS.INVALID_END_TIME_ERROR)).toBeTruthy();
    // Set start time with 12:30 AM and check for error
    await act(async () => {
        await userEvent.click(endInput);
        await fireEvent.change(endInput, { target: { value: "01:30 AM" } });
    });
    await act(async () => {
        const okButton = getAllByRole("button", { name: /ok/i })[1];
        expect(okButton).toBeEnabled();
        await userEvent.click(okButton);
        await fireEvent.keyDown(endInput, { key: "enter", keyCode: 13 });
    });
    expect(queryByText(CONSTANTS.INVALID_END_TIME_ERROR)).toBeFalsy();
});

it("show a file name when file is selected", async () => {
    const { queryByText, getByTestId } = renderWithGlobalContext(<CreateDeposition />);
    const file = new File(["file"], "file.pdf", { type: "application/pdf" });
    const imageInput = await waitForElement(() => getByTestId("upload_button"));

    await act(async () => {
        await fireEvent.change(imageInput, { target: { files: [file] } });
    });

    expect(queryByText("file.pdf")).toBeTruthy();
});

it("trigger validations when blur/change inputs on RequesterSection", async () => {
    const { getAllByPlaceholderText, queryByText } = renderWithGlobalContext(<CreateDeposition />);
    await waitForDomChange();
    // EMAIL VALIDATIONS
    const emailInput = getAllByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER)[1];
    await act(async () => {
        await fireEvent.change(emailInput, { target: { value: "a" } });
    });
    expect(queryByText(CONSTANTS.EMAIL_ERROR)).toBeFalsy();
    await act(async () => {
        await fireEvent.blur(emailInput);
    });
    expect(queryByText(CONSTANTS.EMAIL_ERROR)).toBeTruthy();
    await act(async () => {
        await fireEvent.change(emailInput, { target: { value: "" } });
    });
    expect(queryByText(CONSTANTS.EMAIL_REQUIRED_ERROR)).toBeTruthy();
    await act(async () => {
        await fireEvent.change(emailInput, { target: { value: "a@a.a" } });
    });
    expect(queryByText(CONSTANTS.EMAIL_ERROR)).toBeFalsy();
    // NAME VALIDATIONS
    const nameInput = getAllByPlaceholderText(CONSTANTS.NAME_PLACEHOLDER)[0];
    await act(async () => {
        await fireEvent.change(nameInput, { target: { value: "" } });
    });
    expect(queryByText(CONSTANTS.NAME_REQUIRED_ERROR)).toBeFalsy();
    await act(async () => {
        await fireEvent.blur(nameInput);
    });
    expect(queryByText(CONSTANTS.NAME_REQUIRED_ERROR)).toBeTruthy();
    await act(async () => {
        await fireEvent.change(nameInput, { target: { value: "name" } });
    });
    expect(queryByText(CONSTANTS.NAME_REQUIRED_ERROR)).toBeFalsy();
    // PHONE VALIDATIONS
    const phoneInput = getAllByPlaceholderText(CONSTANTS.PHONE_PLACEHOLDER)[1];
    await act(async () => {
        await fireEvent.change(phoneInput, { target: { value: "0" } });
    });
    expect(queryByText(CONSTANTS.PHONE_ERROR)).toBeFalsy();
    await act(async () => {
        await fireEvent.blur(phoneInput);
    });
    expect(queryByText(CONSTANTS.PHONE_ERROR)).toBeTruthy();
    await act(async () => {
        await fireEvent.change(phoneInput, { target: { value: "311-222-2222" } });
    });
    expect(queryByText(CONSTANTS.PHONE_ERROR)).toBeFalsy();
});

it("create a deposition when click on submit button with all required fields filled and select SCHEDULE NEW DEPOSITION option", async () => {
    const {
        getAllByText,
        getByLabelText,
        getAllByRole,
        getByPlaceholderText,
        getAllByPlaceholderText,
        getByText,
        getByTestId,
        queryByText,
        deps,
    } = renderWithGlobalContext(<CreateDeposition />);
    const { caseId, requesterName, requesterEmail, depositions } = TEST_CONSTANTS.getDepositions();
    const scheduleDeposition = await waitForElement(() => getByTestId("create_deposition_button"));
    expect(deps.apiService.fetchCases).toHaveBeenCalledWith({});
    await act(async () => {
        await userEvent.click(scheduleDeposition);
    });
    expect(deps.apiService.createDepositions).not.toHaveBeenCalled();
    // CASE SELECT
    const caseSelect = await waitForElement(() => getByText(CONSTANTS.CASE_SELECT_PLACEHOLDER));
    await act(async () => {
        await userEvent.click(caseSelect);
    });
    const caseNames = await waitForElement(() => getAllByText(RegExp(`.${CASE_TEST_CONSTANTS.CASE_NAME}`, "i")));
    await act(async () => {
        await userEvent.click(caseNames[0]);
    });
    // DATE FILL
    const dateInput = getByPlaceholderText(CONSTANTS.DATE_PLACEHOLDER);
    await act(async () => {
        await userEvent.click(dateInput);
    });
    await act(async () => {
        await userEvent.click(dateInput);
        await fireEvent.change(dateInput, {
            target: { value: moment(depositions[0].date).format(CONSTANTS.DATE_FORMAT) },
        });
        await fireEvent.keyDown(dateInput, { key: "enter", keyCode: 13 });
    });
    // TIMES FILL
    const [startInput, endInput] = getAllByPlaceholderText(CONSTANTS.START_PLACEHOLDER);
    await act(async () => {
        await userEvent.click(startInput);
        await fireEvent.change(startInput, {
            target: { value: moment(depositions[0].startTime).format(CONSTANTS.TIME_FORMAT) },
        });
    });
    await act(async () => {
        const okButton = getAllByRole("button", { name: /ok/i })[0];
        await userEvent.click(okButton);
    });
    await act(async () => {
        await userEvent.click(endInput);
        await fireEvent.change(endInput, {
            target: { value: moment(depositions[0].endTime).format(CONSTANTS.TIME_FORMAT) },
        });
    });
    await act(async () => {
        const okButton = getAllByRole("button", { name: /ok/i })[1];
        await userEvent.click(okButton);
    });
    // RADIO BUTTON FILL
    const radioButtonOption = getByLabelText("NO");
    await act(async () => {
        await userEvent.click(radioButtonOption);
    });
    // EMAIL FILL
    const emailInput = getAllByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER)[1];
    await act(async () => {
        await fireEvent.change(emailInput, { target: { value: requesterEmail } });
    });
    // NAME FILL
    const nameInput = getAllByPlaceholderText(CONSTANTS.NAME_PLACEHOLDER)[0];
    await act(async () => {
        await fireEvent.change(nameInput, { target: { value: requesterName } });
    });
    await act(async () => {
        await userEvent.click(scheduleDeposition);
    });
    expect(deps.apiService.createDepositions).toHaveBeenCalledWith({
        depositionList: TEST_CONSTANTS.getMappedDepositions1(),
        files: [],
        caseId,
    });
    expect(queryByText(CONSTANTS.getSuccessDepositionTitle(1))).toBeTruthy();
    await act(async () => {
        const newDepositionButton = getByTestId("schedule_new_deposition_button");
        await userEvent.click(newDepositionButton);
    });
    expect(queryByText(CONSTANTS.getSuccessDepositionTitle(1))).toBeFalsy();
});
it("create a deposition when click on submit button with all required fields filled and select GO TO MY DEPOSITIONS option", async () => {
    const {
        getAllByText,
        getByLabelText,
        getAllByRole,
        getByRole,
        getByPlaceholderText,
        getAllByPlaceholderText,
        getByText,
        getByTestId,
        deps,
    } = renderWithGlobalContext(<CreateDeposition />);
    const { caseId, requesterName, requesterEmail, depositions } = TEST_CONSTANTS.getDepositions();
    const scheduleDeposition = await waitForElement(() => getByTestId("create_deposition_button"));
    expect(deps.apiService.fetchCases).toHaveBeenCalledWith({});
    await act(async () => {
        await userEvent.click(scheduleDeposition);
    });
    expect(deps.apiService.createDepositions).not.toHaveBeenCalled();
    // CASE SELECT
    const caseSelect = await waitForElement(() => getByText(CONSTANTS.CASE_SELECT_PLACEHOLDER));
    await act(async () => {
        await userEvent.click(caseSelect);
    });
    const caseNames = await waitForElement(() => getAllByText(RegExp(`.${CASE_TEST_CONSTANTS.CASE_NAME}`, "i")));
    await act(async () => {
        await userEvent.click(caseNames[0]);
    });
    // DATE FILL
    const dateInput = getByPlaceholderText(CONSTANTS.DATE_PLACEHOLDER);
    await act(async () => {
        await userEvent.click(dateInput);
    });
    await act(async () => {
        await userEvent.click(dateInput);
        await fireEvent.change(dateInput, {
            target: { value: moment(depositions[0].date).format(CONSTANTS.DATE_FORMAT) },
        });
        await fireEvent.keyDown(dateInput, { key: "enter", keyCode: 13 });
    });
    // TIMES FILL
    const [startInput, endInput] = getAllByPlaceholderText(CONSTANTS.START_PLACEHOLDER);
    await act(async () => {
        await userEvent.click(startInput);
        await fireEvent.change(startInput, {
            target: { value: moment(depositions[0].startTime).format(CONSTANTS.TIME_FORMAT) },
        });
    });
    await act(async () => {
        const okButton = getAllByRole("button", { name: /ok/i })[0];
        await userEvent.click(okButton);
    });
    await act(async () => {
        await userEvent.click(endInput);
        await fireEvent.change(endInput, {
            target: { value: moment(depositions[0].endTime).format(CONSTANTS.TIME_FORMAT) },
        });
    });
    await act(async () => {
        const okButton = getAllByRole("button", { name: /ok/i })[1];
        await userEvent.click(okButton);
    });
    // RADIO BUTTON FILL
    const radioButtonOption = getByLabelText("NO");
    await act(async () => {
        await userEvent.click(radioButtonOption);
    });
    // EMAIL FILL
    const emailInput = getAllByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER)[1];
    await act(async () => {
        await fireEvent.change(emailInput, { target: { value: requesterEmail } });
    });
    // NAME FILL
    const nameInput = getAllByPlaceholderText(CONSTANTS.NAME_PLACEHOLDER)[0];
    await act(async () => {
        await fireEvent.change(nameInput, { target: { value: requesterName } });
    });
    await act(async () => {
        await userEvent.click(scheduleDeposition);
    });
    expect(deps.apiService.createDepositions).toHaveBeenCalledWith({
        depositionList: TEST_CONSTANTS.getMappedDepositions1(),
        files: [],
        caseId,
    });
    await act(async () => {
        const goToDepositionsButton = getByRole("button", { name: CONSTANTS.GO_TO_DEPOSITIONS });
        await userEvent.click(goToDepositionsButton);
    });
    expect(global.window.location.pathname).toBe("/");
});

it("shows error and try again button when get an error on fetch", async () => {
    customDeps.apiService.fetchCases = jest.fn().mockImplementation(() => Promise.reject(Error("")));

    const { getByText, getByTestId } = renderWithGlobalContext(<CreateDeposition />, customDeps);

    await waitForElement(() => getByText(ERRORS_CONSTANTS.FETCH_ERROR_MODAL_TITLE));
    const refreshButton = getByTestId("error_modal_button");
    expect(customDeps.apiService.fetchCases).toHaveBeenCalledTimes(1);
    await act(async () => {
        await fireEvent.click(refreshButton);
    });
    expect(customDeps.apiService.fetchCases).toHaveBeenCalledTimes(2);
});

it("shows validations when click on add witness button", async () => {
    const { getByText, getByTestId } = renderWithGlobalContext(<CreateDeposition />);

    const addWitnessButton = await waitForElement(() => getByTestId("add_witness_button"));
    await act(async () => userEvent.click(addWitnessButton));
    expect(getByText(CONSTANTS.DATE_ERROR)).toBeTruthy();
    expect(getByText(CONSTANTS.OPTION_ERROR)).toBeTruthy();
    expect(getByText(CONSTANTS.REQUIRED_TIME_ERROR)).toBeTruthy();
});

it("add a witness when click on add witness button and the required fields are filled", async () => {
    const {
        getByLabelText,
        getAllByRole,
        getByPlaceholderText,
        getAllByPlaceholderText,
        getByTestId,
        getAllByTestId,
    } = renderWithGlobalContext(<CreateDeposition />);
    const { depositions } = TEST_CONSTANTS.getDepositions();

    // DATE FILL
    const dateInput = getByPlaceholderText(CONSTANTS.DATE_PLACEHOLDER);
    await act(async () => {
        await userEvent.click(dateInput);
    });
    await act(async () => {
        await userEvent.click(dateInput);
        await fireEvent.change(dateInput, {
            target: { value: moment(depositions[0].date).format(CONSTANTS.DATE_FORMAT) },
        });
        await fireEvent.keyDown(dateInput, { key: "enter", keyCode: 13 });
    });
    // TIMES FILL
    const [startInput] = getAllByPlaceholderText(CONSTANTS.START_PLACEHOLDER);
    await act(async () => {
        await userEvent.click(startInput);
        await fireEvent.change(startInput, {
            target: { value: moment(depositions[0].startTime).format(CONSTANTS.TIME_FORMAT) },
        });
    });
    await act(async () => {
        const okButton = getAllByRole("button", { name: /ok/i })[0];
        await userEvent.click(okButton);
    });
    // RADIO BUTTON FILL
    const radioButtonOption = getByLabelText("NO");
    await act(async () => {
        await userEvent.click(radioButtonOption);
    });

    const addWitnessButton = await waitForElement(() => getByTestId("add_witness_button"));
    await act(async () => userEvent.click(addWitnessButton));

    expect(await waitForElement(() => getAllByTestId("witness_title").length)).toBe(2);
});

it("deletes a witness when click on Delete Witness button", async () => {
    const {
        queryByDisplayValue,
        getByLabelText,
        getAllByRole,
        getByPlaceholderText,
        getAllByPlaceholderText,
        getByTestId,
        queryByTestId,
    } = renderWithGlobalContext(<CreateDeposition />);
    const { depositions } = TEST_CONSTANTS.getDepositions();

    // DATE FILL
    const dateInput = getByPlaceholderText(CONSTANTS.DATE_PLACEHOLDER);
    await act(async () => {
        await userEvent.click(dateInput);
    });
    await act(async () => {
        await userEvent.click(dateInput);
        await fireEvent.change(dateInput, {
            target: { value: moment(depositions[0].date).format(CONSTANTS.DATE_FORMAT) },
        });
        await fireEvent.keyDown(dateInput, { key: "enter", keyCode: 13 });
    });
    // TIMES FILL
    const [startInput] = getAllByPlaceholderText(CONSTANTS.START_PLACEHOLDER);
    await act(async () => {
        await userEvent.click(startInput);
        await fireEvent.change(startInput, {
            target: { value: moment(depositions[0].startTime).format(CONSTANTS.TIME_FORMAT) },
        });
    });
    await act(async () => {
        const okButton = getAllByRole("button", { name: /ok/i })[0];
        await userEvent.click(okButton);
    });
    // RADIO BUTTON FILL
    const radioButtonOption = getByLabelText("NO");
    await act(async () => {
        await userEvent.click(radioButtonOption);
    });

    expect(queryByTestId("witness_delete_button")).toBeFalsy();

    const addWitnessButton = await waitForElement(() => getByTestId("add_witness_button"));
    await act(async () => userEvent.click(addWitnessButton));

    // DELETE FIRST WITNESS
    const deleteButton = await waitForElement(() => getByTestId("witness_delete_button"));
    await act(async () => userEvent.click(deleteButton));
    // CHECK IF FIRST WITNESS STILL EXISTS
    expect(queryByDisplayValue(moment(depositions[0].date).format(CONSTANTS.DATE_FORMAT))).toBeTruthy();

    expect(queryByTestId("witness_delete_button")).toBeFalsy();
});

it("show display the add other participants section", async () => {
    const { queryByText, getByTestId } = renderWithGlobalContext(<CreateDeposition />);
    expect(queryByText(ADD_PARTICIPANTS_CONSTANTS.OTHER_PARTICIPANTS_ADD_BUTTON_LABEL)).toBeTruthy();
    expect(getByTestId("add_participants_table")).toBeTruthy();
    expect(getByTestId("show_modal_add_participants_button")).toBeTruthy();
});
it("show display the add participant section with empty state when no participant were added", async () => {
    const { getByTestId } = renderWithGlobalContext(<CreateDeposition />);
    expect(getByTestId("empty_data_section")).toBeTruthy();
});
it("show display the add participant modal when click on the add particpant button", async () => {
    const { getByTestId } = renderWithGlobalContext(<CreateDeposition />);
    const addParticipantButton = getByTestId("show_modal_add_participants_button");
    await act(async () => {
        await userEvent.click(addParticipantButton);
    });
    const modal = await waitForElement(() => getByTestId("add_participants_modal_form"));
    expect(modal).toBeInTheDocument();
});
it("should create a new participant and display on the add participant table", async () => {
    const { getByTestId, getAllByText, getByText, debug, queryByTestId } = renderWithGlobalContext(
        <CreateDeposition />
    );
    const addParticipantButton = getByTestId("show_modal_add_participants_button");
    await act(async () => {
        await userEvent.click(addParticipantButton);
    });

    const roleSelect = await waitForElement(() => getByText(ADD_PARTICIPANTS_CONSTANTS.ROLE_PLACEHOLDER));
    await act(async () => {
        await userEvent.click(roleSelect);
    });
    const role = await waitForElement(() => getAllByText("Attorney"));
    await act(async () => {
        await userEvent.click(role[1]);
    });

    expect(getByTestId("add_participants_modal_form")).toBeInTheDocument();
    const addParticipantModalButton = getByTestId("add_participants_add_modal_button");
    await act(async () => {
        await userEvent.click(addParticipantModalButton);
    });
    expect(queryByTestId("add_participants_modal_form")).toBeNull();
    const roleOnTheTable = await waitForElement(() => getByText("Attorney"));

    expect(roleOnTheTable).toBeInTheDocument();
});

it("should show add participant button enabled by default", async () => {
    const { getByTestId } = renderWithGlobalContext(<CreateDeposition />);
    expect(getByTestId("show_modal_add_participants_button")).not.toHaveAttribute("disabled");
});

it("should show add participant button be disabled when added more than allowed participants", async () => {
    ADD_PARTICIPANTS_CONSTANTS.MAX_PARTICIPANTS_ALLOWED = 1;
    const { getByTestId, getAllByText, getByText } = renderWithGlobalContext(<CreateDeposition />);
    expect(getByTestId("show_modal_add_participants_button")).not.toHaveAttribute("disabled");
    const addParticipantButton = getByTestId("show_modal_add_participants_button");
    await act(async () => {
        await userEvent.click(addParticipantButton);
    });

    const roleSelect = await waitForElement(() => getByText(ADD_PARTICIPANTS_CONSTANTS.ROLE_PLACEHOLDER));
    await act(async () => {
        await userEvent.click(roleSelect);
    });
    const role = await waitForElement(() => getAllByText("Attorney"));
    await act(async () => {
        await userEvent.click(role[1]);
    });

    expect(getByTestId("add_participants_modal_form")).toBeInTheDocument();
    const addParticipantModalButton = getByTestId("add_participants_add_modal_button");
    await act(async () => {
        await userEvent.click(addParticipantModalButton);
    });
    expect(getByTestId("show_modal_add_participants_button")).toHaveAttribute("disabled");
});

it("should open edit participant modal when click on the edit button", async () => {
    const { getByTestId, getAllByText, getByText } = renderWithGlobalContext(<CreateDeposition />);
    const addParticipantButton = getByTestId("show_modal_add_participants_button");
    await act(async () => {
        await userEvent.click(addParticipantButton);
    });

    const roleSelect = await waitForElement(() => getByText(ADD_PARTICIPANTS_CONSTANTS.ROLE_PLACEHOLDER));
    await act(async () => {
        await userEvent.click(roleSelect);
    });
    const role = await waitForElement(() => getAllByText("Attorney"));
    await act(async () => {
        await userEvent.click(role[1]);
    });

    const addParticipantModalButton = getByTestId("add_participants_add_modal_button");
    await act(async () => {
        await userEvent.click(addParticipantModalButton);
    });
    const editButton = getByTestId("other_participant_section_edit_button");
    expect(editButton).toBeInTheDocument();
    await act(async () => {
        await userEvent.click(editButton);
    });
    expect(getByText(ADD_PARTICIPANTS_CONSTANTS.OTHER_PARTICIPANTS_EDIT_BUTTON_LABEL)).toBeInTheDocument();
});

it("should open delete participant modal when click on the remove button", async () => {
    const { getByTestId, getAllByText, getByText } = renderWithGlobalContext(<CreateDeposition />);
    const addParticipantButton = getByTestId("show_modal_add_participants_button");
    await act(async () => {
        await userEvent.click(addParticipantButton);
    });
    const roleSelect = await waitForElement(() => getByText(ADD_PARTICIPANTS_CONSTANTS.ROLE_PLACEHOLDER));
    await act(async () => {
        await userEvent.click(roleSelect);
    });
    const role = await waitForElement(() => getAllByText("Attorney"));
    await act(async () => {
        userEvent.click(role[1]);
    });
    const addParticipantModalButton = getByTestId("add_participants_add_modal_button");
    await act(async () => {
        userEvent.click(addParticipantModalButton);
    });
    await act(async () => {
        userEvent.click(getByTestId("delete_participants_modal_prompt"));
        await waitForDomChange();
        const removeButton = getByText(ADD_PARTICIPANTS_CONSTANTS.OTHER_PARTICIPANTS_MODAL_DELETE_LABEL);
        userEvent.click(removeButton);
    });
});

it("RequesterSection must be hidden when user is admin", async () => {
    const { queryByTestId } = renderWithGlobalContext(<CreateDeposition />);
    await waitForDomChange();
    const querySection = queryByTestId("requester_title");
    expect(querySection).toBeTruthy();
});

it("RequesterSection must be hidden when user not admin", async () => {
    customDeps.apiService.currentUser = jest.fn().mockResolvedValue(getUserNotAdmin());
    const { queryByTestId } = renderWithGlobalContext(<CreateDeposition />, customDeps);
    await waitForDomChange();
    const querySection = queryByTestId("requester_title");
    expect(querySection).toBeFalsy();
});

// TODO: improve the test in order to avoid using this timeout
jest.setTimeout(50000);

it(`add up to ${CONSTANTS.WITNESSES_LIMIT} witnesses and try to add another without success`, async (done) => {
    const { getAllByLabelText, getAllByRole, getAllByPlaceholderText, getByTestId } = renderWithGlobalContext(
        <CreateDeposition />
    );
    const { depositions } = TEST_CONSTANTS.getDepositions();

    const addWitnessButton = await waitForElement(() => getByTestId("add_witness_button"));
    for (let index = 0; index < CONSTANTS.WITNESSES_LIMIT - 1; index++) {
        // DATE FILL
        const dateInput = getAllByPlaceholderText(CONSTANTS.DATE_PLACEHOLDER).pop();
        await act(async () => {
            await userEvent.click(dateInput);
        });
        await act(async () => {
            await userEvent.click(dateInput);
            await fireEvent.change(dateInput, {
                target: { value: moment(depositions[0].date).format(CONSTANTS.DATE_FORMAT) },
            });
            await fireEvent.keyDown(dateInput, { key: "enter", keyCode: 13 });
        });
        // TIMES FILL
        const timeInputs = getAllByPlaceholderText(CONSTANTS.START_PLACEHOLDER);
        const startInput = timeInputs[timeInputs.length - 2];
        await act(async () => {
            await userEvent.click(startInput);
            await fireEvent.change(startInput, {
                target: { value: moment(depositions[0].startTime).format(CONSTANTS.TIME_FORMAT) },
            });
        });
        await act(async () => {
            const okButton = getAllByRole("button", { name: /ok/i }).pop();
            await userEvent.click(okButton);
        });
        // RADIO BUTTON FILL
        const radioButtonOption = getAllByLabelText("NO").pop();
        await act(async () => {
            await userEvent.click(radioButtonOption);
        });
        await act(async () => userEvent.click(addWitnessButton));
    }
    expect(addWitnessButton).toBeDisabled();
    done();
});

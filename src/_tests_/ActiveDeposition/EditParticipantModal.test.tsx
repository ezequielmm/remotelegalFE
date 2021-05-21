import { waitForDomChange, fireEvent, waitForElement } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import * as TEST_CONSTANTS from "../constants/activeDepositionDetails";
import getMockDeps from "../utils/getMockDeps";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import * as CONSTANTS from "../../constants/activeDepositionDetails";
import { getDepositionWithOverrideValues } from "../constants/depositions";
import { PARTICIPANT_MOCK } from "../constants/preJoinDepo";
import EditParticipantModal from "../../routes/ActiveDepoDetails/components/EditParticipantModal";
import { Roles } from "../../models/participant";

const customDeps = getMockDeps();

test("Should display a registered user with disabled fields for everything but role", () => {
    const overridenParticipantMock = {
        ...PARTICIPANT_MOCK,
        user: {
            isGuest: false,
            firstName: "",
            lastName: "",
            emailAddress: "",
        },
    };
    const handleClose = jest.fn();
    const deposition = getDepositionWithOverrideValues();
    const fetchParticipants = jest.fn();
    const { getByTestId, queryByTestId } = renderWithGlobalContext(
        <EditParticipantModal
            handleClose={handleClose}
            deposition={deposition}
            fetchParticipants={fetchParticipants}
            visible
            currentParticipant={overridenParticipantMock}
        />,
        customDeps
    );
    expect(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_EMAIL_INPUT_ID)).toBeDisabled();
    expect(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_NAME_INPUT_ID)).toBeDisabled();
    expect(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_PHONE_INPUT_ID)).toBeDisabled();
    expect(queryByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_ROLE_INPUT_ID_DISABLED)).toBeFalsy();
    expect(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_ROLE_INPUT_ID)).toBeInTheDocument();
});

test("Should disable role input if participant is a witness", () => {
    const overridenParticipantMock = {
        ...PARTICIPANT_MOCK,
        role: Roles.witness,
        user: null,
    };
    const handleClose = jest.fn();
    const deposition = getDepositionWithOverrideValues();
    const fetchParticipants = jest.fn();
    const { getByTestId } = renderWithGlobalContext(
        <EditParticipantModal
            handleClose={handleClose}
            deposition={deposition}
            fetchParticipants={fetchParticipants}
            visible
            currentParticipant={overridenParticipantMock}
        />,
        customDeps
    );
    expect(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_ROLE_INPUT_ID_DISABLED)).toBeInTheDocument();
});

test("Court Reporter shouldn´t be an option if there is already one", async () => {
    const overridenParticipantMock = {
        ...PARTICIPANT_MOCK,
        user: null,
    };
    const handleClose = jest.fn();
    const deposition = getDepositionWithOverrideValues();
    const fetchParticipants = jest.fn();
    const { getByText, queryAllByText } = renderWithGlobalContext(
        <EditParticipantModal
            isCourtReporterPresent
            handleClose={handleClose}
            deposition={deposition}
            fetchParticipants={fetchParticipants}
            visible
            currentParticipant={overridenParticipantMock}
        />,
        customDeps
    );
    userEvent.click(getByText(PARTICIPANT_MOCK.role));
    const role = await waitForElement(() => queryAllByText("Court Reporter"));
    expect(role).toHaveLength(0);
});

test("Should validate phone and name fields", async () => {
    customDeps.apiService.editDepoParticipant = jest.fn();
    const overridenParticipantMock = {
        ...PARTICIPANT_MOCK,
        user: null,
    };
    const handleClose = jest.fn();
    const deposition = getDepositionWithOverrideValues();
    const fetchParticipants = jest.fn();
    const { getByTestId } = renderWithGlobalContext(
        <EditParticipantModal
            handleClose={handleClose}
            deposition={deposition}
            fetchParticipants={fetchParticipants}
            visible
            currentParticipant={overridenParticipantMock}
        />,
        customDeps
    );
    fireEvent.change(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_EMAIL_INPUT_ID), {
        target: { value: "test" },
    });
    fireEvent.change(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_PHONE_INPUT_ID), {
        target: { value: "test" },
    });
    fireEvent.click(getByTestId(CONSTANTS.DEPOSITION_DETAILS_SAVE_BUTTON_ID));
    await waitForDomChange();
    expect(
        getByTestId(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_DATA_TEST_ID_INVALID_PHONE)
    ).toBeInTheDocument();
    expect(
        getByTestId(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_DATA_TEST_ID_INVALID_EMAIL)
    ).toBeInTheDocument();
    expect(customDeps.apiService.editDepoParticipant).not.toHaveBeenCalled();
});
test("Should call the edit participant endpoint with the proper body and don´t show the confirm modal", async () => {
    customDeps.apiService.editDepoParticipant = jest.fn().mockResolvedValue({});
    const overridenParticipantMock = {
        ...PARTICIPANT_MOCK,
        user: null,
    };
    const handleClose = jest.fn();
    const deposition = getDepositionWithOverrideValues();
    const fetchParticipants = jest.fn();
    const { getByTestId, getByText, getAllByText, queryByTestId } = renderWithGlobalContext(
        <EditParticipantModal
            handleClose={handleClose}
            deposition={deposition}
            fetchParticipants={fetchParticipants}
            visible
            currentParticipant={overridenParticipantMock}
        />,
        customDeps
    );
    fireEvent.change(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_EMAIL_INPUT_ID), {
        target: { value: PARTICIPANT_MOCK.email },
    });
    fireEvent.change(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_PHONE_INPUT_ID), {
        target: { value: PARTICIPANT_MOCK.phone },
    });
    fireEvent.change(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_NAME_INPUT_ID), {
        target: { value: PARTICIPANT_MOCK.name },
    });
    userEvent.click(getByText(PARTICIPANT_MOCK.role));
    const role = await waitForElement(() => getAllByText("Paralegal"));
    userEvent.click(role[0]);
    fireEvent.click(getByTestId(CONSTANTS.DEPOSITION_DETAILS_SAVE_BUTTON_ID));
    await waitForDomChange();
    expect(queryByTestId("confirm_title")).toBeFalsy();
    expect(getByText(CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_NO_CONFIRMED_DEPOSITION_TOAST)).toBeInTheDocument();
    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(fetchParticipants).toHaveBeenCalledTimes(1);
    expect(customDeps.apiService.editDepoParticipant).toHaveBeenCalledTimes(1);
    expect(customDeps.apiService.editDepoParticipant).toHaveBeenCalledWith(
        deposition.id,
        TEST_CONSTANTS.EDIT_PARTICIPANT_BODY
    );
});
test("Should show error toast if fetch fails", async () => {
    customDeps.apiService.editDepoParticipant = jest.fn().mockRejectedValue(Error(""));
    const overridenParticipantMock = {
        ...PARTICIPANT_MOCK,
        user: null,
    };
    const handleClose = jest.fn();
    const deposition = getDepositionWithOverrideValues();
    const fetchParticipants = jest.fn();
    const { getByTestId, getByText, queryByTestId } = renderWithGlobalContext(
        <EditParticipantModal
            handleClose={handleClose}
            deposition={deposition}
            fetchParticipants={fetchParticipants}
            visible
            currentParticipant={overridenParticipantMock}
        />,
        customDeps
    );
    fireEvent.click(getByTestId(CONSTANTS.DEPOSITION_DETAILS_SAVE_BUTTON_ID));
    await waitForDomChange();
    expect(queryByTestId("confirm_title")).toBeFalsy();
    expect(getByText(CONSTANTS.NETWORK_ERROR)).toBeInTheDocument();
    expect(handleClose).not.toHaveBeenCalled();
    expect(fetchParticipants).not.toHaveBeenCalled();
    expect(customDeps.apiService.editDepoParticipant).toHaveBeenCalledTimes(1);
});

test("Should call the edit participant endpoint with the proper body and show the confirm modal with the participant´s name and show the correct toast", async () => {
    customDeps.apiService.editDepoParticipant = jest.fn().mockResolvedValue({});
    const overridenParticipantMock = {
        ...PARTICIPANT_MOCK,
        user: null,
    };
    const handleClose = jest.fn();
    const deposition = getDepositionWithOverrideValues({ status: "Confirmed" });
    const fetchParticipants = jest.fn();
    const { getByTestId, getByText, getAllByText } = renderWithGlobalContext(
        <EditParticipantModal
            handleClose={handleClose}
            deposition={deposition}
            fetchParticipants={fetchParticipants}
            visible
            currentParticipant={overridenParticipantMock}
        />,
        customDeps
    );
    const newEmail = "test@test1.com";
    fireEvent.change(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_EMAIL_INPUT_ID), {
        target: { value: newEmail },
    });
    fireEvent.change(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_PHONE_INPUT_ID), {
        target: { value: PARTICIPANT_MOCK.phone },
    });
    fireEvent.change(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_NAME_INPUT_ID), {
        target: { value: PARTICIPANT_MOCK.name },
    });
    userEvent.click(getByText(PARTICIPANT_MOCK.role));
    const role = await waitForElement(() => getAllByText("Paralegal"));
    userEvent.click(role[0]);
    fireEvent.click(getByTestId(CONSTANTS.DEPOSITION_DETAILS_SAVE_BUTTON_ID));
    await waitForDomChange();
    expect(
        getByText(
            `Are you sure you want to edit ${PARTICIPANT_MOCK.name}? The participant will be notified by email about this invitation.`
        )
    ).toBeInTheDocument();
    fireEvent.click(getByText(CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_CONFIRM_POSITIVE_LABEL));
    await waitForDomChange();
    expect(getByText(CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_CONFIRMED_DEPOSITION_TOAST)).toBeInTheDocument();
    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(fetchParticipants).toHaveBeenCalledTimes(1);
    expect(customDeps.apiService.editDepoParticipant).toHaveBeenCalledTimes(1);
    expect(customDeps.apiService.editDepoParticipant).toHaveBeenCalledWith(deposition.id, {
        ...TEST_CONSTANTS.EDIT_PARTICIPANT_BODY,
        email: newEmail,
    });
});

test("Should call the edit participant endpoint with the proper body and show the confirm modal with ¨this participant¨", async () => {
    customDeps.apiService.editDepoParticipant = jest.fn().mockResolvedValue({});
    const overridenParticipantMock = {
        ...PARTICIPANT_MOCK,
        user: null,
    };
    const handleClose = jest.fn();
    const deposition = getDepositionWithOverrideValues({ status: "Confirmed" });
    const fetchParticipants = jest.fn();
    const { getByTestId, getByText, getAllByText } = renderWithGlobalContext(
        <EditParticipantModal
            handleClose={handleClose}
            deposition={deposition}
            fetchParticipants={fetchParticipants}
            visible
            currentParticipant={overridenParticipantMock}
        />,
        customDeps
    );
    const newEmail = "test@test1.com";
    fireEvent.change(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_EMAIL_INPUT_ID), {
        target: { value: newEmail },
    });
    fireEvent.change(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_PHONE_INPUT_ID), {
        target: { value: PARTICIPANT_MOCK.phone },
    });
    fireEvent.change(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_NAME_INPUT_ID), {
        target: { value: "" },
    });
    userEvent.click(getByText(PARTICIPANT_MOCK.role));
    const role = await waitForElement(() => getAllByText("Paralegal"));
    userEvent.click(role[0]);
    fireEvent.click(getByTestId(CONSTANTS.DEPOSITION_DETAILS_SAVE_BUTTON_ID));
    await waitForDomChange();
    expect(
        getByText(
            `Are you sure you want to edit ${CONSTANTS.DEPOSITION_DETAILS_NO_NAME_FOR_PARTICIPANT}? The participant will be notified by email about this invitation.`
        )
    ).toBeInTheDocument();
});

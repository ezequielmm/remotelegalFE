import { Status } from "../../components/StatusPill/StatusPill";
import getModalTextContent from "../../routes/ActiveDepoDetails/helpers/getModalTextContent";
import * as CONSTANTS from "../../constants/activeDepositionDetails";
import { getDepositionWithOverrideValues } from "../constants/depositions";

test("Shows correct text if the status is canceled and witness has a name", async () => {
    const fullDeposition = getDepositionWithOverrideValues();
    const statusCanceledAndWitnessWithNameTexts = {
        title: CONSTANTS.DEPOSITION_DETAILS_CANCEL_DEPOSITION_MODAL_TITLE,
        message:
            "Are you sure you want to cancel the deposition of Witness Name in the case of case name? All participants will be notified by email about this cancellation.",
        cancelButton: CONSTANTS.DEPOSITION_DETAILS_CANCEL_DEPOSITION_MODAL_CANCEL_BUTTON,
        confirmButton: CONSTANTS.DEPOSITION_DETAILS_CANCEL_DEPOSITION_MODAL_CONFIRM_BUTTON,
    };
    const modalText = getModalTextContent(Status.canceled, fullDeposition);
    expect(statusCanceledAndWitnessWithNameTexts).toEqual(modalText);
});

test("Shows correct text if the status is canceled and witness doesn´t have a name", async () => {
    const fullDeposition = getDepositionWithOverrideValues({ witness: { name: "" } });
    const statusCanceledAndWitnessWithNoNameTexts = {
        title: CONSTANTS.DEPOSITION_DETAILS_CANCEL_DEPOSITION_MODAL_TITLE,
        message:
            "Are you sure you want to cancel the deposition in the case of case name? All participants will be notified by email about this cancellation.",
        cancelButton: CONSTANTS.DEPOSITION_DETAILS_CANCEL_DEPOSITION_MODAL_CANCEL_BUTTON,
        confirmButton: CONSTANTS.DEPOSITION_DETAILS_CANCEL_DEPOSITION_MODAL_CONFIRM_BUTTON,
    };
    const modalText = getModalTextContent(Status.canceled, fullDeposition);
    expect(modalText).toEqual(statusCanceledAndWitnessWithNoNameTexts);
});

test("Shows correct text if the status is confirmed and witness has a name", async () => {
    const fullDeposition = getDepositionWithOverrideValues();
    const statusConfirmedAndWitnessWithNameTexts = {
        title: CONSTANTS.DEPOSITION_DETAILS_CONFIRM_DEPOSITION_MODAL_TITLE,
        message:
            "Are you sure you want to confirm the deposition of Witness Name in the case of case name? All participants will be notified by email about this confirmation.",
        cancelButton: CONSTANTS.DEPOSITION_DETAILS_CONFIRM_DEPOSITION_MODAL_CANCEL_BUTTON,
        confirmButton: CONSTANTS.DEPOSITION_DETAILS_CONFIRM_DEPOSITION_MODAL_CONFIRM_BUTTON,
    };
    const modalText = getModalTextContent(Status.confirmed, fullDeposition);
    expect(statusConfirmedAndWitnessWithNameTexts).toEqual(modalText);
});
test("Shows correct text if the status is confirmed and witness doesn´t have a name", async () => {
    const fullDeposition = getDepositionWithOverrideValues({ witness: { name: "" } });
    const modalText = getModalTextContent(Status.confirmed, fullDeposition);
    const statusConfirmedAndWitnessWithNoNameTexts = {
        title: CONSTANTS.DEPOSITION_DETAILS_CONFIRM_DEPOSITION_MODAL_TITLE,
        message:
            "Are you sure you want to confirm the deposition in the case of case name? All participants will be notified by email about this confirmation.",
        cancelButton: CONSTANTS.DEPOSITION_DETAILS_CONFIRM_DEPOSITION_MODAL_CANCEL_BUTTON,
        confirmButton: CONSTANTS.DEPOSITION_DETAILS_CONFIRM_DEPOSITION_MODAL_CONFIRM_BUTTON,
    };
    expect(statusConfirmedAndWitnessWithNoNameTexts).toEqual(modalText);
});

test("Shows correct text on every other status and witness has a name", async () => {
    const fullDeposition = getDepositionWithOverrideValues();
    const statusPendingAndWitnessWithName = {
        title: CONSTANTS.DEPOSITION_DETAILS_RESCHEDULE_DEPOSITION_MODAL_TITLE,
        message:
            "Are you sure you want to move the deposition of Witness Name in the case of case name from Canceled to Pending? No email notification will go out until the status is changed to Confirmed.",
        cancelButton: CONSTANTS.DEPOSITION_DETAILS_RESCHEDULE_DEPOSITION_MODAL_CANCEL_BUTTON,
        confirmButton: CONSTANTS.DEPOSITION_DETAILS_RESCHEDULE_DEPOSITION_MODAL_CONFIRM_BUTTON,
    };
    const modalText = getModalTextContent(Status.pending, fullDeposition);
    expect(statusPendingAndWitnessWithName).toEqual(modalText);
});
test("Shows correct text on every other status and witness doesn´t have a name", async () => {
    const fullDeposition = getDepositionWithOverrideValues({ witness: { name: "" } });
    const statusPendingAndWitnessWithNoName = {
        title: CONSTANTS.DEPOSITION_DETAILS_RESCHEDULE_DEPOSITION_MODAL_TITLE,
        message:
            "Are you sure you want to move the deposition in the case of case name from Canceled to Pending? No email notification will go out until the status is changed to Confirmed.",
        cancelButton: CONSTANTS.DEPOSITION_DETAILS_RESCHEDULE_DEPOSITION_MODAL_CANCEL_BUTTON,
        confirmButton: CONSTANTS.DEPOSITION_DETAILS_RESCHEDULE_DEPOSITION_MODAL_CONFIRM_BUTTON,
    };
    const modalText = getModalTextContent(Status.pending, fullDeposition);
    expect(statusPendingAndWitnessWithNoName).toEqual(modalText);
});

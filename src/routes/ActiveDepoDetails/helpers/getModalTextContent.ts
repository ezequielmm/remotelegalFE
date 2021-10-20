import { Status } from "@rl/prp-components-library/src/components/StatusPill/StatusPill";
import * as CONSTANTS from "../../../constants/activeDepositionDetails";
import { DepositionModel } from "../../../models";

const getModalTextContent = (status: Status, deposition: DepositionModel.IDeposition) => {
    const witnessText = deposition.witness?.name ? `the deposition of ${deposition.witness.name}` : "the deposition";
    if (status === Status.canceled) {
        return {
            title: CONSTANTS.DEPOSITION_DETAILS_CANCEL_DEPOSITION_MODAL_TITLE,
            message: `Are you sure you want to cancel ${witnessText} in the case of ${deposition.caseName}? All participants will be notified by email about this cancellation.`,
            cancelButton: CONSTANTS.DEPOSITION_DETAILS_CANCEL_DEPOSITION_MODAL_CANCEL_BUTTON,
            confirmButton: CONSTANTS.DEPOSITION_DETAILS_CANCEL_DEPOSITION_MODAL_CONFIRM_BUTTON,
        };
    }
    if (status === Status.confirmed) {
        return {
            title: CONSTANTS.DEPOSITION_DETAILS_CONFIRM_DEPOSITION_MODAL_TITLE,
            message: `Are you sure you want to confirm ${witnessText} in the case of ${deposition.caseName}? All participants will be notified by email about this confirmation.`,
            cancelButton: CONSTANTS.DEPOSITION_DETAILS_CONFIRM_DEPOSITION_MODAL_CANCEL_BUTTON,
            confirmButton: CONSTANTS.DEPOSITION_DETAILS_CONFIRM_DEPOSITION_MODAL_CONFIRM_BUTTON,
        };
    }
    return {
        title: CONSTANTS.DEPOSITION_DETAILS_RESCHEDULE_DEPOSITION_MODAL_TITLE,
        message: `Are you sure you want to move ${witnessText} in the case of ${deposition.caseName} from Canceled to Pending? No email notification will go out until the status is changed to Confirmed.`,
        cancelButton: CONSTANTS.DEPOSITION_DETAILS_RESCHEDULE_DEPOSITION_MODAL_CANCEL_BUTTON,
        confirmButton: CONSTANTS.DEPOSITION_DETAILS_RESCHEDULE_DEPOSITION_MODAL_CONFIRM_BUTTON,
    };
};

export const getConfirmTextContent = (status: Status, deposition: DepositionModel.IDeposition) => {
    const witnessText = deposition.witness?.name ? `the deposition of ${deposition.witness.name}` : "the deposition";

    if (status === Status.pending) {
        return {
            title: CONSTANTS.DEPOSITIONS_DETAILS_EDIT_MODAL_CONFIRM_RESCHEDULE_TITLE,
            message: `Are you sure you want to reschedule ${witnessText} in the case of ${deposition.caseName}? This is still in pending status and none of the participants will be notified until the rescheduled deposition is confirmed.`,
            cancelButton: CONSTANTS.DEPOSITION_DETAILS_EDIT_MODAL_CONFIRM_NO,
            confirmButton: CONSTANTS.DEPOSITION_DETAILS_EDIT_MODAL_CONFIRM_YES,
        };
    }
    return {
        title: CONSTANTS.DEPOSITIONS_DETAILS_EDIT_MODAL_CONFIRM_RESCHEDULE_TITLE,
        message: `Are you sure you want to reschedule ${witnessText} in the case of ${deposition.caseName}? All the participants will be notified by email about this update.`,
        cancelButton: CONSTANTS.DEPOSITION_DETAILS_EDIT_MODAL_CONFIRM_NO,
        confirmButton: CONSTANTS.DEPOSITION_DETAILS_EDIT_MODAL_CONFIRM_YES,
    };
};
export default getModalTextContent;

export const getAddParticipantConfirmTextContext = ({ email, name }: { email: string; name: string }) => {
    if (email && name) {
        return {
            title: CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_CONFIRM_TITLE,
            message: `Are you sure you want to add ${name} as participant. The participant will be notified by email about this invitation`,
            cancelButton: CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_CONFIRM_CONFIRM_NO,
            confirmButton: CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_CONFIRM_CONFIRM_YES,
        };
    }
    return {
        title: CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_CONFIRM_TITLE,
        message: `Are you sure you want to add the participant? The participant will be notified by email about this invitation`,
        cancelButton: CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_CONFIRM_CONFIRM_NO,
        confirmButton: CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_CONFIRM_CONFIRM_YES,
    };
};

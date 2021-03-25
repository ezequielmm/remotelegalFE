import * as CONSTANTS from "../../../constants/inDepo";

const getLeaveModalTextContent = (isRecording: boolean, isWitness: boolean) => {
    if (isRecording && isWitness) {
        return {
            title: CONSTANTS.LEAVE_DEPOSITION_MODAL_WITNESS_ON_THE_RECORD_TITLE,
            subTitle: CONSTANTS.LEAVE_DEPOSITION_MODAL_WITNESS_ON_THE_RECORD_SUB_TITLE,
            positiveLabel: CONSTANTS.LEAVE_DEPOSITION_MODAL_WITNESS_ON_THE_RECORD_POSITIVE_BUTTON_LABEL,
            negativeLabel: "",
        };
    }
    if (isWitness) {
        return {
            title: CONSTANTS.LEAVE_DEPOSITION_MODAL_WITNESS_TITLE,
            subTitle: CONSTANTS.LEAVE_DEPOSITION_MODAL_WITNESS_SUB_TITLE,
            positiveLabel: CONSTANTS.LEAVE_DEPOSITION_MODAL_POSITIVE_BUTTON_LABEL,
            negativeLabel: CONSTANTS.LEAVE_DEPOSITION_MODAL_NEGATIVE_BUTTON_LABEL,
        };
    }
    return {
        title: CONSTANTS.LEAVE_DEPOSITION_MODAL_NO_WITNESS_TITLE,
        subTitle: CONSTANTS.LEAVE_DEPOSITION_MODAL_NO_WITNESS_SUB_TITLE,
        positiveLabel: CONSTANTS.LEAVE_DEPOSITION_MODAL_POSITIVE_BUTTON_LABEL,
        negativeLabel: CONSTANTS.LEAVE_DEPOSITION_MODAL_NEGATIVE_BUTTON_LABEL,
    };
};
export default getLeaveModalTextContent;

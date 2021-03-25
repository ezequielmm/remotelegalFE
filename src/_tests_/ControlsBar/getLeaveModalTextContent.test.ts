import getLeaveModalTextContent from "../../components/ControlsBar/helpers/getLeaveModalTextContent";
import * as CONSTANTS from "../../constants/inDepo";

test("returns correct text if isWitness and isRecording is true", () => {
    const isWitnessAndIsRecordingText = {
        title: CONSTANTS.LEAVE_DEPOSITION_MODAL_WITNESS_ON_THE_RECORD_TITLE,
        subTitle: CONSTANTS.LEAVE_DEPOSITION_MODAL_WITNESS_ON_THE_RECORD_SUB_TITLE,
        positiveLabel: CONSTANTS.LEAVE_DEPOSITION_MODAL_WITNESS_ON_THE_RECORD_POSITIVE_BUTTON_LABEL,
        negativeLabel: "",
    };
    const modalText = getLeaveModalTextContent(true, true);
    expect(modalText).toEqual(isWitnessAndIsRecordingText);
});

test("returns correct text if isWitness and isRecording is false", () => {
    const isWitnessAndIsRecordingIsFalseText = {
        title: CONSTANTS.LEAVE_DEPOSITION_MODAL_WITNESS_TITLE,
        subTitle: CONSTANTS.LEAVE_DEPOSITION_MODAL_WITNESS_SUB_TITLE,
        positiveLabel: CONSTANTS.LEAVE_DEPOSITION_MODAL_POSITIVE_BUTTON_LABEL,
        negativeLabel: CONSTANTS.LEAVE_DEPOSITION_MODAL_NEGATIVE_BUTTON_LABEL,
    };
    const modalText = getLeaveModalTextContent(false, true);
    expect(modalText).toEqual(isWitnessAndIsRecordingIsFalseText);
});
test("returns correct text if both isWitness and isRecording are false", () => {
    const isWitnessIsFalseAndIsRecordingIsFalseText = {
        title: CONSTANTS.LEAVE_DEPOSITION_MODAL_NO_WITNESS_TITLE,
        subTitle: CONSTANTS.LEAVE_DEPOSITION_MODAL_NO_WITNESS_SUB_TITLE,
        positiveLabel: CONSTANTS.LEAVE_DEPOSITION_MODAL_POSITIVE_BUTTON_LABEL,
        negativeLabel: CONSTANTS.LEAVE_DEPOSITION_MODAL_NEGATIVE_BUTTON_LABEL,
    };
    const modalText = getLeaveModalTextContent(false, false);
    expect(modalText).toEqual(isWitnessIsFalseAndIsRecordingIsFalseText);
});

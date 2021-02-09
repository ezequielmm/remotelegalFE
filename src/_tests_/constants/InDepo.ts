import { timeZone } from "../mocks/transcription";

export const END_DEPO_DATATRACK_MESSAGE = JSON.stringify({ module: "endDepo", value: "" });
export const JOIN_DEPOSITION_MOCK = {
    token: "1234",
    witnessEmail: "test@test.com",
    timeZone,
    isOnTheRecord: false,
};
export const JOIN_BREAKROOM_MOCK = "1234";
export const JOIN_DEPOSITION_MOCK_EMPTY_DEPOSITION = {
    ...JOIN_DEPOSITION_MOCK,
    transcriptions: [],
};
export const WAITING_FOR_WITNESS = "waiting for witness";
export const ROUTE = "/deposition/join/:depositionID";
export const BREAKROOM_ROUTE = "/deposition/join/:depositionID/breakroom/:breakroomID";
export const TEST_ROUTE = "/deposition/join/test1234";
export const TEST_BREAKROOM_ROUTE = "/deposition/join/test1234/breakroom/:breakroomID";
export const OFF_PILL = "off the record";
export const ON_PILL = "on the record";
export const END_DEPO_MODAL_FIRST_TEXT = "End deposition for all participants?";
export const END_DEPO_MODAL_SECOND_TEXT = "All participants will be disconnected from this deposition.";
export const CANCEL_BUTTON = "No, stay";
export const CONFIRMATION_BUTTON = "Yes, end deposition";
export const PERMISSIONS_MOCK = ["EndDeposition", "Recording"];
export const COURT_REPORTER = "Court Reporter";
export const TECH_EXPERT = "Tech Expert";

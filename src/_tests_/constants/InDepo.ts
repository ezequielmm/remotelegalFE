import { Roles } from "../../models/participant";
import { timeZone } from "../mocks/transcription";

export const JOIN_DEPOSITION_MOCK = {
    token: "1234",
    witnessEmail: "test@test.com",
    startDate: "2021-09-28T06:00:00-03:00",
    timeZone,
    isOnTheRecord: false,
    participants: [],
};
export const IDENTITY_MOCK = jest.fn().mockImplementation(() =>
    JSON.stringify({
        name: "test1234",
        role: "Witness",
        email: "test@test.com",
    })
);
export const JOIN_BREAKROOM_MOCK = "1234";
export const JOIN_DEPOSITION_MOCK_EMPTY_DEPOSITION = {
    ...JOIN_DEPOSITION_MOCK,
    transcriptions: [],
};
export const WAITING_FOR_WITNESS = "waiting for witness";
export const ROUTE = "/deposition/join/:depositionID";
export const PRE_ROUTE = "/deposition/pre/:depositionID";
export const WAITING_ROUTE = "/deposition/pre/:depositionID/waiting";
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

export const MOCKED_EMAIL = "test@test.com";
export const PARTICIPANT_MOCK_NAME = "Participant Name";

export const PARTICIPANT_MOCK_ROLE = Roles.attorney;

export const getParticipant = (number) => ({
    creationDate: "2021-03-19T19:31:35-04:00",
    email: `${number}${MOCKED_EMAIL}`,
    hasJoined: null,
    id: `3810fda6-452b-4dec-374f-08d8eb0cd14${number}`,
    isAdmitted: false,
    name: `${number}${PARTICIPANT_MOCK_NAME}`,
    phone: "3333333333",
    role: PARTICIPANT_MOCK_ROLE,
    user: {
        emailAddress: `${number}${MOCKED_EMAIL}`,
        firstName: `${number}${PARTICIPANT_MOCK_NAME}`,
        id: "3609bde4-2c2c-4b2a-4407-08d8ef971c49",
        lastName: "",
    },
});

export const getWaitingRoomParticipants = () => [getParticipant(0)];
export const NON_WITNESS_NON_REGISTERED_EXPECTED_REDIRECT_BODY = { pathname: "/sign-up", state: { email: undefined } };
export const WITNESS_EXPECTED_REDIRECT_BODY = { pathname: "/deposition/end", state: { isWitness: true } };
export const NETWORK_ERROR = "An unexpected error occurred!";
export const DEVICES_MOCK = {
    videoForBE: {
        name: "test1235",
        status: "available",
    },
    microphoneForBE: {
        name: "test123",
    },
    speakersForBE: {
        name: "test124345",
    },
    audio: "test123",
    video: "test1235",
    speakers: "test124345",
};
export const FIRST_DEVICES_BODY = {
    camera: {
        name: DEVICES_MOCK.videoForBE.name,
        status: DEVICES_MOCK.videoForBE.status,
    },
    microphone: {
        name: DEVICES_MOCK.microphoneForBE.name,
    },
    speakers: {
        name: DEVICES_MOCK.speakersForBE.name,
    },
};
export const CONNECTION_UNSTABLE = "Your connection is unstable";
export const NETWORK_INDICATOR_TEST_ID = "NETWORK_INDICATOR";
export const COPY_INVITATION_BUTTON_TEST_ID = "copy_invitation_button";

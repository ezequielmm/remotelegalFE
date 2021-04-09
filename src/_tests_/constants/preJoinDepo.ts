import { Roles } from "../../models/participant";

export const STEP_1_TEXT = "STEP 1 OF 2";
export const STEP_2_TEXT = "STEP 2 OF 2";
export const ROLE = "Attorney";
export const BACK_BUTTON_ID = "back-button";
export const MOCKED_EMAIL = "test@test.com";
export const MOCKED_NAME = "test";
export const DEPO_ID = "depoId";
export const TOKEN = "test1234";
export const MOCKED_PASSWORD = "1234";
export const PARTICIPANT_MOCK_NAME = "Participant Name";
export const PARTICIPANT_MOCK_ROLE = Roles.attorney;
export const PARTICIPANT_MOCK = {
    creationDate: "2021-03-19T19:31:35-04:00",
    email: MOCKED_EMAIL,
    hasJoined: null,
    id: "3810fda6-452b-4dec-374f-08d8eb0cd148",
    isAdmitted: false,
    name: PARTICIPANT_MOCK_NAME,
    phone: "3333333333",
    role: PARTICIPANT_MOCK_ROLE,
};

export const WIZARD_STEP_1_TEXT = "STEP 1 OF 2";
export const WIZARD_STEP_2_TEXT = "STEP 2 OF 2";
export const LOGGED_USER_EMAIL = "test1234@test.com";
export const SIGN_IN_ERROR = "Incorrect email or password. Please try again.";

export const getUserDepoStatusWithParticipantNotAdmitted = (isUser) => ({
    isUser,
    participant: PARTICIPANT_MOCK,
});

export const getUserDepoStatusWithParticipantAdmitted = () => ({
    participant: { ...PARTICIPANT_MOCK, isAdmitted: true },
});

export const getUserDepoStatusWithoutParticipant = (isUser) => ({
    isUser,
    participant: {
        ...PARTICIPANT_MOCK,
        isAdmitted: false,
    },
});

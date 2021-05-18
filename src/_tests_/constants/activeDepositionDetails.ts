import moment from "moment-timezone";

export const EXPECTED_EDIT_DEPOSITION_BODY = {
    details: "test notes",
    endDate: "2021-03-24T20:32:37.757Z",
    isVideoRecordingNeeded: false,
    job: "test job 1234",
    startDate: moment(new Date()).add(30, "minutes").utc(),
    status: "Confirmed",
    timeZone: "ET",
};
export const EXPECTED_EDIT_REQUESTER_BODY = {
    requesterNotes: "test123",
};
export const EXPECTED_REACTIVATED_TO_PENDING_DEPO_BODY = {
    details: "test details",
    endDate: "2021-03-24T20:32:37.757Z",
    isVideoRecordingNeeded: true,
    job: "testJob1234",
    startDate: moment(new Date()).add(30, "minutes").utc(),
    status: "Pending",
    timeZone: "ET",
};

export const EXPECTED_DEPOSITION_BODY = {
    details: "test notes",
    endDate: "2021-03-24T20:32:37.757Z",
    isVideoRecordingNeeded: false,
    job: "test job 1234",
    startDate: "2021-04-21T10:00:00+00:00",
    status: "Confirmed",
    timeZone: "ET",
};
export const ACTIVE_DEPO_DETAILS_ROUTE = "/deposition/details/";
export const ACTIVE_POST_DEPO_DETAILS_ROUTE = "/deposition/post-depo-details/:depositionID";
export const EDIT_PARTICIPANT_BODY = {
    email: "test@test.com",
    id: "3810fda6-452b-4dec-374f-08d8eb0cd148",
    name: "Participant Name",
    phone: "3333333333",
    role: "Paralegal",
};

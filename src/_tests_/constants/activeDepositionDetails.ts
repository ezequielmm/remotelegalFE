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

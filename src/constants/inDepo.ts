import moment from "moment-timezone";

export const FETCH_ERROR_RESULT_TITLE = "Sorry! We couldn't connect to the deposition.";
export const FETCH_ERROR_RESULT_BODY = "Something went wrong, please refresh the page to try again.";
export const FETCH_ERROR_RESULT_BUTTON = "Refresh Page";

export const TRANSCRIPTIONS_PAUSED =
    "Transcription paused - Once the deposition is on the record, transcript will resume.";
export const getPauseText = (from, to, timeZone) =>
    `Transcript paused from ${moment(from).tz(timeZone).format("hh:mm:ss A")} to ${
        to && moment(to).tz(timeZone).format("hh:mm:ss A")
    }`;

export const CLOCK_SECOND = 1000;

export const CONTROLS_BAR_ON_THE_RECORD_LABEL = "Go on the record";
export const CONTROLS_BAR_OFF_THE_RECORD_LABEL = "Go off the record";
export const CONTROLS_BAR_END_LABEL = "End Deposition";
export const CONTROLS_BAR_EXHIBITS_LABEL = "Exhibits";
export const CONTROLS_BAR_REAL_TIME_LABEL = "Real Time";
export const CONTROLS_BAR_BREAKROOMS_LABEL = "Breakrooms";
export const CONTROLS_BAR_SUMMARY_LABEL = "Summary";
export const CONTROLS_BAR_SUPPORT_LABEL = "Support";
export const CONTROLS_BAR_JOIN_BUTTON = "JOIN";

export const COPY_LINK_ALERT_DURATION = 4;
export const COPY_LINK_TITLE = "Deposition information";
export const COPY_LINK_DESCRIPTION = "Invite participants to join the deposition.";
export const COPY_LINK_BUTTON = "COPY INVITE LINK";
export const COPY_LINK_SUCCESS_MSG = "Invite link has been copied to the clipboard";
export const COPY_LINK_ERROR_MSG = "Error copying the invite to the clipboard";

export const REAL_TIME_PILL = "ROUGH DRAFT: NOT FOR OFFICIAL USE";

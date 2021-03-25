import moment from "moment-timezone";
import { ConnectOptions } from "twilio-video";

export const TWILIO_VIDEO_CONFIG: ConnectOptions = {
    video: { height: 720, frameRate: 24, width: 1280 },
    bandwidthProfile: {
        video: {
            mode: "collaboration",
            //    maxTracks: 10,
            dominantSpeakerPriority: "standard",
            renderDimensions: {
                high: { height: 1080, width: 1920 },
                standard: { height: 720, width: 1280 },
                low: { height: 176, width: 144 },
            },
        },
    },
    maxAudioBitrate: 16000,
    preferredVideoCodecs: [{ codec: "VP8", simulcast: true }],
    networkQuality: { local: 1, remote: 1 },
    dominantSpeaker: true,
};
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
export const CONTROLS_BAR_LEAVE_DEPOSITION_BUTTON = "Leave";
export const CONTROLS_BAR_LEAVE_DEPOSITION_BUTTON_TEST_ID = "in_deposition_leave_deposition_button";
export const CONTROLS_BAR_BREAKROOMS_PRIVACITY_DESCRIPTION = "Not recorded - Everything you say will remain private.";

export const COPY_LINK_ALERT_DURATION = 4;
export const COPY_LINK_TITLE = "Deposition information";
export const COPY_LINK_DESCRIPTION = "Invite participants to join the deposition.";
export const COPY_LINK_BUTTON = "COPY INVITE LINK";
export const COPY_LINK_SUCCESS_MSG = "Invite link has been copied to the clipboard";
export const COPY_LINK_ERROR_MSG = "Error copying the invite to the clipboard";

export const REAL_TIME_PILL = "ROUGH DRAFT: NOT FOR OFFICIAL USE";

export const BREAKROOM_ON_THE_RECORD_TITLE = "Deposition is on the record";
export const BREAKROOM_ON_THE_RECORD_MESSAGE =
    "Deposition needs to be off the record in order to have access to breakrooms.";

export const GUEST_REQUESTS_DENY_BUTTON_TEST_ID = "guest_request_notificatio_deny";
export const GUEST_REQUESTS_ALLOW_BUTTON_TEST_ID = "guest_request_notificatio_allow";
export const GUEST_REQUESTS_DENY_TEXT = "DENY ENTRY";
export const GUEST_REQUESTS_DENY_MODAL_TITLE = "Deny entry?";
export const GUEST_REQUESTS_DENY_MODAL_SUBTITLE = "won't be able to enter the deposition.";
export const GUEST_REQUESTS_DENY_MODAL_POSITIVE_LABEL = "YES, DENY";
export const GUEST_REQUESTS_ALLOW_TEXT = "ADMIT";
export const GUEST_REQUESTS_ALLOW_MODAL_TITLE = "Admit entry?";
export const GUEST_REQUESTS_ALLOW_MODAL_SUBTITLE =
    "will enter the deposition. Once admitted, you wont be able to remove the participant.";
export const GUEST_REQUESTS_ALLOW_MODAL_POSITIVE_LABEL = "YES, ADMIT";
export const GUEST_REQUESTS_NOTIFICATION_TITLE = " wants to join.";
export const GUEST_REQUESTS_MODAL_NEGATIVE_LABEL = "Cancel";

export const NETWORK_ERROR = "An unexpected error occurred! Please try again";
export const LEAVE_DEPOSITION_MODAL_NO_WITNESS_TITLE = "Leave deposition before it ends?";
export const LEAVE_DEPOSITION_MODAL_NO_WITNESS_SUB_TITLE =
    "You will not be able to access the exhibits, transcripts, or video until the deposition ends. You will receive an email notification once the files are available. Do you still want to leave the deposition before it has ended?";
export const LEAVE_DEPOSITION_MODAL_WITNESS_TITLE = "Leave deposition?";
export const LEAVE_DEPOSITION_MODAL_WITNESS_SUB_TITLE = "Are you sure you want to leave the deposition before it ends?";
export const LEAVE_DEPOSITION_MODAL_WITNESS_ON_THE_RECORD_TITLE = "The deposition is ON the record.";
export const LEAVE_DEPOSITION_MODAL_WITNESS_ON_THE_RECORD_SUB_TITLE =
    "You cannot leave the deposition while it´s ON the record.";
export const LEAVE_DEPOSITION_MODAL_POSITIVE_BUTTON_LABEL = "Yes, leave";
export const LEAVE_DEPOSITION_MODAL_WITNESS_ON_THE_RECORD_POSITIVE_BUTTON_LABEL = "Ok";
export const LEAVE_DEPOSITION_MODAL_NEGATIVE_BUTTON_LABEL = "No, stay";

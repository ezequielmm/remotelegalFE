import moment from "moment-timezone";
import { ConnectOptions } from "twilio-video";
import { mapTimeZone } from "../models/general";

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

export const CURRENT_USER_CHAT_MESSAGE_TIME_TEST_ID = "current_user_chat_message_time";
export const CHAT_MESSAGE_TIME_TEST_ID = "chat_message_time";
export const CURRENT_USER_CHAT_MESSAGE_TEST_ID = "current_user_chat_message";
export const CHAT_MESSAGE_TEST_ID = "chat_message";
export const COULDNT_SEND_MESSAGE_TEST_ID = "couldnt_send_message";
export const CHAT_TEST_ID = "chat";
export const CHAT_DROPDOWN_TEST_ID = "chat_dropdown";
export const CHAT_CONTROL_TEST_ID = "chat_control";
export const UNREADED_CHATS_TEST_ID = "unreaded_chats";
export const CHAT_ERROR_TEST_ID = "chat_error";
export const CHAT_INPUT_TEST_ID = "chat_input";
export const CHAT_INPUT_BUTTON_TEST_ID = "chat_input_button";
export const CHAT_TRY_AGAIN_TEST_ID = "chat_error_screen_button";

export const COULDNT_SEND_MESSAGE = "Couldn't send the message. Please try again.";

export const TRANSCRIPTIONS_PAUSED =
    "Transcription paused - Once the deposition is on the record, transcript will resume.";
export const getPauseText = (from, to, timeZone) =>
    `Transcript paused from ${moment(from).tz(mapTimeZone[timeZone])?.format("hh:mm:ss A")} to ${
        to && moment(to).tz(mapTimeZone[timeZone])?.format("hh:mm:ss A")
    }`;

export const CLOCK_SECOND = 1000;

export const CONTROLS_BAR_ON_THE_RECORD_LABEL = "Go on the record";
export const CONTROLS_BAR_OFF_THE_RECORD_LABEL = "Go off the record";
export const CONTROLS_BAR_END_LABEL = "End Deposition";
export const CONTROLS_BAR_EXHIBITS_LABEL = "Exhibits";
export const CONTROLS_BAR_REAL_TIME_LABEL = "Real Time";
export const CONTROLS_BAR_BREAKROOMS_LABEL = "Breakrooms";
export const CONTROLS_BAR_SUMMARY_LABEL = "Summary";
export const CONTROLS_BAR_CHAT_LABEL = "Chat";
export const CONTROLS_BAR_SUPPORT_LABEL = "Need Help?";
export const CONTROLS_BAR_MORE_LABEL = "More";
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

export const CHAT_TITLE = "Chat";

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

export const MOCK_DEPO_USER_STATUS_ERROR = "We couldn´t start the deposition. Please refresh the browser";
export const NETWORK_ERROR = "An unexpected error occurred!";
export const TRY_AGAIN = "Please try again";
export const REFRESH_CHAT = "Refresh Chat";
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
export const PRE_DEPOSITION_START_TIME_DESCRIPTION =
    "Welcome to the Pre-Deposition Lobby. You can upload Exhibits in preparation for the Deposition here. Invited participants will be automatically redirected to the Deposition once the Court Reporter joins. Guests who joined from a shared link will first need to be reviewed by the Court Reporter before entering the Deposition. ";

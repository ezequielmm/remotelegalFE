import React from "react";
import DepositionDetailsSection from "../routes/ActiveDepoDetails/components/ActiveDepoDetailsSection";
import ParticipantListTable from "../routes/ActiveDepoDetails/components/ParticipantListTable";

export enum DEPOSITION_DETAILS_TABS {
    "Additional Information",
    "Invited Parties",
}

export const DEFAULT_ACTIVE_TAB = "Additional Information";

export type DEPOSITION_DETAILS_TAB = "Additional Information";

export interface DepositionDetailsTabData {
    tabId: string;
    tabTestId: string;
    title: string;
    DepositionDetailsComponent: React.FC<any>;
    tabPaneTestId: string;
}

export const DEPOSITION_DETAILS_TABS_DATA = [
    {
        tabId: DEPOSITION_DETAILS_TABS[0],
        tabTestId: "additional_information",
        title: "ADDITIONAL INFORMATION",
        DepositionDetailsComponent: DepositionDetailsSection,
        tabPaneTestId: "additional_information_tab_pane",
    },
    {
        tabId: DEPOSITION_DETAILS_TABS[1],
        tabTestId: "invited_parties",
        title: "INVITED PARTIES",
        DepositionDetailsComponent: ParticipantListTable,
        tabPaneTestId: "invited_parties_tab_pane",
    },
] as DepositionDetailsTabData[];

export const DEPOSITION_DETAILS_INVITED_PARTIES_TITLE = "Invited Parties";
export const DEPOSITION_DETAILS_INVITED_PARTIES_DATA_TEST_ID = "deposition_title_invited_parties";
export const DEPOSITION_DETAILS_DELETE_MODAL_TITLE = "Delete participant?";
export const DEPOSITION_DETAILS_DELETE_MODAL_SUBTITLE = "Are you sure you want to delete this participant?";
export const DEPOSITION_DETAILS_DELETE_MODAL_CONFIRM_BUTTON_LABEL = "yes, delete";
export const DEPOSITION_DETAILS_DELETE_MODAL_CANCEL_BUTTON_LABEL = "No, keep it";
export const DEPOSITION_DETAILS_INVITED_PARTIES_COLUMNS = [
    {
        title: "ROLE",
        dataIndex: "role",
        ellipsis: true,
        sorter: true,
        width: "20%",
    },
    {
        title: "NAME",
        dataIndex: "name",
        ellipsis: true,
        sorter: true,
        width: "25%",
    },
    {
        title: "EMAIL",
        dataIndex: "email",
        ellipsis: true,
        sorter: true,
        width: "25%",
    },
    {
        title: "PHONE NUMBER",
        dataIndex: "phone",
        ellipsis: true,
    },
];

export const DEPOSITION_DETAILS_ADD_PARTICIPANT_BUTTON = "Add Participant";
export const DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_TITLE = "Add Participant";
export const DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_DATA_TEST_ID_TITLE =
    "deposition_details_add_participant_modal_title";
export const DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_ROLE_SELECT_PLACEHOLDER = "Please select a role";
export const DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_DATA_TEST_ID_ROLE =
    "deposition_details_add_participant_modal_role_select";
export const DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_ROLES = [
    "Attorney",
    "Court Reporter",
    "Interpreter",
    "Observer",
    "Tech Expert",
    "Paralegal",
];
export const DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_DATA_TEST_ID_INVALID_ROLE =
    "deposition_details_add_participant_modal_role_select_invalid";
export const DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_ROLE_SELECT_INVALID_ROLE = "Please select a role";
export const DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_EMAIL_PLACEHOLDER = "Please enter the participant´s email";
export const DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_DATA_TEST_ID_EMAIL =
    "deposition_details_add_participant_modal_email_input";

export const DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_DATA_TEST_ID_INVALID_EMAIL =
    "deposition_details_add_participant_modal_email_invalid";

export const DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_EMAIL_INVALID = "Please enter a valid email";
export const DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_NAME_PLACEHOLDER = "Please enter the participant´s name";
export const DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_DATA_TEST_ID_NAME =
    "deposition_details_add_participant_modal_name";
export const DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_PHONE_PLACEHOLDER = "Please enter the participant´s phone number";
export const DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_DATA_TEST_ID_PHONE =
    "deposition_details_add_participant_modal_phone";
export const DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_DATA_TEST_ID_INVALID_PHONE =
    "deposition_details_add_participant_modal_phone_invalid";
export const DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_PHONE_INVALID = "Please enter a valid phone number";
export const DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_CANCEL_BUTTON_TEXT = "Cancel";
export const DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_CANCEL_BUTTON_TEST_ID =
    "deposition_details_add_participant_cancel_button";
export const DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_CONFIRM_BUTTON_TEXT = "Add Participant";
export const DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_CONFIRM_BUTTON_TEST_ID =
    "deposition_details_add_participant_confirm_button";
export const DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_ADDED_PARTICIPANT_TOAST =
    "The participant was successfully added";
export const DEPOSITION_DETAILS_REMOVE_PARTICIPANT_TOAST = "The participant was successfully removed";
export const DEPOSITION_DETAILS_TITLE = "Deposition details";
export const DEPOSITION_REQUESTER_TITLE = "Requester";
export const DEPOSITION_DETAILS_HEADER_CASE = "Case";
export const DEPOSITION_DETAILS_HEADER_WITNESS = "Witness";
export const DEPOSITION_DETAILS_HEADER_DATE = "Date and time";
export const DEPOSITION_DETAILS_HEADER_JOB = "JOB #";
export const DEPOSITION_DETAILS_COURT_REPORTER_TITLE = "Court Reporter";
export const DEPOSITION_REQUESTER_USER_TITLE = "Requester name";
export const DEPOSITION_REQUESTER_MAIL = "Email address";
export const DEPOSITION_REQUESTER_COMPANY = "Company";
export const DEPOSITION_REQUESTER_PHONE = "Phone number";
export const DEPOSITION_REQUESTER_NOTES = "Notes";
export const DEPOSITION_DETAILS_STATUS_TITLE = "Status";
export const DEPOSITION_DETAILS_JOB_TITLE = "Job #";
export const DEPOSITION_DETAILS_CAPTION_TITLE = "Caption";
export const DEPOSITION_NO_PARTICIPANT_TEXT = "To be defined";
export const DEPOSITION_NO_JOB_TEXT = "To be defined";
export const DEPOSITION_ADDITIONAL_INFORMATION_TEXT = "Additional Information";
export const DEPOSITION_CARD_DETAILS_TITLE = "Details";
export const DEPOSITION_CARD_DETAILS_ACTION_TRIGGER = "edit";
export const DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID = "edit_button";
export const DEPOSITION_VIDEO_RECORDING_TITLE = "Video Recording";
export const DEPOSITION_VIDEO_RECORDING_TRUE_TEXT = "Yes";
export const DEPOSITION_VIDEO_RECORDING_FALSE_TEXT = "No";
export const DEPOSITION_SPECIAL_REQUEST_TITLE = "Special Request";
export const DEPOSITION_NO_TEXT = "None";
export const FORMAT_DATE = "MMM D, YYYY";
export const FORMAT_TIME = "hh:mm A";
export const DEPOSITION_CREATED_TEXT_DATA_TEST_ID = "deposition_details_creation_text";
export const DEPOSITION_REQUESTED_TEXT_DATA_TEST_ID = "deposition_details_requested_text";
export const CAPTION_NETWORK_ERROR = "Sorry, we couldn´t get the file. Please try again";
export const NETWORK_ERROR = "An unexpected error occurred! Please try again";
export const DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_PARTICIPANT_ALREADY_EXISTS_ERROR = "Participant already exists";
export const DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_TITLE = "Details";
export const DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_DATA_TEST_ID_TITLE =
    "deposition_details_edit_deposition_modal_title";
export const DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_DATA_TEST_ID_STATUS =
    "deposition_details_edit_deposition_modal_status";
export const DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_STATUS_OPTIONS = ["Pending", "Confirmed", "Canceled"];
export const DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_DATA_TEST_ID_JOB = "deposition_details_edit_deposition_modal_job";
export const DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_RADIO_LABEL =
    "DOES THE WITNESS TESTIMONY NEED TO BE VIDEO RECORDED?";
export const DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_RADIO_LABEL_TOOLTIP =
    'Choosing "Yes" for this option will provide you with a time-stamped video of the witness testimony on the record. Please ensure that all parties agree to this option before choosing.';
export const DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_DATA_TEST_ID_VIDEO_RECORDING_RADIO_GROUP =
    "deposition_details_edit_deposition_modal_video_recording_radio_group";
export const DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_RADIO_OPTIONS = [
    { value: true, label: "YES" },
    { value: false, label: "NO" },
];
export const DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_DATA_TEST_ID_DETAILS =
    "deposition_details_edit_deposition_modal_details";
export const DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CANCEL_BUTTON_TEXT = "Cancel";
export const DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CANCEL_BUTTON_TEST_ID =
    "deposition_details_edit_deposition_cancel_button";
export const DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CONFIRM_BUTTON_TEXT = "Save";
export const DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CONFIRM_BUTTON_TEST_ID =
    "deposition_details_edit_deposition_confirm_button";
export const DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CAPTION_BUTTON_TEST_ID =
    "deposition_details_edit_deposition_caption_button";
export const DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CAPTION_BUTTON_REMOVE_FILE_TEST_ID =
    "deposition_details_edit_deposition_caption_button_remove_file";
export const DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_UPLOAD_COMPONENT_DATA_TEST_ID =
    "deposition_details_edit_deposition_upload_component";
export const DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_FILE_ERROR_MESSAGE_DATA_TEST_ID =
    "deposition_details_edit_deposition_file_error_message";
export const DEPOSITION_DETAILS_EDIT_REQUESTER_MODAL_TITLE = "Requester";
export const DEPOSITION_DETAILS_EDIT_REQUESTER_MODAL_DATA_TEST_ID_TITLE =
    "deposition_details_edit_requester_modal_title";
export const DEPOSITION_DETAILS_EDIT_REQUESTER_MODAL_DATA_TEST_ID_INPUT =
    "deposition_details_edit_requester_modal_input";
export const DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_FILE_ERROR_MESSAGE = "File must be a pdf";
export const DEPOSITION_DETAILS_EDIT_REQUESTER_MODAL_CANCEL_BUTTON_TEXT = "Cancel";
export const DEPOSITION_DETAILS_EDIT_REQUESTER_MODAL_CANCEL_BUTTON_TEST_ID =
    "deposition_details_edit_requester_cancel_button";
export const DEPOSITION_DETAILS_EDIT_REQUESTER_MODAL_CONFIRM_BUTTON_TEXT = "Save";
export const DEPOSITION_DETAILS_EDIT_REQUESTER_MODAL_CONFIRM_BUTTON_TEST_ID =
    "deposition_details_edit_requester_confirm_button";
export const DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_SUCCESS_TOAST = "The deposition was successfully updated";
export const DEPOSITION_DETAILS_CANCEL_DEPOSITION_MODAL_TITLE = "Cancel Deposition";
export const DEPOSITION_DETAILS_CONFIRM_DEPOSITION_MODAL_TITLE = "Confirm Deposition";
export const DEPOSITION_DETAILS_RESCHEDULE_DEPOSITION_MODAL_TITLE = "Reschedule Deposition";
export const DEPOSITION_DETAILS_CANCEL_DEPOSITION_MODAL_CANCEL_BUTTON = "No, keep it";
export const DEPOSITION_DETAILS_CANCEL_DEPOSITION_MODAL_CONFIRM_BUTTON = "Yes, cancel";
export const DEPOSITION_DETAILS_CONFIRM_DEPOSITION_MODAL_CANCEL_BUTTON = "No, keep it";
export const DEPOSITION_DETAILS_CONFIRM_DEPOSITION_MODAL_CONFIRM_BUTTON = "Yes, confirm";
export const DEPOSITION_DETAILS_RESCHEDULE_DEPOSITION_MODAL_CANCEL_BUTTON = "No, keep it";
export const DEPOSITION_DETAILS_RESCHEDULE_DEPOSITION_MODAL_CONFIRM_BUTTON = "Yes, reschedule";
export const DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_INVALID_CANCEL_DATE_MESSAGE_DATA_TEST_ID =
    "deposition_details_edit_deposition_invalid_cancel_date_message";
export const DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_INVALID_CANCEL_DATE_MESSAGE =
    "You can´t cancel a deposition that will start in a minute";

export const DATE_FORMAT = "MM/DD/YYYY";
export const DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_DATA_TEST_ID_DATE = "deposition_details_edit_deposition_date_id";
export const DATE_LABEL = "Date";
export const DATE_PLACEHOLDER = "MM/DD/YYYY";
export const START_LABEL = "START";
export const START_PLACEHOLDER = "hh:mm AM";
export const END_LABEL = "END (OPTIONAL)";
export const END_PLACEHOLDER = "hh:mm AM";

export const TIME_PICKER_PROPS = {
    allowClear: false,
    minuteStep: 30,
    hideDisabledOptions: true,
    use12Hours: true,
    format: "hh:mm A",
    showNow: false,
};

export const DATE_PICKER_PROPS = {
    allowClear: false,
    format: DATE_FORMAT,
};

export const DEPOSITIONS_DETAILS_EDIT_MODAL_INVALID_DATE_DATA_TEST_ID = "deposition_details_edit_modal_invalid_date";
export const DEPOSITIONS_DETAILS_EDIT_MODAL_INVALID_DATE = "Invalid date";

export const DEPOSITIONS_DETAILS_EDIT_MODAL_INVALID_START_TIME_TEST_ID = "invalid-start-time";
export const DEPOSITIONS_DETAILS_EDIT_MODAL_INVALID_START_TIME = "Invalid start time";
export const DEPOSITIONS_DETAILS_EDIT_MODAL_INVALID_END_TIME_TEST_ID = "invalid-end-time";
export const DEPOSITIONS_DETAILS_EDIT_MODAL_INVALID_END_TIME = "Invalid end time";

export const DEPOSITIONS_DETAILS_EDIT_MODAL_CONFIRM_RESCHEDULE_TITLE = "Reschedule Deposition";
export const DEPOSITION_DETAILS_EDIT_MODAL_CONFIRM_NO = "NO, KEEP IT";
export const DEPOSITION_DETAILS_EDIT_MODAL_CONFIRM_YES = "YES, RESCHEDULE";
export const DEPOSITION_DETAILS_EDIT_MODAL_CONFIRM_TEST_ID = "deposition_modal_edit_modal_confirm_test_id";

export const DEPOSITION_DETAILS_EDIT_MODAL_TIMEZONE_LABEL = "TIME ZONE";

export const DEPOSITION_DETAILS_SUMMARY_SECTION_DATE_TITLE = "DATE";
export const DEPOSITION_DETAILS_SUMMARY_SECTION_DATE_FORMAT = "MMMM DD, YYYY";

export const DEPOSITION_DETAILS_SUMMARY_SECTION_TIME_TITLE = "TIME";

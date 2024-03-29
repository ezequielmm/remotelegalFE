import Button from "@rl/prp-components-library/src/components/Button";

// eslint-disable-next-line import/prefer-default-export
export const SCHEDULE_DEPOSITION = "Schedule Deposition";

export const CASE_SELECT_PLACEHOLDER = "Type case name";

export const OPTIONAL_EMAIL_LABEL = "Email Address (Optional)";
export const EMAIL_LABEL = "Email Address";
export const EMAIL_PLACEHOLDER = "Type email address";

export const OPTIONAL_NAME_LABEL = "Name (Optional)";
export const NAME_LABEL = "Name";
export const WITNESS_NAME_PLACEHOLDER = "Type witness name";
export const NAME_PLACEHOLDER = "Type name";

export const OPTIONAL_PHONE_LABEL = "Phone Number (Optional)";
export const PHONE_LABEL = "Phone Number";
export const PHONE_PLACEHOLDER = "Enter phone number";

export const DATE_LABEL = "Date";
export const DATE_PLACEHOLDER = "MM/DD/YYYY";

export const START_LABEL = "Start";
export const START_PLACEHOLDER = "hh:mm AM";

export const END_LABEL = "End (Optional)";
export const END_PLACEHOLDER = "hh:mm AM";

export const UPLOAD_CAPTION_LABEL = "CAPTION (Optional)";
export const UPLOAD_CAPTION_PLACEHOLDER = "UPLOAD CAPTION";
export const UPLOAD_BUTTON_LABEL = "Upload Caption";

export const TIME_ZONE_LABEL = "Time Zone";
export const TIME_ZONE_PLACEHOLDER = "Time Zone";

export const DETAILS_LABEL = "Any Special Request or Comment";
export const DETAILS_PLACEHOLDER = "Add a request or comment...";

export const RESCORD_LABEL = "Does the witness testimony need to be video recorded?";
export const RESCORD_TOOLTIP = `Choosing "Yes" for this option will provide you with a time-stamped video of the witness testimony on the record. Please ensure that all parties agree to this option before choosing.`;

export const CASE_ERROR = "Select a Case";
export const DATE_ERROR = "Please enter a date";
export const EMAIL_ERROR = "Please enter a valid Email address";
export const EMAIL_REQUIRED_ERROR = "Please enter an Email address";
export const INVALID_START_TIME_ERROR = "Invalid start time";
export const REMOTE_LEGAL_PHONE_NUMBER = "(646) 461-3400";
export const REMOTE_LEGAL_SCHEDULING_EMAIL = "scheduling@remotelegal.com";
export const INVALID_START_TIME_ERROR_END_USER_TEST_ID = "INVALID_START_TIME_ERROR_END_USER_TEST_ID";
export const INVALID_START_TIME_ERROR_END_USER = (
    <span data-testid={INVALID_START_TIME_ERROR_END_USER_TEST_ID}>
        To schedule within 48 hours, please call {REMOTE_LEGAL_PHONE_NUMBER} or email{" "}
        <Button type="link" danger href={`mailto:${REMOTE_LEGAL_SCHEDULING_EMAIL}`}>
            {REMOTE_LEGAL_SCHEDULING_EMAIL}
        </Button>
    </span>
);
export const INVALID_END_TIME_ERROR = "Invalid end time";
export const PHONE_ERROR = "Please enter a valid Phone Number";
export const NAME_REQUIRED_ERROR = "Please enter a Name";
export const OPTION_ERROR = "Select an option";
export const PDF_ERROR = "File must be a pdf";
export const REQUIRED_TIME_ERROR = "Please enter a time";

export const DATE_FORMAT = "MM/DD/YYYY";
export const TIME_FORMAT = "hh:mm A";

export const CASE_TITLE = "Select or add a case";
export const CASE_SUBTITLE = "To select or add a case please complete the information below.";

export const WITNESS_TITLE = "Deponent/Witness";
export const WITNESS_SUBTITLE = "To add a deponent/witness please complete the information below. ";

export const DETAILS_TITLE = "Details";
export const DETAILS_SUBTITLE = "This information will be visible for all invited parties.";

export const REQUESTER_TITLE = "Requester";

export const getSuccessDepositionTitle = (createdDepositions) =>
    `${createdDepositions} depositions successfully scheduled`;
export const SUCCESS_DEPOSITION_SUBTITLE = "You can schedule a new deposition or go to your depositions.";
export const SCHEDULE_NEW_DEPOSITION = "SCHEDULE NEW DEPOSITION";
export const GO_TO_DEPOSITIONS = "GO TO MY DEPOSITIONS";

export const DEPOSITION_DEFAULT_VALUE = {
    witness: {
        name: "",
        email: "",
        phone: null,
    },
    file: null,
    date: null,
    startTime: "",
    endTime: "",
    timeZone: "ET",
    isVideoRecordingNeeded: null,
};

export const CREATE_DEPOSITION_DEFAULT_VALUES = {
    caseId: null,
    depositions: [DEPOSITION_DEFAULT_VALUE],
    details: "",
    requesterEmail: "",
    requesterPhone: null,
    requesterName: "",
};

export const TIME_PICKER_PROPS = {
    allowClear: false,
    minuteStep: 30,
    hideDisabledOptions: true,
    use12Hours: true,
    format: "hh:mm A",
    showNow: false,
};

export const WITNESSES_LIMIT = 10;
export const ADD_WITNESS_BUTTON_TEST_ID = "add_witness_button";
export const INVALID_CASE_MESSAGE = "Please select a Case";

export const SCHEDULED_DEPO_WARNING = (
    <span>
        IF YOU ARE BOOKING A DEPOSITION WITHIN 48 HOURS, PLEASE CALL REMOTE LEGAL AT{" "}
        <strong>{REMOTE_LEGAL_PHONE_NUMBER}</strong> OR EMAIL{" "}
        <strong>
            <a href={`mailto:${REMOTE_LEGAL_SCHEDULING_EMAIL}`} target="_blank" rel="noreferrer">
                {REMOTE_LEGAL_SCHEDULING_EMAIL}.
            </a>
        </strong>
    </span>
);

export const SCHEDULED_DEPO_WARNING_TEST_ID = "SCHEDULED_DEPO_WARNING_TEST_ID";

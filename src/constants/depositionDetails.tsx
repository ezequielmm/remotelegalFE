import React from "react";
import Text from "prp-components-library/src/components/Text";
import { formatBytes } from "../helpers/formatBytes";
import DepositionDetailsSummary from "../routes/DepositionDetails/DepositionDetailsSummary";
import DepositionDetailsEnteredExhibits from "../routes/DepositionDetails/DepositionDetailsEnteredExhibits";
import DepositionDetailsTranscript from "../routes/DepositionDetails/DepositionDetailsTranscript";
import DepositionDetailsAttendees from "../routes/DepositionDetails/DepositionDetailsAttendees";

export enum DEPOSITION_DETAILS_TABS {
    summary = "summary",
    transcript = "transcript",
    enteredExhibits = "entered_exhibits",
    attendees = "attendees",
}

export const DETAILS_SUMMARY_VIDEO_TITLE = "Recording";
export const DETAILS_SUMMARY_TRANSCRIPT_TITLE = "Transcript";
export const DETAILS_SUMMARY_TRANSCRIPT_SUBTITLE =
    "Once the Certified transcript is finished, you can download it from the transcripts tab.";
export const DETAILS_SUMMARY_TOTAL_TIME_TEXT = "total time";
export const DETAILS_SUMMARY_ON_THE_RECORD_TEXT = "on the record";
export const DETAILS_SUMMARY_OFF_THE_RECORD_TEXT = "off the record";

export const DETAILS_TRANSCRIPT_TITLE = "Transcript";
export const DETAILS_TRANSCRIPT_BUTTON_NOTIFY = "Notify parties";
export const DETAILS_TRANSCRIPT_BUTTON_DOWNLOAD = "Download";
export const DETAILS_TRANSCRIPT_BUTTON_TEST_ID = "deposition_details_download_button";
export const DETAILS_TRANSCRIPT_NOTIFY_BUTTON_TEST_ID = "deposition_details_notify_button";
export const DETAILS_TRANSCRIPT_UPLOAD_BUTTON_TEST_ID = "deposition_details_upload_button";
export const DETAILS_TRANSCRIPT_UPLOAD_PROGRESS_BAR_TEST_ID = "deposition_details_progress_bar";
export const DETAILS_TRANSCRIPT_BUTTON_UPLOAD = "Upload transcript";
export const DETAILS_EXHIBIT_FILE_EXCEEDS_LIMIT = "Exhibit size exceeds the allowed limit";

export const DEFAULT_ACTIVE_TAB = "summary";

export const DEPOSITION_DETAILS_ATTENDEES_COLUMNS = [
    {
        title: "ROLE",
        dataIndex: "role",
        ellipsis: true,
        render: (record) => <Text>{record}</Text>,
        width: "20%",
    },
    {
        title: "NAME",
        dataIndex: "name",
        ellipsis: true,
        render: (record) => <Text>{record}</Text>,
        width: "25%",
    },
    {
        title: "EMAIL",
        dataIndex: "email",
        ellipsis: true,
        render: (record) => <Text>{record}</Text>,
        width: "25%",
    },
    {
        title: "PHONE NUMBER",
        dataIndex: "phone",
        render: (record) => <Text>{record}</Text>,
        ellipsis: true,
    },
];

export type DEPOSITION_DETAILS_TAB = "summary";

export interface DepositionDetailsTabData {
    tabId: string;
    tabTestId: string;
    title: string;
    DepositionDetailsComponent: React.FC<any>;
    tabPaneTestId: string;
}

export const DEPOSITION_DETAILS_TABS_DATA = [
    {
        tabId: DEPOSITION_DETAILS_TABS.summary,
        tabTestId: "summary_tab",
        title: "SUMMARY",
        DepositionDetailsComponent: DepositionDetailsSummary,
        tabPaneTestId: "summary_tab_pane",
    },
    {
        tabId: DEPOSITION_DETAILS_TABS.transcript,
        tabTestId: "transcript_tab",
        title: "TRANSCRIPT",
        DepositionDetailsComponent: DepositionDetailsTranscript,
        tabPaneTestId: "transcript_tab_pane",
    },
    {
        tabId: DEPOSITION_DETAILS_TABS.enteredExhibits,
        tabTestId: "entered_exhibits",
        title: "ENTERED EXHIBITS",
        DepositionDetailsComponent: DepositionDetailsEnteredExhibits,
        tabPaneTestId: "entered_exhibits_tab_pane",
    },
    {
        tabId: DEPOSITION_DETAILS_TABS.attendees,
        tabTestId: "attendees",
        title: "ATTENDEES",
        DepositionDetailsComponent: DepositionDetailsAttendees,
        tabPaneTestId: "attendees_tab_pane",
    },
] as DepositionDetailsTabData[];

export const DEPOSITION_DETAILS_TITLE = "Deposition details";
export const DEPOSITION_BACK_TO_DEPOSITIONS = "BACK TO MY DEPOSITIONS";

export const VIDEO_PLACEHOLDER_TITLE = "The recording will be ready soon";
export const VIDEO_PLACEHOLDER_SUBTITLE = "Once the recording is uploaded, you will see it here.";

export const DEPOSITION_DETAILS_HEADER_CASE = "Case";
export const DEPOSITION_DETAILS_HEADER_WITNESS = "Witness";
export const DEPOSITION_DETAILS_HEADER_DATE = "Date and time";
export const DEPOSITION_DETAILS_HEADER_JOB = "JOB #";
export const FORMAT_DATE = "MMM D, YYYY";
export const FORMAT_TIME = "hh:mm A";

export const REAL_TIME_PILL = "ROUGH DRAFT: NOT FOR OFFICIAL USE";

export const DEPOSITION_DETAILS_DOWNLOAD_TITLE = "DOWNLOAD";
export const DEPOSITION_DETAILS_COURT_REPORTER_TITLE = "COURT REPORTER";
export const DEPOSITION_DETAILS_INVITED_PARTIES_TITLE = "ATTENDEES";
export const DEPOSITION_DETAILS_ENTERED_EXHIBITS_TITLE = "Entered Exhibits";
export const DEPOSITION_DETAILS_ATTENDEES_TITLE = "Attendees";

export const DEPOSITION_DETAILS_ATTENDEES_TEST_ID = "attendees_title";

export const DEPOSITION_DETAILS_TRANSCRIPTS_COLUMNS = [
    {
        title: "Name",
        dataIndex: "displayName",
        key: "displayName",
        ellipsis: true,
        render: (record) => <Text>{record}</Text>,
    },
    {
        title: "Size",
        dataIndex: "size",
        key: "size",
        ellipsis: true,
        render: (size: number) => <Text>{formatBytes(size, 0)}</Text>,
    },
];

export const DEPOSITION_DETAILS_TRANSCRIPT_ROUGH_TYPE = "DraftTranscription";
export const DEPOSITION_DETAILS_DELETABLE_TRANSCRIPT_TYPE = "Transcription";
export const DEPOSITION_DETAILS_SUMMARY_DOWNLOAD_RECORDING_TITLE = "RECORDING";
export const NETWORK_ERROR = "An unexpected error occurred! Please try again";
export const DEPOSITION_DETAILS_REMOVE_TRANSCRIPT_TOAST = "The transcript was successfully removed";

export const DEPOSITION_DETAILS_DELETE_MODAL_TITLE = "Delete file?";
export const DEPOSITION_DETAILS_DELETE_MODAL_SUBTITLE = "This action cannot be undone. Are you sure you want to delete";
export const DEPOSITION_DETAILS_DELETE_MODAL_NO = "NO, KEEP IT";
export const DEPOSITION_DETAILS_DELETE_MODAL_YES = "YES, DELETE FILE";

export const DEPOSITION_DETAILS_SUMMARY_DOWNLOAD_TITLE = "RECORDING";
export const DEPOSITION_DETAILS_SUMMARY_DOWNLOAD_ROUGH_DRAFT_TITLE = "ROUGH DRAFT TRANSCRIPT";
export const DEPOSITION_DETAILS_SUMMARY_FILE_SIZE_LIMIT = 52428800;
export const DEPOSITION_DETAILS_EMAIL_SENT_MESSAGE = "An email has been sent to all invited parties";

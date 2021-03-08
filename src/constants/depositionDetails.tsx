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
export const DETAILS_TRANSCRIPT_BUTTON_UPLOAD = "Upload transcript";

export const DEFAULT_ACTIVE_TAB = "summary";

export const DEPOSITION_DETAILS_ATTENDEES_COLUMNS = [
    {
        title: "ROLE",
        dataIndex: "role",
        ellipsis: true,
        width: "20%",
    },
    {
        title: "NAME",
        dataIndex: "name",
        ellipsis: true,
        width: "25%",
    },
    {
        title: "EMAIL",
        dataIndex: "email",
        ellipsis: true,
        width: "25%",
    },
    {
        title: "PHONE NUMBER",
        dataIndex: "phone",
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

export const DEPOSITON_DETAILS_TITLE = "Deposition details";

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
export const DEPOSITION_DETAILS_ENTERED_EXHIBITS_TITLE = "ENTERED EXHIBITS";
export const DEPOSITION_DETAILS_ATTENDEES_TITLE = "Attendees";

export const DEPOSITION_DETAILS_ATTENDEES_TEST_ID = "attendees_title";

export const DEPOSITION_DETAILS_TRANSCRIPTS_COLUMNS = [
    {
        title: "Name",
        dataIndex: "displayName",
        key: "displayName",
    },
    {
        title: "Size",
        dataIndex: "size",
        key: "size",
        render: (size: number) => formatBytes(size, 0),
    },
];

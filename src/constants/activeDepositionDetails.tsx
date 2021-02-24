import React from "react";
import DepositionDetailsSection from "../routes/ActiveDepoDetails/components/ActiveDepoDetailsSection";

export enum DEPOSITION_DETAILS_TABS {
    "Additional Information",
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
] as DepositionDetailsTabData[];

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
export const DEPOSITION_VIDEO_RECORDING_TITLE = "Video Recording";
export const DEPOSITION_VIDEO_RECORDING_TRUE_TEXT = "Yes";
export const DEPOSITION_VIDEO_RECORDING_FALSE_TEXT = "No";
export const DEPOSITION_SPECIAL_REQUEST_TITLE = "Special Request";
export const DEPOSITION_NO_TEXT = "None";
export const FORMAT_DATE = "MMM D, YYYY";
export const FORMAT_TIME = "hh:mm A";
export const DEPOSITION_CREATED_TEXT_DATA_TEST_ID = "deposition_details_creation_text";
export const DEPOSITION_REQUESTED_TEXT_DATA_TEST_ID = "deposition_details_requested_text";
export const NETWORK_ERROR = "Sorry, we couldn´t get the file. Please try again";

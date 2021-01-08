import { ReactComponent as Live } from "../assets/in-depo/Live.svg";
import EnteredExhibits from "../routes/InDepo/Exhibits/EnteredExhibits";
import { ExhibitTabData } from "../routes/InDepo/Exhibits/ExhibitTabs/ExhibitTabs";
import LiveExhibits from "../routes/InDepo/Exhibits/LiveExhibits";
import MyExhibits from "../routes/InDepo/Exhibits/MyExhibits";

export enum EXHIBIT_TABS {
    "myExhibits",
    "enteredExhibits",
    "liveExhibits",
}

export const DEFAULT_ACTIVE_TAB = EXHIBIT_TABS[0];

export const EXHIBIT_TABS_DATA = [
    {
        tabId: EXHIBIT_TABS[0],
        tabTestId: "my_exhibits_tab",
        title: "MY EXHIBITS",
        subTitle: "Only I can see this",
        ExhibitComponent: MyExhibits,
        tabPaneTestId: "my_exhibits_tab_pane",
    },
    {
        tabId: EXHIBIT_TABS[1],
        tabTestId: "entered_exhibits_tab",
        title: "ENTERED EXHIBITS",
        subTitle: "Exibits used in this deposition",
        ExhibitComponent: EnteredExhibits,
        tabPaneTestId: "entered_exhibits_tab_pane",
    },
    {
        tabId: EXHIBIT_TABS[2],
        tabTestId: "live_exhibits_tab",
        title: "LIVE EXHIBITS",
        subTitle: "Shared with everyone live",
        icon: Live,
        ExhibitComponent: LiveExhibits,
        tabPaneTestId: "live_exhibits_tab_pane",
    },
] as ExhibitTabData[];

export const MY_EXHIBITS_RESULT_TITLE = "No exhibits added yet";
export const MY_EXHIBITS_RESULT_SUBTITLE = "Start adding the exhibits that you will be using for this deposition.";
export const MY_EXHIBITS_UPLOAD_TEXT = "Uploading file...";
export const MY_EXHIBITS_UPLOAD_COMPLETE_TEXT = "File uploaded";
export const MY_EXHIBITS_UPLOAD_ERROR_TEXT = "Failed to upload";
export const MY_EXHIBITS_ALLOWED_FILE_TYPES = ".pdf,.docx,.xlsx,.pptx,.jpg,.jpeg,.png";
export const MY_EXHIBITS_RENAME_TITLE_TEXT = "Rename Exhibit";
export const MY_EXHIBITS_RENAME_SUBTITLE_TEXT = "To rename the exhibit, type the new name on the field below.";
export const MY_EXHIBITS_RENAME_NAME_LABEL = "EXHIBIT NAME";
export const MY_EXHIBITS_RENAME_OK_BUTTON_TEXT = "SAVE";
export const MY_EXHIBITS_RENAME_CANCEL_BUTTON_TEXT = "CANCEL";
export const MY_EXHIBITS_DELETE_TITLE_TEXT = "Delete Exhibit";
export const MY_EXHIBITS_DELETE_SUBTITLE_TEXT =
    "This action cannot be undone. Are you sure you want to delete the exhibit?";
export const MY_EXHIBITS_DELETE_OK_BUTTON_TEXT = "yes, delete exhibit";
export const MY_EXHIBITS_DELETE_CANCEL_BUTTON_TEXT = "no, keep it";
export const MY_EXHIBITS_TIME_TO_CLOSE_AFTER_COMPLETE = 3000;
export const MY_EXHIBITS_TIME_TO_CLOSE_AFTER_ERROR = 10000;

export const EXHIBIT_FILE_ERROR_TITLE = "Exhibit can’t be displayed";
export const EXHIBIT_FILE_ERROR_SUBTITLE = "Please try opening the Exhibit again.";

export const ENTERED_EXHIBITS_TITLE = "No exhibits added yet";
export const ENTERED_EXHIBITS_SUBTITLE = "Once someone enters an exhibit to this deposition, we will show it here";

export const LIVE_EXHIBITS_TITLE = "Nobody is showing an exhibit at the moment";
export const LIVE_EXHIBITS_SUBTITLE = "Once someone is sharing an exhibit you will see it here.";

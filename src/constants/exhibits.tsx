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

export const ENTERED_EXHIBITS_TITLE = "No exhibits added yet";
export const ENTERED_EXHIBITS_SUBTITLE = "Once someone enters an exhibit to this deposition, we will show it here";

export const LIVE_EXHIBITS_TITLE = "Nobody is showing an exhibit at the moment";
export const LIVE_EXHIBITS_SUBTITLE = "Once someone is sharing an exhibit you will see it here.";

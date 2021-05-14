import userEvent from "@testing-library/user-event";
import React from "react";
import { act } from "react-dom/test-utils";
import * as CONSTANTS from "../../constants/depositionDetails";
import { DepositionDetailsTabData } from "../../constants/depositionDetails";
import DepositionDetailsTabs from "../../routes/DepositionDetails/DepositionDetailsTabs";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import "mutationobserver-shim";

describe("DepositionDetailsTabs", () => {
    it.each(CONSTANTS.DEPOSITION_DETAILS_TABS_DATA.map((tab) => [tab.title, tab]))(
        "should have %s tab active only if it's the default tab",
        async (title, { tabId, tabTestId }: DepositionDetailsTabData) => {
            const { queryByTestId } = renderWithGlobalContext(<DepositionDetailsTabs />);
            const activeTab = queryByTestId(`${tabTestId}_active`);
            if (tabId === CONSTANTS.DEFAULT_ACTIVE_TAB) {
                expect(activeTab).toBeTruthy();
            } else {
                expect(activeTab).toBeFalsy();
            }
        }
    );

    test.each(CONSTANTS.DEPOSITION_DETAILS_TABS_DATA.map((tab, key) => [tab.title, tab, key]))(
        "should have %s tab with active color when click on it",
        async (title, { tabTestId }: DepositionDetailsTabData) => {
            const { queryByTestId } = renderWithGlobalContext(<DepositionDetailsTabs />);
            const tab = queryByTestId(tabTestId);
            if (tab) {
                await act(async () => userEvent.click(tab.firstChild));
            }
            const activeTab = queryByTestId(`${tabTestId}_active`);
            expect(activeTab).toBeTruthy();
        }
    );

    it.each(CONSTANTS.DEPOSITION_DETAILS_TABS_DATA.map((tab, key) => [tab.title, tab, key]))(
        "should open %s TabPane when click on its Tab",
        async (title, { tabTestId, tabPaneTestId }: DepositionDetailsTabData) => {
            const { queryByTestId } = renderWithGlobalContext(<DepositionDetailsTabs />);
            const tab = queryByTestId(tabTestId);
            if (tab) {
                await act(async () => userEvent.click(tab.firstChild));
            }
            const tabPane = queryByTestId(tabPaneTestId);
            expect(tabPane).toBeTruthy();
        }
    );
});

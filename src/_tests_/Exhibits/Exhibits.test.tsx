import "@testing-library/jest-dom";
import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { ThemeProvider } from "styled-components";
import * as CONSTANTS from "../../constants/exhibits";
import { theme } from "../../constants/styles/theme";
import Exhibits from "../../routes/InDepo/Exhibits";
import { ExhibitTabData } from "../../routes/InDepo/Exhibits/ExhibitTabs/ExhibitTabs";

describe("Exhibits", () => {
    it.each(CONSTANTS.EXHIBIT_TABS_DATA.map((tab) => [tab.title, tab]))(
        "should have %s tab active only if it's the default tab",
        async (title, { tabId, tabTestId }: ExhibitTabData) => {
            const { queryByTestId } = render(
                <ThemeProvider theme={theme}>
                    <Exhibits onClick={() => {}} visible />
                </ThemeProvider>
            );
            const activeTab = queryByTestId(`${tabTestId}_active`);
            if (tabId === CONSTANTS.DEFAULT_ACTIVE_TAB) {
                expect(activeTab).toBeTruthy();
            } else {
                expect(activeTab).toBeFalsy();
            }
        }
    );

    it.each(CONSTANTS.EXHIBIT_TABS_DATA.map((tab) => [tab.title, tab]))(
        "should have %s tab with active color when click on it",
        async (title, { tabTestId }: ExhibitTabData) => {
            const { getByTestId } = render(
                <ThemeProvider theme={theme}>
                    <Exhibits onClick={() => {}} visible />
                </ThemeProvider>
            );
            const tab = getByTestId(tabTestId);
            await act(async () => userEvent.click(tab));
            const activeTab = getByTestId(`${tabTestId}_active`);
            expect(activeTab).toBeTruthy();
        }
    );

    it.each(CONSTANTS.EXHIBIT_TABS_DATA.map((tab) => [tab.title, tab]))(
        "should open %s tTabPane when click on its Tab",
        async (title, { tabTestId, tabPaneTestId }: ExhibitTabData) => {
            const { getByTestId } = render(
                <ThemeProvider theme={theme}>
                    <Exhibits onClick={() => {}} visible />
                </ThemeProvider>
            );
            const tab = getByTestId(tabTestId);
            await act(async () => userEvent.click(tab));
            const tabPane = getByTestId(tabPaneTestId);
            expect(tabPane).toBeTruthy();
        }
    );
});

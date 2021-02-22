import React from "react";
import { waitForDomChange, waitForElement } from "@testing-library/react";
import DepositionDetailsEnteredExhibits from "../../routes/DepositionDetails/DepositionDetailsEnteredExhibits";

import getMockDeps from "../utils/getMockDeps";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useParams: () => ({ depositionID: "test1234" }),
}));

const customDeps = getMockDeps();

describe("DepositionDetailsEnteredExhibits", () => {
    it("show a title with DEPOSITION_DETAILS_ENTERED_EXHIBITS_TITLE constant", async () => {
        const { getByTestId } = renderWithGlobalContext(<DepositionDetailsEnteredExhibits />, customDeps);
        expect(await waitForElement(() => expect(getByTestId("entered_exhibits_title")))).toBeTruthy();
    });

    it("show a button with DEPOSITION_DETAILS_DOWNLOAD_TITLE constant", async () => {
        const { getByTestId } = renderWithGlobalContext(<DepositionDetailsEnteredExhibits />, customDeps);
        expect(await waitForElement(() => expect(getByTestId("download_button")))).toBeTruthy();
    });

    it("show a table with entered depositions table", async () => {
        const { getByTestId } = renderWithGlobalContext(<DepositionDetailsEnteredExhibits />, customDeps);
        expect(await waitForElement(() => expect(getByTestId("entered_exhibits_table")))).toBeTruthy();
    });
});

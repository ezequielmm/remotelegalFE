import React from "react";
import EndDepoScreen from "../../routes/PostDepo/EndDepoScreen/EndDepoScreen";
import * as CONSTANTS from "../constants/postDepo";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import { useEndDepoDownloadAssets } from "../../hooks/endDepo/hooks";
import getMockDeps from "../utils/getMockDeps";
import { rootReducer } from "../../state/GlobalState";

jest.mock("../../hooks/endDepo/hooks", () => ({
    useEndDepoDownloadAssets: jest.fn(),
}));

const customDeps = getMockDeps();

beforeEach(() => {
    const useEndDepoDownloadAssetsMock = useEndDepoDownloadAssets as jest.Mock;
    useEndDepoDownloadAssetsMock.mockImplementation(() => ({
        downloadAssets: jest.fn(),
    }));
});

test("End Depo Screen is shown with proper text when all the user info is loaded", async () => {
    const { getByText, queryByTestId } = renderWithGlobalContext(<EndDepoScreen />, customDeps, {
        ...rootReducer,
        initialState: {
            user: {
                ...rootReducer.initialState.user,
                currentUser: {
                    emailAddress: "test@test.com",
                    firstName: "Joe",
                    lastName: "Doe",
                },
            },
        },
    });
    expect(queryByTestId("spinner")).not.toBeInTheDocument();
    expect(getByText(CONSTANTS.END_DEPO_SCREEN_SECOND_TEXT)).toBeInTheDocument();
    expect(queryByTestId("download_assets_button")).toBeInTheDocument();
});

test("End Depo Screen user display name should be display well formatted", async () => {
    const { queryByText } = renderWithGlobalContext(<EndDepoScreen />, customDeps, {
        ...rootReducer,
        initialState: {
            user: {
                ...rootReducer.initialState.user,
                currentUser: {
                    emailAddress: "test@test.com",
                    firstName: "Joe",
                    lastName: "Doe",
                },
            },
        },
    });
    expect(queryByText(`Joe Doe, ${CONSTANTS.END_DEPO_SCREEN_FIRST_TEXT}`)).toBeInTheDocument();
});
test("Should show endDepo screen for witness", async () => {
    const { getByText } = renderWithGlobalContext(<EndDepoScreen location={{ state: { isWitness: true } }} />);
    expect(getByText(CONSTANTS.END_DEPO_SCREEN_TEXT_FOR_WITNESS)).toBeInTheDocument();
});

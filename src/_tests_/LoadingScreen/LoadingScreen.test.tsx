import React from "react";
import LoadingScreen from "../../routes/InDepo/LoadingScreen";
import { rootReducer } from "../../state/GlobalState";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";

test("Should display proper text", async () => {
    const { getByText } = renderWithGlobalContext(<LoadingScreen />);
    expect(getByText(/Loading deposition. Please wait./)).toBeInTheDocument();
});

test("Should display user name", async () => {
    const reducer: any = {
        reducer: rootReducer,
        initialState: {
            room: {
                userStatus: {
                    participant: {
                        name: "test1",
                    },
                },
            },
        },
    };
    const { getByText } = renderWithGlobalContext(<LoadingScreen />, undefined, reducer);
    expect(getByText("test1,")).toBeInTheDocument();
});

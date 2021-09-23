import React from "react";
import LoadingScreen from "../../routes/InDepo/LoadingScreen";
import { rootReducer } from "../../state/GlobalState";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import { LOADING_DEPOSITION_MESSAGE } from "../../constants/preJoinDepo";

test("Should display proper text", async () => {
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
    expect(getByText(`test1,${LOADING_DEPOSITION_MESSAGE}`)).toBeInTheDocument();
});

import React, { memo, PropsWithChildren, useReducer } from "react";
import { Deps, IGlobalContext, IGlobalReducer, IGlobalState } from "../models/general";
import combineReducers from "./utils/combineReducers";
import RoomReducer, { RoomReducerInitialState } from "./InDepo/InDepoReducer";

export const initialState: IGlobalState = {
    room: RoomReducerInitialState,
};

export const combinedReducer = combineReducers<IGlobalState>({
    room: RoomReducer,
});

export const rootReducer = {
    reducer: combinedReducer,
    initialState,
};

export const GlobalStateContext = React.createContext(null);

// Having the provider as an independent function helps when testing the custom hooks
export const defineProviderValues = (state, dispatch, deps, children) => {
    return <GlobalStateContext.Provider value={{ state, dispatch, deps }}>{children}</GlobalStateContext.Provider>;
};
export const GlobalState = memo(
    ({
        deps,
        children,
        rootReducer: globalReducer,
    }: PropsWithChildren<{ deps: Deps; rootReducer: IGlobalReducer }>) => {
        if (!rootReducer) {
            throw new Error("No rootReducer Provider");
        }
        const { reducer, initialState: globalInitialState } = globalReducer;
        const [state, dispatch] = useReducer(reducer, globalInitialState);

        return (
            <GlobalStateContext.Provider value={{ state, dispatch, deps } as IGlobalContext}>
                {children}
            </GlobalStateContext.Provider>
        );
    }
);

export default GlobalState;

import React, { memo, PropsWithChildren, useReducer } from "react";
import { Deps, IGlobalContext, IGlobalReducer, IGlobalState } from "../models/general";
import combineReducers from "./utils/combineReducers";
import RoomReducer, { RoomReducerIntialState } from "./videoChat/videoChatReducer";

export const initialState: IGlobalState = {
    room: RoomReducerIntialState,
};

export const combinedReducer = combineReducers<IGlobalState>({
    room: RoomReducer,
});

export const rootReducer = {
    reducer: combinedReducer,
    initialState,
};

export const GlobalStateContext = React.createContext(null);

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

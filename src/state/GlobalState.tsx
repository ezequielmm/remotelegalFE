import React, { memo, PropsWithChildren, useMemo, useReducer } from "react";
import { Deps, IGlobalContext, IGlobalReducer, IGlobalState } from "../models/general";
import combineReducers from "./utils/combineReducers";
import RoomReducer, { RoomReducerInitialState } from "./InDepo/InDepoReducer";
import GeneralReducer, { GeneralUiReducerInitialState } from "./GeneralUi/GeneralUiReducer";
import PostDepoReducer, { PostDepoReducerInitialState } from "./PostDepo/PostDepoReducer";
import SignalRReducer, { SignalRReducerInitialState } from "./SignalR/SignalRReducer";
import UserReducer, { UserReducerInitialState } from "./User/UserReducer";
import DepositionsListReducer, { DepositionsListReducerInitialState } from "./Depositions/DepositionsListReducer";

export const initialState: IGlobalState = {
    room: RoomReducerInitialState,
    generalUi: GeneralUiReducerInitialState,
    postDepo: PostDepoReducerInitialState,
    signalR: SignalRReducerInitialState,
    user: UserReducerInitialState,
    depositionsList: DepositionsListReducerInitialState,
};

export const combinedReducer = combineReducers<IGlobalState>({
    room: RoomReducer,
    generalUi: GeneralReducer,
    postDepo: PostDepoReducer,
    signalR: SignalRReducer,
    user: UserReducer,
    depositionsList: DepositionsListReducer,
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
        const globalStateContextValue = useMemo(
            () => ({
                state,
                dispatch,
                deps,
            }),
            [deps, state, dispatch]
        );
        return (
            <GlobalStateContext.Provider value={globalStateContextValue as IGlobalContext}>
                {children}
            </GlobalStateContext.Provider>
        );
    }
);

export default GlobalState;

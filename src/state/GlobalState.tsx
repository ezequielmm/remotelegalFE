import React, { memo, PropsWithChildren, useReducer } from "react";
import { IGlobalReducer } from "./types";

export const GlobalStateContext = React.createContext(null);

export const GlobalState = memo(({ children, rootReducer }: PropsWithChildren<{ rootReducer: IGlobalReducer }>) => {
    if (!rootReducer) {
        throw new Error("No rootReducer Provider");
    }
    const { reducer, initalState } = rootReducer;
    const [state, dispatch] = useReducer(reducer, initalState);
    return <GlobalStateContext.Provider value={{ state, dispatch }}>{children}</GlobalStateContext.Provider>;
});

export default GlobalState;

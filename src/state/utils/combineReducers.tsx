import { IGlobalReducer, IReducer } from "../types";

function combineReducers<GS>(reducerMap: Record<string, (state: any, action: any) => any>): IReducer<GS> {
    return (gState: GS, gAction: any) => {
        const nextState = Object.entries(reducerMap).reduce(
            (total, [stateKey, reducer]) => ({ ...total, [stateKey]: reducer(gState[stateKey], gAction) }),
            {} as GS
        );
        const hasChanged = !!Array.from(new Set([...Object.keys(gState), ...Object.keys(nextState)])).find(
            (key) => gState[key] !== nextState[key]
        );

        return hasChanged ? nextState : gState;
    };
}

const combineReducersWithInitialStates = (
    reducersMap: Record<string, [(state: any, action: any) => any, any | {}]>
): IGlobalReducer => {
    const globalReducers = Object.entries(reducersMap).reduce((_, [stateKey, item]) => ({ [stateKey]: item[0] }), {});
    const globalInitialStates = Object.entries(reducersMap).reduce(
        (_, [stateKey, item]) => ({ [stateKey]: item[1] }),
        {}
    );
    const combinedGlobalReducers = combineReducers(globalReducers);
    return { reducer: combinedGlobalReducers, initalState: globalInitialStates };
};

export { combineReducers, combineReducersWithInitialStates };

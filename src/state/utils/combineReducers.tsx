import { IReducer } from "../../models/general";

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

export default combineReducers;

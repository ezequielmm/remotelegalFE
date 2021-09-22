import { Reducer } from "react";
import { IAction } from "../types";
import { ACTION_TYPE } from "./GeneralUiActions";

export interface IGeneralUi {
    isSiderCollapsed: boolean;
    theme: string;
}

export const GeneralUiReducerInitialState: IGeneralUi = {
    isSiderCollapsed: true,
    theme: "default",
};

const GeneralUiReducer: Reducer<IGeneralUi, IAction> = (state: IGeneralUi, action: IAction): IGeneralUi => {
    switch (action.type) {
        case ACTION_TYPE.GENERAL_UI_CHANGE_SIDER_STATUS: {
            return {
                ...state,
                isSiderCollapsed: !state.isSiderCollapsed,
            };
        }
        case ACTION_TYPE.TOGGLE_THEME: {
            return {
                ...state,
                theme: action.payload,
            };
        }
        default:
            return state;
    }
};

export default GeneralUiReducer;
